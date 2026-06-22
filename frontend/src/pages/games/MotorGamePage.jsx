import { useEffect, useMemo, useState } from 'react';
import GameFrame from './GameFrame';
import GameCompletionCard from './GameCompletionCard';
import { useGameSession } from './gameSession';

const pads = [
  { id: 'cloud', label: 'Cloud', icon: '☁' },
  { id: 'drum', label: 'Drum', icon: '🥁' },
  { id: 'leaf', label: 'Leaf', icon: '🍃' },
  { id: 'sun', label: 'Sun', icon: '☀' },
  { id: 'moon', label: 'Moon', icon: '☾' }
];

const route = [1, 3, 0, 4, 2, 1];

export default function MotorGamePage() {
  const { state, recordCompletion, meta, formatDate } = useGameSession('motor');
  const [stepIndex, setStepIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setMisses(0);
    setStreak(0);
    setDone(false);
  }, [state.activity?._id]);

  const activeIndex = route[stepIndex] ?? route[route.length - 1];

  const progress = useMemo(() => Math.round((stepIndex / route.length) * 100), [stepIndex]);

  const handleTap = async (padIndex) => {
    if (state.saving || done) return;

    if (padIndex !== activeIndex) {
      setMisses((value) => value + 1);
      setStreak(0);
      return;
    }

    const nextStep = stepIndex + 1;
    setStepIndex(nextStep);
    setStreak((value) => value + 1);

    if (nextStep >= route.length) {
      setDone(true);
      await recordCompletion({
        durationMinutes: 8,
        successLevel: 'mastered',
        parentConfidence: 5,
        notes: `Completed the trail chase in ${meta.title} with ${misses} misses and a ${streak + 1}-step streak.`
      });
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setMisses(0);
    setStreak(0);
    setDone(false);
  };

  return (
    <GameFrame meta={meta} state={state} hideSuccessMessage={done}>
      {done ? (
        <GameCompletionCard
          meta={meta}
          lastLoggedAt={state.recentLogs[0] ? formatDate(state.recentLogs[0].completedAt) : ''}
          onPlayAgain={handleReset}
          saving={state.saving}
        />
      ) : (
        <section className="card game-scene game-scene-motor motor-stage">
        <div className="motor-header">
          <div className="game-scene-copy">
            <p className="eyebrow">Movement reaction</p>
            <h2>Follow the light down the trail</h2>
            <p>Tap the glowing pad before it moves on.</p>
          </div>
          <div className="motor-chip-row">
            <div className="motor-chip">
              <span>Steps</span>
              <strong>{Math.min(stepIndex, route.length)}/{route.length}</strong>
            </div>
            <div className="motor-chip">
              <span>Streak</span>
              <strong>{streak}</strong>
            </div>
            <div className="motor-chip">
              <span>Misses</span>
              <strong>{misses}</strong>
            </div>
          </div>
        </div>

        <div className="motor-track-shell">
          <div className="motor-track-labels">
            <span>Start</span>
            <span>Light trail</span>
            <span>Finish</span>
          </div>
          <div className="motor-track">
            {pads.map((pad, index) => {
              const isActive = index === activeIndex;
              const isCleared = route.slice(0, stepIndex).includes(index);
              return (
                <button
                  key={pad.id}
                  type="button"
                  className={`motor-pad ${isActive ? 'motor-pad-active' : ''} ${isCleared ? 'motor-pad-cleared' : ''}`}
                  onClick={() => handleTap(index)}
                  disabled={state.saving || done}
                >
                  <span className="motor-pad-icon">{pad.icon}</span>
                  <strong>{pad.label}</strong>
                  <small>{isActive ? 'Tap now' : 'Waiting'}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="motor-progress-row">
          <div>
            <span>Trail progress</span>
            <strong>{progress}%</strong>
          </div>
          <progress max={100} value={progress} />
          <button className="secondary-btn motor-reset" type="button" onClick={handleReset} disabled={state.saving}>
            Restart
          </button>
        </div>
        </section>
      )}
    </GameFrame>
  );
}
