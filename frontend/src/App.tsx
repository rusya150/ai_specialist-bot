import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { KnowledgeBase, Services } from './pages/Placeholders'; // Leave generic Profile mock if needed, but we are replacing route.
import { ProfileView } from './pages/ProfileView';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import { ChatPage } from './pages/ChatPage';

function AppContent() {
  return (
    <Layout>
      {/* Я ПРИБРАВ ЗАМОК */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;