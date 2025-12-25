import { useState, useEffect } from 'react';
import { equipementsAPI, interventionsAPI } from '../lib/api';
import { InterventionWithEquipment } from '../types';
import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface EquipmentDetailProps {
  equipmentId: string;
  onClose: () => void;
}

export default function EquipmentDetail({ equipmentId, onClose }: EquipmentDetailProps) {
  const [equipment, setEquipment] = useState<any>(null);
  const [interventions, setInterventions] = useState<InterventionWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [equipmentId]);

  const loadData = async () => {
    try {
      const [eqData, intData] = await Promise.all([
        equipementsAPI.getOne(equipmentId),
        interventionsAPI.getAll(),
      ]);

      setEquipment(eqData);
      setInterventions(intData?.filter((int: any) => int.equipement_id === equipmentId) || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{equipment.nom}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Service</p>
              <p className="font-semibold text-gray-900">{equipment.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Marque</p>
              <p className="font-semibold text-gray-900">{equipment.marque || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Modèle</p>
              <p className="font-semibold text-gray-900">{equipment.modele || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">N° Série</p>
              <p className="font-semibold text-gray-900">{equipment.num_serie || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Criticité</p>
              <p className="font-semibold text-gray-900">{equipment.criticite}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Statut</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  equipment.statut === 'En panne'
                    ? 'bg-red-100 text-red-800'
                    : equipment.statut === 'En maintenance'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {equipment.statut}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Historique des Interventions
            </h3>

            {interventions.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Aucune intervention enregistrée</p>
            ) : (
              <div className="space-y-3">
                {interventions.map((intervention) => (
                  <div key={intervention.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {intervention.statut_ot === 'Clôturé' ? (
                          <CheckCircle size={18} className="text-green-600" />
                        ) : (
                          <AlertCircle size={18} className="text-orange-600" />
                        )}
                        <span className="font-semibold text-gray-900">{intervention.type_maint}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          intervention.statut_ot === 'Clôturé'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {intervention.statut_ot}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{intervention.description}</p>
                    <p className="text-xs text-gray-500">
                      Technicien: <span className="font-medium">{intervention.technicien}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
