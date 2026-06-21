const express = require('express');
const createError = require('http-errors');
const Activity = require('../models/Activity');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../utils/asyncHandler');
const { getChildForParent } = require('../utils/ownership');
const { calculateAgeInMonths } = require('../utils/age');

const router = express.Router();
const successLevels = ['needs_help', 'partial', 'completed', 'mastered'];

function validateLogInput({ durationMinutes, parentConfidence, successLevel }) {
  const duration = Number(durationMinutes);
  const confidence = Number(parentConfidence);

  if (!Number.isFinite(duration) || duration < 1 || duration > 240) {
    throw createError(400, 'durationMinutes must be a number between 1 and 240.');
  }

  if (!Number.isFinite(confidence) || confidence < 1 || confidence > 5) {
    throw createError(400, 'parentConfidence must be a number between 1 and 5.');
  }

  if (!successLevels.includes(successLevel)) {
    throw createError(400, 'successLevel must be needs_help, partial, completed, or mastered.');
  }

  return { duration, confidence };
}

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      childId,
      activityId,
      completedAt = new Date().toISOString(),
      durationMinutes,
      successLevel,
      parentConfidence,
      notes = ''
    } = req.body;

    if (
      !childId ||
      !activityId ||
      durationMinutes === undefined ||
      !successLevel ||
      parentConfidence === undefined
    ) {
      throw createError(
        400,
        'childId, activityId, durationMinutes, successLevel, and parentConfidence are required.'
      );
    }

    const { duration, confidence } = validateLogInput({ durationMinutes, parentConfidence, successLevel });
    const child = await getChildForParent(childId, req.user.parent._id);
    const parsedCompletedAt = new Date(completedAt);
    if (Number.isNaN(parsedCompletedAt.getTime())) {
      throw createError(400, 'Invalid completedAt value.');
    }

    const activity = await Activity.findOne({ _id: activityId, isActive: true });
    if (!activity) {
      throw createError(404, 'Activity not found.');
    }

    const ageInMonths = calculateAgeInMonths(child.dateOfBirth, parsedCompletedAt);
    if (ageInMonths < activity.ageBandMinMonths || ageInMonths > activity.ageBandMaxMonths) {
      throw createError(400, 'Activity is outside the selected child age band.');
    }

    const log = await ActivityLog.create({
      parentId: req.user.parent._id,
      childId,
      activityId,
      completedAt: parsedCompletedAt,
      durationMinutes: duration,
      successLevel,
      parentConfidence: confidence,
      notes: String(notes).trim()
    });

    const populated = await ActivityLog.findById(log._id)
      .populate('activityId')
      .populate('childId', 'nickname dateOfBirth');

    res.status(201).json({ log: populated });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { childId, from, to, limit = 100 } = req.query;
    const filter = { parentId: req.user.parent._id };

    if (childId) {
      await getChildForParent(childId, req.user.parent._id);
      filter.childId = childId;
    }

    if (from || to) {
      filter.completedAt = {};
      if (from) filter.completedAt.$gte = new Date(from);
      if (to) filter.completedAt.$lte = new Date(to);
    }

    const logs = await ActivityLog.find(filter)
      .sort({ completedAt: -1 })
      .limit(Number(limit))
      .populate('activityId')
      .populate('childId', 'nickname dateOfBirth');

    res.json({ logs });
  })
);

router.delete(
  '/:logId',
  asyncHandler(async (req, res) => {
    if (req.body?.confirmationText !== 'DELETE LOG') {
      throw createError(400, 'Confirmation text mismatch. Enter exactly: DELETE LOG');
    }

    const result = await ActivityLog.deleteOne({
      _id: req.params.logId,
      parentId: req.user.parent._id
    });

    if (!result.deletedCount) {
      throw createError(404, 'Log not found for this parent.');
    }

    res.json({ deleted: true, deletedAt: new Date().toISOString() });
  })
);

module.exports = router;
