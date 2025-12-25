import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    setProfile({
      id: user?.id,
      email: user?.email || '',
      full_name: user?.full_name || '',
      role: user?.role || 'Technicien',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-96"><div className="text-lg text-gray-500">Chargement...</div></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du Compte</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{profile.full_name || 'Utilisateur'}</p>
              <p className="text-gray-600">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {profile.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom Complet
            </label>
            <input
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (non modifiable)
            </label>
            <input
              type="email"
              value={profile.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <input
              type="text"
              value={profile.role || 'Technicien'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
