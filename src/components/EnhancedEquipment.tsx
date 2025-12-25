import { useEffect, useState } from 'react';
import { equipementsAPI } from '../lib/api';
import { Equipement } from '../types';
import { Edit2, Trash2, Plus, X, Search, Eye, QrCode } from 'lucide-react';
import EquipmentDetail from './EquipmentDetail';
import QRScanner from './QRScanner';
import QRDisplay from './QRDisplay';

export default function EnhancedEquipment() {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [showQRDisplay, setShowQRDisplay] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<Partial<Equipement>>({
    nom: '',
    marque: '',
    modele: '',
    num_serie: '',
    qr_code: '',
    service: 'Réanimation',
    statut: 'En service',
  });

  useEffect(() => {
    loadEquipements();
  }, []);

  useEffect(() => {
    filterEquipements();
  }, [equipements, searchTerm, filterStatus, filterService]);

  const loadEquipements = async () => {
    try {
      const data = await equipementsAPI.getAll();
      setEquipements(data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipements = () => {
    let filtered = equipements;

    if (searchTerm) {
      filtered = filtered.filter(
        (eq) =>
          eq.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.num_serie?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((eq) => eq.statut === filterStatus);
    }

    if (filterService !== 'all') {
      filtered = filtered.filter((eq) => eq.service === filterService);
    }

    setFilteredEquipements(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.id) {
        await equipementsAPI.update(formData.id, {
          nom: formData.nom,
          marque: formData.marque,
          modele: formData.modele,
          num_serie: formData.num_serie,
          qr_code: formData.qr_code,
          service: formData.service,
          statut: formData.statut,
        });
      } else {
        await equipementsAPI.create({
          nom: formData.nom,
          marque: formData.marque,
          modele: formData.modele,
          num_serie: formData.num_serie,
          qr_code: formData.qr_code,
          service: formData.service,
          statut: formData.statut,
          criticite: 'Moyenne',
        });
      }

      resetForm();
      loadEquipements();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (eq: Equipement) => {
    setFormData(eq);
    setEditMode(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ? Cela supprimera toutes les interventions liées.')) {
      return;
    }

    try {
      await equipementsAPI.delete(id);
      loadEquipements();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      marque: '',
      modele: '',
      num_serie: '',
      qr_code: '',
      service: 'Réanimation',
      statut: 'En service',
    });
    setEditMode(false);
  };

  const handleQRScan = (data: string) => {
    setFormData({
      ...formData,
      qr_code: data,
    });
    setShowScanner(false);
  };

  const getServices = () => {
    const services = new Set(equipements.map((eq) => eq.service));
    return Array.from(services);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-500">Chargement...</div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion du Parc</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {editMode ? <Edit2 size={20} /> : <Plus size={20} />}
          {editMode ? 'Modifier Équipement' : 'Nouvel Équipement'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Marque"
              value={formData.marque || ''}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Modèle"
              value={formData.modele || ''}
              onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="N° Série"
              value={formData.num_serie || ''}
              onChange={(e) => setFormData({ ...formData, num_serie: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Code QR"
              value={formData.qr_code || ''}
              onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Réanimation">Réanimation</option>
              <option value="Bloc">Bloc Opératoire</option>
              <option value="Urgences">Urgences</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <QrCode size={18} />
            Scanner QR
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="En service">En service</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {editMode ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="En service">En service</option>
            <option value="En panne">En panne</option>
            <option value="En maintenance">En maintenance</option>
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les services</option>
            {getServices().map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Nom</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Marque</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Service</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEquipements.map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">{eq.nom}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {eq.marque} {eq.modele && `- ${eq.modele}`}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{eq.service}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        eq.statut === 'En panne'
                          ? 'bg-red-100 text-red-800'
                          : eq.statut === 'En maintenance'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {eq.statut}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDetail(eq.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setShowQRDisplay({ id: eq.id, name: eq.nom })}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="QR Code"
                      >
                        <QrCode size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(eq)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Éditer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(eq.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEquipements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Aucun équipement trouvé</p>
          </div>
        )}
      </div>

      {selectedDetail && (
        <EquipmentDetail
          equipmentId={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showQRDisplay && (
        <QRDisplay
          equipmentId={showQRDisplay.id}
          equipmentName={showQRDisplay.name}
          onClose={() => setShowQRDisplay(null)}
        />
      )}
    </div>
  );
}
