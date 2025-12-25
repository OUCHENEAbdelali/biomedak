import { useEffect, useState } from 'react';
import { equipementsAPI, interventionsAPI } from '../lib/api';
import { Equipement, InterventionWithEquipment } from '../types';
import { Plus, CheckCircle, AlertCircle, Download, Search } from 'lucide-react';
import { exportToCSV } from '../lib/export';

export default function EnhancedInterventions() {
  const [interventions, setInterventions] = useState<InterventionWithEquipment[]>([]);
  const [filteredInterventions, setFilteredInterventions] = useState<InterventionWithEquipment[]>([]);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipement_id: '',
    type_maint: 'Corrective',
    description: '',
    priorite: 'Normale',
    technicien: '',
  });
  const [closureData, setClosureData] = useState<{ [key: string]: { cause: string; actions: string } }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterInterventions();
  }, [interventions, searchTerm, filterStatus]);

  const loadData = async () => {
    try {
      const [interventionsData, equipementsData] = await Promise.all([
        interventionsAPI.getAll(),
        equipementsAPI.getAll(),
      ]);

      setInterventions(interventionsData || []);
      setEquipements(equipementsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInterventions = () => {
    let filtered = interventions;

    if (searchTerm) {
      filtered = filtered.filter(
        (int) =>
          int.equipement?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          int.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          int.technicien.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((int) => int.statut_ot === filterStatus);
    }

    setFilteredInterventions(filtered);
  };

  const handleCreateOT = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await interventionsAPI.create({
        equipement_id: formData.equipement_id,
        type_maint: formData.type_maint,
        description: formData.description,
        priorite: formData.priorite,
        technicien: formData.technicien,
        statut_ot: 'Ouvert',
      });

      setFormData({
        equipement_id: '',
        type_maint: 'Corrective',
        description: '',
        priorite: 'Normale',
        technicien: '',
      });

      loadData();
    } catch (error) {
      console.error('Error creating OT:', error);
      alert('Erreur lors de la création de l\'OT');
    }
  };

  const handleCloseOT = async (otId: string) => {
    const data = closureData[otId];
    if (!data?.cause || !data?.actions) {
      alert('Veuillez remplir la cause et les actions');
      return;
    }

    try {
      await interventionsAPI.update(otId, {
        cause_panne: data.cause,
        actions_prises: data.actions,
        statut_ot: 'Clôturé',
      });

      setClosureData({ ...closureData, [otId]: { cause: '', actions: '' } });
      loadData();
    } catch (error) {
      console.error('Error closing OT:', error);
      alert('Erreur lors de la clôture de l\'OT');
    }
  };

  const handleExport = () => {
    const exportData = filteredInterventions.map((int) => ({
      'ID OT': int.id.slice(0, 8),
      'Équipement': int.equipement?.nom,
      'Type': int.type_maint,
      'Description': int.description,
      'Technicien': int.technicien,
      'Priorité': int.priorite,
      'Statut': int.statut_ot,
      'Cause': int.cause_panne || '',
      'Actions': int.actions_prises || '',
    }));

    exportToCSV(exportData, 'interventions');
  };

  const updateClosureData = (otId: string, field: 'cause' | 'actions', value: string) => {
    setClosureData({
      ...closureData,
      [otId]: {
        ...closureData[otId],
        [field]: value,
      },
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-500">Chargement...</div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Interventions</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} />
          Nouvel Ordre de Travail (OT)
        </h3>

        <form onSubmit={handleCreateOT} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.equipement_id}
              onChange={(e) => setFormData({ ...formData, equipement_id: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Choisir l'équipement --</option>
              {equipements.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nom} {eq.num_serie && `(${eq.num_serie})`}
                </option>
              ))}
            </select>
            <select
              value={formData.type_maint}
              onChange={(e) => setFormData({ ...formData, type_maint: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Corrective">Corrective (Panne)</option>
              <option value="Préventive">Préventive</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Description du problème"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              required
            />
            <select
              value={formData.priorite}
              onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Normale">Normale</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Technicien"
              value={formData.technicien}
              onChange={(e) => setFormData({ ...formData, technicien: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Créer l'OT
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par équipement, description..."
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
            <option value="Ouvert">Ouvert</option>
            <option value="Clôturé">Clôturé</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle size={24} className="text-blue-600" />
          Interventions
        </h3>

        {filteredInterventions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune intervention trouvée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID OT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Équipement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Technicien</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInterventions.map((ot) => (
                  <tr key={ot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 font-medium text-sm">#{ot.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-gray-800">{ot.equipement?.nom}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{ot.description}</td>
                    <td className="py-3 px-4 text-gray-600">{ot.technicien}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          ot.statut_ot === 'Ouvert'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ot.statut_ot === 'Clôturé' && <CheckCircle size={14} />}
                        {ot.statut_ot}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {ot.statut_ot === 'Ouvert' ? (
                        <div className="flex gap-2 items-center flex-wrap">
                          <input
                            type="text"
                            placeholder="Cause"
                            value={closureData[ot.id]?.cause || ''}
                            onChange={(e) => updateClosureData(ot.id, 'cause', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
                          />
                          <input
                            type="text"
                            placeholder="Actions"
                            value={closureData[ot.id]?.actions || ''}
                            onChange={(e) => updateClosureData(ot.id, 'actions', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
                          />
                          <button
                            onClick={() => handleCloseOT(ot.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                          >
                            Clôturer
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Clôturé</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
