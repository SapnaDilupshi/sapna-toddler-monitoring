import { useEffect, useMemo, useState } from 'react';
import GameFrame from './GameFrame';
import { useGameSession } from './gameSession';

const rounds = [
  {
    id: 'cat',
    target: 'CAT',
    clue: 'Find the cat',
    emoji: '🐱',
    answer: 'cat',
    choices: [
      { id: 'cat', label: 'Cat', emoji: '🐱' },
      { id: 'ball', label: 'Ball', emoji: '⚽' },
      { id: 'sun', label: 'Sun', emoji: '☀' }
    ]
  },
  {
    id: 'book',
    target: 'BOOK',
    clue: 'Find the book',
    emoji: '📘',
    answer: 'book',
    choices: [
      { id: 'book', label: 'Book', emoji: '📘' },
      { id: 'apple', label: 'Apple', emoji: '🍎' },
      { id: 'shoe', label: 'Shoe', emoji: '👟' }
    ]
  },
  {
    id: 'moon',
    target: 'MOON',
    clue: 'Find the moon',
    emoji: '🌙',
    answer: 'moon',
    choices: [
      { id: 'moon', label: 'Moon', emoji: '🌙' },
      { id: 'tree', label: 'Tree', emoji: '🌳' },
      { id: 'car', label: 'Car', emoji: '🚗' }
    ]
  },
  {
    id: 'cup',
    target: 'CUP',
    clue: 'Find the cup',
    emoji: '🥤',
    answer: 'cup',
    choices: [
      { id: 'cup', label: 'Cup', emoji: '🥤' },
      { id: 'fish', label: 'Fish', emoji: '🐟' },
      { id: 'hat', label: 'Hat', emoji: '🎩' }
    ]
  }
];

export default function LanguageGamePage() {
  const { state, recordCompletion, meta, formatDate } = useGameSession('language');
  const [roundIndex, setRoundIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('Pick the picture that matches the word.');

  useEffect(() => {
    setRoundIndex(0);
    setMistakes(0);
    setCompleted(false);
    setFeedback('Pick the picture that matches the word.');
  }, [state.activity?._id]);

  const currentRound = rounds[roundIndex];

  const progress = useMemo(() => Math.round((roundIndex / rounds.length) * 100), [roundIndex]);

  const handlePick = async (choice) => {
    if (state.saving || completed) return;

    if (choice.id !== currentRound.answer) {
      setMistakes((value) => value + 1);
      setFeedback(`Not quite. Look for the ${currentRound.clue.toLowerCase()}.`);
      return;
    }

    const nextRound = roundIndex + 1;
    setFeedback(`Nice! ${choice.label} matched the clue.`);

    if (nextRound >= rounds.length) {
      setCompleted(true);
      await recordCompletion({
        durationMinutes: 9,
        successLevel: 'mastered',
        parentConfidence: 5,
        notes: `Completed the picture-word match in ${meta.title} with ${mistakes} mistakes.`
      });
      return;
    }

    setRoundIndex(nextRound);
    setFeedback('Great. Keep matching the next word.');
  };

  const handleReset = () => {
    setRoundIndex(0);
    setMistakes(0);
    setCompleted(false);
    setFeedback('Pick the picture that matches the word.');
  };

  return (
    <GameFrame meta={meta} state={state}>
      <section className="card game-scene game-scene-language language-stage">
        <div className="language-header">
          <div className="game-scene-copy">
            <p className="eyebrow">Word clues</p>
            <h2>Match each picture to the spoken word</h2>
            <p>
              Read the clue, tap the picture that matches, and move to the next round. This keeps the language game focused on vocabulary, not letter building.
            </p>
          </div>
          <div className="language-chip-row">
            <div className="language-chip">
              <span>Round</span>
              <strong>{Math.min(roundIndex + 1, rounds.length)}/{rounds.length}</strong>
            </div>
            <div className="language-chip">
              <span>Mistakes</span>
              <strong>{mistakes}</strong>
            </div>
            <div className="language-chip">
              <span>Progress</span>
              <strong>{progress}%</strong>
            </div>
          </div>
        </div>

        <div className="language-target-card">
          <div className="language-target-icon" aria-hidden="true">
            {currentRound.emoji}
          </div>
          <div>
            <span className="language-target-kicker">Word clue</span>
            <h3>{currentRound.clue}</h3>
            <p>Tap the matching picture card below.</p>
          </div>
          <div className="language-target-word">{currentRound.target}</div>
        </div>

        <div className="language-choice-grid">
          {currentRound.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="language-choice"
              onClick={() => handlePick(choice)}
              disabled={state.saving}
            >
              <span className="language-choice-emoji">{choice.emoji}</span>
              <strong>{choice.label}</strong>
              <small>{choice.id === currentRound.answer ? 'Correct match' : 'Try another'}</small>
            </button>
          ))}
        </div>

        <div className="language-feedback-row">
          <div className="language-feedback-card">
            <span>Feedback</span>
            <strong>{feedback}</strong>
          </div>
          <button className="secondary-btn language-reset" type="button" onClick={handleReset} disabled={state.saving}>
            Restart
          </button>
        </div>

        <div className="game-detail-strip">
          <div>
            <span>Last logged</span>
            <strong>{state.recentLogs[0] ? formatDate(state.recentLogs[0].completedAt) : 'None yet'}</strong>
          </div>
          <div>
            <span>Studio note</span>
            <strong>Picture to word matching</strong>
          </div>
        </div>
      </section>
    </GameFrame>
  );
}
