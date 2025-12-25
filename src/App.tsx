import { useState } from 'react';
import { useAuth } from './lib/auth-context';
import Auth from './components/Auth';
import EnhancedLayout from './components/EnhancedLayout';
import EnhancedDashboard from './components/EnhancedDashboard';
import EnhancedEquipment from './components/EnhancedEquipment';
import EnhancedInterventions from './components/EnhancedInterventions';
import Settings from './components/Settings';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-white rounded-full"></div>
          </div>
          <p className="text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'equipements':
        return <EnhancedEquipment />;
      case 'interventions':
        return <EnhancedInterventions />;
      case 'settings':
        return <Settings />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <EnhancedLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </EnhancedLayout>
  );
}

export default App;
