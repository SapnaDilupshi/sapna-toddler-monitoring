import { useEffect, useMemo, useState } from 'react';
import GameFrame from './GameFrame';
import { useGameSession } from './gameSession';

const scenes = [
  {
    id: 'share',
    scene: 'A friend is waiting for a turn with the red blocks.',
    prompt: 'What is the helpful choice?',
    correct: 'share',
    icon: '🧱',
    mood: 'Turn taking',
    choices: [
      { id: 'share', label: 'Share the blocks', detail: 'Help the friend have a turn.' },
      { id: 'grab', label: 'Grab them back', detail: 'Keep the blocks to yourself.' },
      { id: 'ignore', label: 'Walk away', detail: 'Leave the friend waiting.' }
    ]
  },
  {
    id: 'comfort',
    scene: 'A child looks sad after a tower falls over.',
    prompt: 'What helps the most?',
    correct: 'comfort',
    icon: '🧸',
    mood: 'Comforting',
    choices: [
      { id: 'comfort', label: 'Offer help', detail: 'Be kind and rebuild together.' },
      { id: 'laugh', label: 'Laugh', detail: 'This could hurt feelings.' },
      { id: 'take', label: 'Take the toys away', detail: 'This does not help.' }
    ]
  },
  {
    id: 'wait',
    scene: 'The swing is busy and a child wants a turn next.',
    prompt: 'What is the calm choice?',
    correct: 'wait',
    icon: '🛝',
    mood: 'Patience',
    choices: [
      { id: 'wait', label: 'Wait patiently', detail: 'The child will get a turn soon.' },
      { id: 'push', label: 'Push ahead', detail: 'This is not fair.' },
      { id: 'yell', label: 'Yell loudly', detail: 'This can upset others.' }
    ]
  },
  {
    id: 'ask',
    scene: 'A toy is out of reach on the shelf.',
    prompt: 'What should the child do?',
    correct: 'ask',
    icon: '🗣️',
    mood: 'Problem solving',
    choices: [
      { id: 'ask', label: 'Ask for help', detail: 'A grown-up can help safely.' },
      { id: 'climb', label: 'Climb the shelf', detail: 'This could be unsafe.' },
      { id: 'throw', label: 'Throw things', detail: 'This is not a good choice.' }
    ]
  }
];

export default function SocialEmotionalGamePage() {
  const { state, recordCompletion, meta, formatDate } = useGameSession('social_emotional');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState('Choose the helpful response.');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSceneIndex(0);
    setMistakes(0);
    setFeedback('Choose the helpful response.');
    setDone(false);
  }, [state.activity?._id]);

  const currentScene = scenes[sceneIndex];

  const progress = useMemo(() => Math.round((sceneIndex / scenes.length) * 100), [sceneIndex]);

  const handlePick = async (choice) => {
    if (state.saving || done) return;

    if (choice.id !== currentScene.correct) {
      setMistakes((value) => value + 1);
      setFeedback(`Try the choice that best helps in a ${currentScene.mood.toLowerCase()} moment.`);
      return;
    }

    const nextScene = sceneIndex + 1;
    setFeedback('That helps the moment. Nice choice!');

    if (nextScene >= scenes.length) {
      setDone(true);
      await recordCompletion({
        durationMinutes: 10,
        successLevel: 'mastered',
        parentConfidence: 5,
        notes: `Completed the helping hands stage in ${meta.title} with ${mistakes} mistakes.`
      });
      return;
    }

    setSceneIndex(nextScene);
    setFeedback('Great. Let’s try the next scene.');
  };

  const handleReset = () => {
    setSceneIndex(0);
    setMistakes(0);
    setFeedback('Choose the helpful response.');
    setDone(false);
  };

  return (
    <GameFrame meta={meta} state={state}>
      <section className="card game-scene game-scene-social social-stage">
        <div className="social-header">
          <div className="game-scene-copy">
            <p className="eyebrow">Kind choices</p>
            <h2>Read the scene and choose the helpful response</h2>
            <p>
              Each scene asks the child to pick the kind or calm response. It keeps the social-emotional game focused on decision making, not emotion naming.
            </p>
          </div>
          <div className="social-chip-row">
            <div className="social-chip">
              <span>Scene</span>
              <strong>{Math.min(sceneIndex + 1, scenes.length)}/{scenes.length}</strong>
            </div>
            <div className="social-chip">
              <span>Mistakes</span>
              <strong>{mistakes}</strong>
            </div>
            <div className="social-chip">
              <span>Progress</span>
              <strong>{progress}%</strong>
            </div>
          </div>
        </div>

        <div className="social-stage-box">
          <div className="stage-spotlight" />
          <div className="social-scene-topline">
            <span className="social-scene-badge">{currentScene.mood}</span>
            <span className="social-scene-badge">{currentScene.icon}</span>
          </div>
          <p className="stage-scene">{currentScene.scene}</p>
          <strong className="social-scene-prompt">{currentScene.prompt}</strong>
        </div>

        <div className="social-choice-grid">
          {currentScene.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="social-choice-card"
              onClick={() => handlePick(choice)}
              disabled={state.saving}
            >
              <span>{choice.label}</span>
              <p>{choice.detail}</p>
            </button>
          ))}
        </div>

        <div className="social-feedback-row">
          <div className="social-feedback-card">
            <span>Feedback</span>
            <strong>{feedback}</strong>
          </div>
          <button className="secondary-btn social-reset" type="button" onClick={handleReset} disabled={state.saving}>
            Restart
          </button>
        </div>

        <div className="game-detail-strip">
          <div>
            <span>Last logged</span>
            <strong>{state.recentLogs[0] ? formatDate(state.recentLogs[0].completedAt) : 'None yet'}</strong>
          </div>
          <div>
            <span>Focus</span>
            <strong>Helpful response practice</strong>
          </div>
        </div>
      </section>
    </GameFrame>
  );
}
