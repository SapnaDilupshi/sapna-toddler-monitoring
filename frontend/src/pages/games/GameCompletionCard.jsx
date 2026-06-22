export default function GameCompletionCard({ meta, lastLoggedAt, onPlayAgain, onBackToActivities, saving }) {
  return (
    <section className={`card game-finish-card ${meta.accentClass} ${meta.bannerClass}`} aria-live="polite">
      <div className="game-finish-icon" aria-hidden="true">
        {meta.icon}
      </div>
      <p className="eyebrow">Finished</p>
      <h2>You did it!</h2>
      <p>Great job. This game is done and your result was saved automatically.</p>
      <div className="game-finish-state">
        <span>{saving ? 'Saving your result...' : 'Ready for another round'}</span>
        <strong>{lastLoggedAt ? `Last logged ${lastLoggedAt}` : 'No previous log yet'}</strong>
      </div>
      <div className="game-finish-actions">
        <button className="primary-btn" type="button" onClick={onPlayAgain} disabled={saving}>
          Play again
        </button>
        <a className="secondary-btn" href="/brain-games" onClick={onBackToActivities}>
          Back to Activities
        </a>
      </div>
    </section>
  );
}
