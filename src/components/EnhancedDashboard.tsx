import { useEffect, useState } from 'react';
import { equipementsAPI, interventionsAPI, statsAPI } from '../lib/api';
import { Equipement } from '../types';
import { AlertCircle, Package, Wrench, TrendingUp, Zap, Clock } from 'lucide-react';

export default function EnhancedDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    enPanne: 0,
    otsOuverts: 0,
    enMaintenance: 0,
    tauxDisponibilite: 0,
  });
  const [recentEquipment, setRecentEquipment] = useState<Equipement[]>([]);
  const [recentInterventions, setRecentInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, equipData, intData] = await Promise.all([
        statsAPI.get(),
        equipementsAPI.getAll(),
        interventionsAPI.getAll(),
      ]);

      const total = statsData.total || 0;
      const panne = statsData.enPanne || 0;
      const maint = statsData.enMaintenance || 0;
      const disponible = total - panne - maint;

      setStats({
        total,
        enPanne: panne,
        otsOuverts: statsData.otsOuverts || 0,
        enMaintenance: maint,
        tauxDisponibilite: total > 0 ? Math.round((disponible / total) * 100) : 0,
      });

      setRecentEquipment(equipData?.slice(0, 5) || []);
      setRecentInterventions(intData?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="text-lg text-gray-500">Chargement...</div></div>;
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={14} /> {trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('border', 'bg').replace('l', '')}`}>
          <Icon size={28} className="text-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={Package}
          label="Total Équipements"
          value={stats.total}
          color="border-blue-500"
          trend="+2 ce mois"
        />
        <StatCard
          icon={Zap}
          label="Taux Disponibilité"
          value={`${stats.tauxDisponibilite}%`}
          color="border-green-500"
        />
        <StatCard
          icon={AlertCircle}
          label="Appareils en Panne"
          value={stats.enPanne}
          color="border-red-500"
        />
        <StatCard
          icon={Clock}
          label="En Maintenance"
          value={stats.enMaintenance}
          color="border-orange-500"
        />
        <StatCard
          icon={Wrench}
          label="OT en Cours"
          value={stats.otsOuverts}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={24} />
            Équipements Critiques
          </h3>
          <div className="space-y-3">
            {recentEquipment
              .filter((eq) => eq.statut === 'En panne')
              .slice(0, 5)
              .map((eq) => (
                <div key={eq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{eq.nom}</p>
                    <p className="text-sm text-gray-600">{eq.service}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    En panne
                  </span>
                </div>
              ))}
            {recentEquipment.filter((eq) => eq.statut === 'En panne').length === 0 && (
              <p className="text-gray-500 text-center py-6">Aucun équipement en panne</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wrench className="text-blue-500" size={24} />
            Interventions Récentes
          </h3>
          <div className="space-y-3">
            {recentInterventions.slice(0, 5).map((intervention) => (
              <div key={intervention.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{intervention.equipement?.nom}</p>
                  <p className="text-sm text-gray-600">{intervention.description}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    intervention.statut_ot === 'Ouvert'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {intervention.statut_ot}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Dernier Équipement Ajouté</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentEquipment.slice(0, 3).map((eq) => (
            <div key={eq.id} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">{eq.nom}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Service:</span> {eq.service}</p>
                <p><span className="font-medium">Criticité:</span> {eq.criticite}</p>
                <p><span className="font-medium">Statut:</span> {eq.statut}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
