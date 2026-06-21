const express = require('express');
const createError = require('http-errors');
const WeeklyReport = require('../models/WeeklyReport');
const { asyncHandler } = require('../utils/asyncHandler');
const { getChildForParent } = require('../utils/ownership');
const { generateWeeklyReport } = require('../services/reportService');

const router = express.Router();

router.post(
  '/generate-weekly',
  asyncHandler(async (req, res) => {
    const { childId } = req.body;
    if (!childId) {
      throw createError(400, 'childId is required.');
    }

    await getChildForParent(childId, req.user.parent._id);

    const report = await generateWeeklyReport({
      parentId: req.user.parent._id,
      childId,
      referenceDate: new Date()
    });

    res.status(201).json({ report });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { childId } = req.query;
    const filter = { parentId: req.user.parent._id };

    if (childId) {
      await getChildForParent(childId, req.user.parent._id);
      filter.childId = childId;
    }

    const reports = await WeeklyReport.find(filter).sort({ weekStart: -1 }).limit(50);
    res.json({ reports });
  })
);

module.exports = router;
