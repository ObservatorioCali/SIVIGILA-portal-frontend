export interface User {
  id: number;
  codigo: string;
  institucion?: string;
  role: 'ADMIN' | 'UPGD_UI';
}

export interface Observation {
  id: number;
  message: string;
  createdAt: string;
  user: User;
}

export interface CharacterizationRecord {
  id: number;
  fileName: string;
  cod_pre: string;
  cod_sub: string;
  fec_inicar: string;
  fec_car: string;
  raz_soc: string;
  nit_upgd: string;
  dir: string;
  rep_leg: string;
  cor_ele: string;
  res_not: string;
  tel: string;
  fec_con: string;
  nat_jur: string;
  niv: string;
  tipo_unidad: string;
  estadoupgd: string;
  loc_o_zona: string;
  notif_iad: string;
  notif_iso: string;
  notif_cab: string;
  uni_ana: string;
  cov: string;
  tal_hum: string;
  tec_dis: string;
  com: string;
  fax_mod: string;
  tie_cor: string;
  int: string;
  tel_fax: string;
  rad_tel: string;
  act_siv: string;
  hosp_unive: string;
  reg_excepc: string;
  tot_camas: string;
  comite_inf: string;
  bi_profesi: string;
  iaas_ultim: string;
  inf_tenden: string;
  social_ten: string;
  lab_microb: string;
  lab_propio: string;
  labs_contr: string;
  ident_gye: string;
  prue_sucep: string;
  lab_automa: string;
  vitek: string;
  microscan: string;
  phoenix: string;
  lab_cci: string;
  lab_cce: string;
  micr_cdi: string;
  whonet: string;
  inform_pat: string;
  lab_con_pe: string;
  lab_rem_ce: string;
  lab_report: string;
  quien_vcab: string;
  ser_cesare: string;
  ser_par_va: string;
  ser_coleci: string;
  ser_hernio: string;
  ser_revasc: string;
}

export interface CharacterizationFile {
  id: number;
  fileName: string;
  filePath: string;
  updatedFilePath?: string | null;
  epidemiologicalDate: string;
  status: 'PENDING' | 'OBSERVED' | 'UPDATED' | 'APPROVED';
  uploadedBy: User;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  observations: Observation[];
  records?: CharacterizationRecord[]; // Los datos del Excel
}
