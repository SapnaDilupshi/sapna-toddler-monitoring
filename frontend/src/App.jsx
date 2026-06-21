import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CognitiveGamePage from './pages/games/CognitiveGamePage';
import MotorGamePage from './pages/games/MotorGamePage';
import LanguageGamePage from './pages/games/LanguageGamePage';
import SocialEmotionalGamePage from './pages/games/SocialEmotionalGamePage';

export default function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="app-shell loading-state">
        <div className="card">
          <h1>Loading SAPNA Dashboard</h1>
          <p>Preparing secure parent workspace...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/brain-games" element={<DashboardPage initialTab="activities" />} />
      <Route path="/games/cognitive" element={<CognitiveGamePage />} />
      <Route path="/games/motor" element={<MotorGamePage />} />
      <Route path="/games/language" element={<LanguageGamePage />} />
      <Route path="/games/social_emotional" element={<SocialEmotionalGamePage />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}
