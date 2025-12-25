export interface Equipement {
  id: string;
  nom: string;
  marque: string | null;
  modele: string | null;
  num_serie: string | null;
  qr_code?: string | null;
  service: string;
  date_acquisition: string;
  criticite: string;
  statut: string;
  created_at: string;
}

export interface Intervention {
  id: string;
  equipement_id: string;
  type_maint: string;
  description: string;
  priorite: string;
  technicien: string;
  statut_ot: string;
  cause_panne: string | null;
  actions_prises: string | null;
  date_creation: string;
  date_cloture: string | null;
  created_at: string;
}

export interface InterventionWithEquipment extends Intervention {
  equipement?: {
    nom: string;
  };
}
