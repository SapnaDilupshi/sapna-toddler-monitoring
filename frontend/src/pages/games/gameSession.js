import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { GAME_META } from './gameMeta';

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
}

function getBestActivity(activities, gameKey, activityId) {
  const exact = activities.find((activity) => activity._id === activityId);
  if (exact) return exact;
  return activities.find((activity) => activity.domain === gameKey) || null;
}

export function useGameSession(gameKey) {
  const { user } = useAuth();
  const [refreshToken, setRefreshToken] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: '',
    childId: '',
    childName: '',
    childAge: '',
    activity: null,
    dashboard: null,
    recentLogs: [],
    consent: null,
    saving: false,
    successMessage: ''
  });

  const query = useMemo(() => new URLSearchParams(window.location.search), [refreshToken]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        return;
      }

      const childId = query.get('childId') || '';
      const childName = query.get('childName') || '';
      const childAge = query.get('childAge') || '';
      const activityId = query.get('activityId') || '';

      if (!childId) {
        setState((current) => ({
          ...current,
          loading: false,
          error: 'Select a child from the dashboard first.',
          childId,
          childName,
          childAge
        }));
        return;
      }

      setState((current) => ({
        ...current,
        loading: true,
        error: '',
        childId,
        childName,
        childAge
      }));

      const token = await user.getIdToken();
      const request = (path, options = {}) => apiRequest(path, { ...options, token });

      try {
        const [activityResult, dashboardResult, consentResult, logsResult] = await Promise.allSettled([
          request(`/activities?childId=${childId}`),
          request(`/dashboard/${childId}`),
          request('/consent/status'),
          request(`/logs?childId=${childId}&limit=8`)
        ]);

        if (cancelled) return;

        const activities = activityResult.status === 'fulfilled' ? activityResult.value.activities || [] : [];
        const activity = getBestActivity(activities, gameKey, activityId);

        setState((current) => ({
          ...current,
          loading: false,
          error:
            activityResult.status === 'rejected'
              ? activityResult.reason.message
              : current.error,
          activity,
          dashboard: dashboardResult.status === 'fulfilled' ? dashboardResult.value : null,
          consent: consentResult.status === 'fulfilled' ? consentResult.value : null,
          recentLogs: logsResult.status === 'fulfilled' ? logsResult.value.logs || [] : []
        }));
      } catch (error) {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load the activity page.'
        }));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [gameKey, query, refreshToken, user]);

  async function recordCompletion({ durationMinutes, successLevel, parentConfidence, notes }) {
    if (!state.childId || !state.activity?._id || !user) {
      setState((current) => ({
        ...current,
        error: 'Unable to record this activity right now.'
      }));
      return false;
    }

    setState((current) => ({ ...current, saving: true, error: '', successMessage: '' }));

    try {
      const token = await user.getIdToken();
      await apiRequest('/logs', {
        method: 'POST',
        token,
        body: {
          childId: state.childId,
          activityId: state.activity._id,
          completedAt: new Date().toISOString(),
          durationMinutes,
          successLevel,
          parentConfidence,
          notes
        }
      });
      setState((current) => ({
        ...current,
        saving: false,
        successMessage: 'Activity saved automatically.',
        error: ''
      }));
      setRefreshToken((value) => value + 1);
      return true;
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error.message || 'Could not save the activity log.'
      }));
      return false;
    }
  }

  return {
    state,
    recordCompletion,
    reload: () => setRefreshToken((value) => value + 1),
    formatDate,
    meta: GAME_META[gameKey]
  };
}
