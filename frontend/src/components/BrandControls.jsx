import {
  BrandGlyph,
  MoonIcon,
  SunIcon
} from './icons';

export function BrandLockup({ subtitle, className = '', compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''} ${className}`.trim()}>
      <div className="brand-glyph" aria-hidden="true">
        <BrandGlyph />
      </div>
      <div className="brand-wordmark">
        <h1>
          <span>Tiny</span>
          <span>Steps</span>
        </h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function ThemeToggleButton({ theme, onClick, className = '', ...props }) {
  const isDark = theme === 'dark';

  return (
    <button
      className={`theme-toggle-btn ${className}`.trim()}
      type="button"
      onClick={onClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      {...props}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="theme-toggle-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className={`theme-toggle-thumb ${isDark ? 'theme-toggle-thumb-on' : ''}`} />
      </span>
    </button>
  );
}
