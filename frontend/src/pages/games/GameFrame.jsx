export default function GameFrame({ meta, state, children, onBack, hideSuccessMessage = false }) {
  const routeLabel = meta.routeLabel;

  return (
    <main className={`game-page-shell ${meta.shellClass}`}>
      <div className={`game-page-backdrop ${meta.glowClass}`} aria-hidden="true" />
      <div className="game-page-sprinkles" aria-hidden="true">
        <span>✦</span>
        <span>◆</span>
        <span>●</span>
        <span>✦</span>
        <span>◆</span>
      </div>
      <header className="game-page-topbar card">
        <div className="game-title-group">
          <div className={`game-title-badge ${meta.bannerClass}`}>
            <span className="game-title-icon" aria-hidden="true">
              {meta.icon}
            </span>
            <div>
              <p className="eyebrow">{meta.eyebrow}</p>
              <strong>{meta.title}</strong>
            </div>
          </div>
        </div>
        <div className="game-topbar-actions">
          <div className="game-status-chip">
            <span>{routeLabel}</span>
            <strong>{state.saving ? 'Saving...' : state.successMessage ? 'Finished!' : 'Auto-log ready'}</strong>
          </div>
          <a className="secondary-btn game-back-link" href="/" onClick={onBack}>
            Back to dashboard
          </a>
        </div>
      </header>

      {state.error && state.activity && (
        <section className="card game-alert game-alert-error game-inline-alert">
          <strong>Could not load the game.</strong>
          <p>{state.error}</p>
        </section>
      )}

      {state.successMessage && !hideSuccessMessage && (
        <section className="card game-alert game-alert-success">
          <strong>{state.successMessage}</strong>
          <p>Return to the dashboard when you&apos;re ready for another round.</p>
        </section>
      )}

      <section className="game-stage">{children}</section>
    </main>
  );
}
