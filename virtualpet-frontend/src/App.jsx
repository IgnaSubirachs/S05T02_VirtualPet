import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AlienAuthPage from './components/AlienAuthPage';
import Dashboard from './components/Dashboard';

// Component que protegeix les rutes privades
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center font-pixel text-cyan-400 mt-20">Carregant...</div>;
  }

  return user?.token ? children : <Navigate to="/" />;
};

function AppContent() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user?.token ? <Navigate to="/dashboard" /> : <AlienAuthPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;