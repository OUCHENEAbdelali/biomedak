import { LayoutDashboard, Package, Wrench, Settings, LogOut, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth-context';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function EnhancedLayout({ children, currentPage, onNavigate }: LayoutProps) {
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'equipements', label: 'Équipements', icon: Package },
    { id: 'interventions', label: 'Interventions', icon: Wrench },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 fixed h-screen left-0 top-0 z-40 overflow-y-auto`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md transform -rotate-12">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span>BioMedak</span>
            </h1>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md transform -rotate-12">
              <span className="text-sm font-bold text-white">B</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={sidebarOpen ? '' : item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
            title={sidebarOpen ? '' : 'Déconnexion'}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find((m) => m.id === currentPage)?.label || 'Accueil'}
            </h2>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
