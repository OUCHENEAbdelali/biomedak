import { useState } from 'react';
import { X } from 'lucide-react';

interface InterventionClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cause: string, actions: string) => void;
  isLoading: boolean;
}

export default function InterventionClosureModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: InterventionClosureModalProps) {
  const [cause, setCause] = useState('');
  const [actions, setActions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cause.trim() || !actions.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    onSubmit(cause, actions);
    setCause('');
    setActions('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Clôturer l'intervention</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cause de la panne
            </label>
            <textarea
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              placeholder="Décrivez la cause du problème"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions prises
            </label>
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              placeholder="Décrivez les actions effectuées"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sauvegarde...' : 'Clôturer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
