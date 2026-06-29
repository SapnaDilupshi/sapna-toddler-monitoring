import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { BrandLockup, ThemeToggleButton } from '../components/BrandControls';
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  UserIcon
} from '../components/icons';

function FieldShell({ icon, children, button }) {
  return (
    <div className="input-shell">
      <span className="input-icon" aria-hidden="true">
        {icon}
      </span>
      {children}
      {button}
    </div>
  );
}

const authContent = {
  login: {
    title: 'Welcome Back!',
    description: 'Login to access your dashboard.'
  },
  signup: {
    title: 'Create your account',
    description: "Join and start your toddler's development journey."
  }
};

export default function AuthPage() {
  const { login, signup, resetPassword, configError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('tinysteps-auth-email');
      if (stored) {
        setForm((current) => ({ ...current, email: stored }));
      }
    } catch {
      // Storage can be blocked in private browsing sessions.
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (configError) {
      setError(configError);
      return;
    }

    if (mode === 'signup' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setPending(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password);
      }

      if (rememberMe && form.email) {
        window.localStorage.setItem('tinysteps-auth-email', form.email.trim());
      } else {
        window.localStorage.removeItem('tinysteps-auth-email');
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setPending(false);
    }
  }

  async function handleForgotPassword() {
    setError('');

    if (configError) {
      setError(configError);
      return;
    }

    if (!form.email) {
      setError('Enter your email first.');
      return;
    }

    setPending(true);
    try {
      await resetPassword(form.email);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setPending(false);
    }
  }

  const authCopy = authContent[mode];

  return (
    <main className="app-shell auth-shell">
      <section className="auth-topbar">
        <BrandLockup subtitle="Parent-Centric Monitoring" className="auth-brand-lockup" />
        <ThemeToggleButton theme={theme} onClick={toggleTheme} className="auth-theme-toggle" />
      </section>

      <section className="hero-card">
        <h1>Toddler Development Dashboard</h1>
        <p>
          Track offline milestone activities, log developmental observations, and receive
          personalized weekly progress insights without increasing toddler screen exposure.
        </p>
          <div className="hero-disclaimer">
            <div className="hero-disclaimer-icon" aria-hidden="true">
              <ShieldIcon />
            </div>
            <div>
            <h3>Medical Disclaimer:</h3>
            <p>
              SAPNA is a screening and monitoring aid, not a medical diagnosis. Always consult a
              qualified healthcare professional for formal assessment.
            </p>
          </div>
        </div>
      </section>

      <section className="card auth-card">
        <div className="auth-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            type="button"
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>

        <div className="auth-card-header">
          <div className="auth-hero-icon" aria-hidden="true">
            {mode === 'login' ? <LockIcon /> : <UserIcon />}
          </div>
          <div className="auth-copy">
            <h2>{authCopy.title}</h2>
            <p>{authCopy.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field-label">
            Email
            <FieldShell icon={<MailIcon />}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                autoComplete="email"
              />
            </FieldShell>
          </label>

          <label className="field-label">
            Password
            <FieldShell
              icon={<LockIcon />}
              button={
                <button
                  className="icon-toggle-btn"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                minLength={6}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </FieldShell>
          </label>

          {mode === 'signup' && (
            <label className="field-label">
              Confirm Password
              <FieldShell icon={<LockIcon />}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
              </FieldShell>
            </label>
          )}

          {mode === 'login' && (
            <div className="auth-assist-row">
              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>
              <button className="text-link-btn" type="button" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>
          )}

          {error && <p className="error-text auth-error">{error}</p>}
          {configError && (
            <p className="warning-text auth-warning">Firebase setup is incomplete. Add frontend env keys.</p>
          )}

          <button className="primary-btn auth-submit" type="submit" disabled={pending}>
            {pending ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>

          <p className="auth-footer">
            By creating an account, you agree to our{' '}
            <a href="#terms" onClick={(event) => event.preventDefault()}>
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="#privacy" onClick={(event) => event.preventDefault()}>
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </section>
    </main>
  );
}
