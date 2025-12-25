import { Equipement, InterventionWithEquipment } from '../types';

const frenchHeaders: { [key: string]: string } = {
  'ID OT': 'ID OT',
  'Équipement': 'Équipement',
  'Type': 'Type',
  'Description': 'Description',
  'Technicien': 'Technicien',
  'Priorité': 'Priorité',
  'Statut': 'Statut',
  'Cause': 'Cause',
  'Actions': 'Actions',
  'Date Création': 'Date Création',
  'Date Clôture': 'Date Clôture',
  'Nom': 'Nom',
  'Marque': 'Marque',
  'Modèle': 'Modèle',
  'Service': 'Service',
  'Criticité': 'Criticité',
  'Numéro Série': 'Numéro Série',
  'Date Acquisition': 'Date Acquisition',
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  const headers = Object.keys(data[0]);
  const frenchHeaderRow = headers.map(h => frenchHeaders[h] || h);

  const csvContent = [
    frenchHeaderRow.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const escaped = String(value || '').replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateEquipmentReport = (equipement: Equipement): string => {
  return `
Rapport d'Équipement
====================

Nom: ${equipement.nom}
Marque: ${equipement.marque || 'N/A'}
Modèle: ${equipement.modele || 'N/A'}
N° Série: ${equipement.num_serie || 'N/A'}
Service: ${equipement.service}
Criticité: ${equipement.criticite}
Statut: ${equipement.statut}
Date d'Acquisition: ${new Date(equipement.date_acquisition).toLocaleDateString('fr-FR')}
Date de Création: ${new Date(equipement.created_at).toLocaleDateString('fr-FR')}

Généré le: ${new Date().toLocaleString('fr-FR')}
  `.trim();
};

export const generateInterventionReport = (intervention: InterventionWithEquipment): string => {
  return `
Rapport d'Intervention
======================

ID OT: ${intervention.id}
Équipement: ${intervention.equipement?.nom || 'N/A'}
Type: ${intervention.type_maint}
Description: ${intervention.description}
Priorité: ${intervention.priorite}
Technicien: ${intervention.technicien}
Statut: ${intervention.statut_ot}
Cause de Panne: ${intervention.cause_panne || 'N/A'}
Actions Prises: ${intervention.actions_prises || 'N/A'}
Date de Création: ${new Date(intervention.date_creation).toLocaleString('fr-FR')}
Date de Clôture: ${intervention.date_cloture ? new Date(intervention.date_cloture).toLocaleString('fr-FR') : 'N/A'}

Généré le: ${new Date().toLocaleString('fr-FR')}
  `.trim();
};

export const downloadReport = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
