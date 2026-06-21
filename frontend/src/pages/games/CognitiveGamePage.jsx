import { useEffect, useMemo, useState } from 'react';
import GameFrame from './GameFrame';
import { useGameSession } from './gameSession';

const TARGET_BOARD = [5, 4, 3, 1, 6, 2];
const START_BOARD = [4, 6, 1, 5, 3, 2];

const BALL_STYLES = {
  1: { className: 'ball-blue', label: '1' },
  2: { className: 'ball-purple', label: '2' },
  3: { className: 'ball-green', label: '3' },
  4: { className: 'ball-gold', label: '4' },
  5: { className: 'ball-red', label: '5' },
  6: { className: 'ball-teal', label: '6' }
};

function sameBoard(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function TubeBall({ value, selected, onClick }) {
  const style = BALL_STYLES[value] || BALL_STYLES[1];
  return (
    <button
      type="button"
      className={`tube-ball ${style.className} ${selected ? 'tube-ball-selected' : ''}`}
      onClick={onClick}
    >
      <span>{style.label}</span>
    </button>
  );
}

export default function CognitiveGamePage() {
  const { state, recordCompletion, meta, formatDate } = useGameSession('cognitive');
  const [board, setBoard] = useState(START_BOARD);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setBoard(START_BOARD);
    setSelectedIndex(null);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
  }, [state.activity?._id]);

  useEffect(() => {
    if (!completed && sameBoard(board, TARGET_BOARD) && state.activity && !state.saving) {
      setCompleted(true);
      recordCompletion({
        durationMinutes: Math.max(1, Math.round((seconds || 1) / 60) + 1),
        successLevel: 'mastered',
        parentConfidence: 5,
        notes: `Matched the colored-ball example in ${meta.title} with ${moves} moves.`
      });
    }
  }, [board, completed, meta.title, moves, recordCompletion, seconds, state.activity, state.saving]);

  const progress = useMemo(() => {
    const fixed = board.filter((value, index) => value === TARGET_BOARD[index]).length;
    return Math.round((fixed / TARGET_BOARD.length) * 100);
  }, [board]);

  const handleSlotClick = (index) => {
    if (state.saving || completed) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    setBoard((current) => {
      const next = [...current];
      [next[selectedIndex], next[index]] = [next[index], next[selectedIndex]];
      return next;
    });
    setMoves((value) => value + 1);
    setSelectedIndex(null);
  };

  const handleReset = () => {
    setBoard(START_BOARD);
    setSelectedIndex(null);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
  };

  return (
    <GameFrame meta={meta} state={state}>
      <section className="card cognitive-stage puzzle-stage">
        <div className="puzzle-header">
          <div>
            <p className="eyebrow">Attention puzzle</p>
            <h2>Place the colored balls to match the example</h2>
            <p>
              Tap one ball, then tap another ball to swap them. Match the preview rack to finish the round and save the log automatically.
            </p>
          </div>
          <div className="puzzle-badge-row">
            <div className="puzzle-chip">
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="puzzle-chip">
              <span>Time</span>
              <strong>{seconds}s</strong>
            </div>
            <div className="puzzle-chip">
              <span>Match</span>
              <strong>{progress}%</strong>
            </div>
          </div>
        </div>

        <div className="puzzle-scene">
          <div className="puzzle-scene-label">Example</div>
          <div className="tube-rack tube-rack-preview" aria-label="example arrangement">
            {[0, 2, 4].map((startIndex, tubeIndex) => (
              <div className="tube-column" key={`preview-${tubeIndex}`}>
                <div className="tube-body">
                  {[TARGET_BOARD[startIndex], TARGET_BOARD[startIndex + 1]].map((value, slotIndex) => (
                    <div className="tube-slot" key={`${tubeIndex}-${slotIndex}`}>
                      {value ? <div className={`tube-ball tube-ball-static ${BALL_STYLES[value].className}`}><span>{value}</span></div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="puzzle-board-wrap">
          <div className="puzzle-scene-label">Your board</div>
          <div className="puzzle-board">
            <div className="puzzle-board-topline">
              <span>{completed ? 'Completed!' : 'Swap balls until the rack matches the example.'}</span>
              <button className="secondary-btn puzzle-reset" type="button" onClick={handleReset} disabled={state.saving}>
                Restart
              </button>
            </div>
            <div className="tube-rack tube-rack-live" aria-label="playboard">
              {[0, 2, 4].map((startIndex, tubeIndex) => (
                <div className="tube-column" key={`live-${tubeIndex}`}>
                  <div className="tube-body tube-body-live">
                    {[board[startIndex], board[startIndex + 1]].map((value, slotOffset) => {
                      const index = startIndex + slotOffset;
                      return (
                        <div className="tube-slot" key={`${tubeIndex}-${slotOffset}`}>
                          <TubeBall
                            value={value}
                            selected={selectedIndex === index}
                            onClick={() => handleSlotClick(index)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="puzzle-footer">
          <div>
            <span>Last logged</span>
            <strong>{state.recentLogs[0] ? formatDate(state.recentLogs[0].completedAt) : 'None yet'}</strong>
          </div>
          <div>
            <span>Tip</span>
            <strong>Make the preview rack and live rack look the same.</strong>
          </div>
        </div>
      </section>
    </GameFrame>
  );
}
