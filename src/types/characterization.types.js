/**
 * @typedef {Object} CharUser
 * @property {number} id
 * @property {string} codigo
 * @property {string} [institucion]
 * @property {'ADMIN'|'UPGD_UI'} role
 */

/**
 * @typedef {Object} Observation
 * @property {number} id
 * @property {string} message
 * @property {string} createdAt
 * @property {CharUser} user
 */

/**
 * @typedef {Object} CharacterizationRecord
 * @property {number} id
 * @property {string} fileName
 * @property {string} cod_pre
 * @property {string} cod_sub
 * @property {string} fec_inicar
 * @property {string} fec_car
 * @property {string} raz_soc
 * @property {string} nit_upgd
 * @property {string} dir
 * @property {string} rep_leg
 * @property {string} cor_ele
 * @property {string} res_not
 * @property {string} tel
 * @property {string} fec_con
 * @property {string} nat_jur
 * @property {string} niv
 * @property {string} tipo_unidad
 * @property {string} estadoupgd
 * @property {string} loc_o_zona
 * @property {string} notif_iad
 * @property {string} notif_iso
 * @property {string} notif_cab
 * @property {string} uni_ana
 * @property {string} cov
 * @property {string} tal_hum
 * @property {string} tec_dis
 * @property {string} com
 * @property {string} fax_mod
 * @property {string} tie_cor
 * @property {string} int
 * @property {string} tel_fax
 * @property {string} rad_tel
 * @property {string} act_siv
 * @property {string} hosp_unive
 * @property {string} reg_excepc
 * @property {string} tot_camas
 * @property {string} comite_inf
 * @property {string} bi_profesi
 * @property {string} iaas_ultim
 * @property {string} inf_tenden
 * @property {string} social_ten
 * @property {string} lab_microb
 * @property {string} lab_propio
 * @property {string} labs_contr
 * @property {string} ident_gye
 * @property {string} prue_sucep
 * @property {string} lab_automa
 * @property {string} vitek
 * @property {string} microscan
 * @property {string} phoenix
 * @property {string} lab_cci
 * @property {string} lab_cce
 * @property {string} micr_cdi
 * @property {string} whonet
 * @property {string} inform_pat
 * @property {string} lab_con_pe
 * @property {string} lab_rem_ce
 * @property {string} lab_report
 * @property {string} quien_vcab
 * @property {string} ser_cesare
 * @property {string} ser_par_va
 * @property {string} ser_coleci
 * @property {string} ser_hernio
 * @property {string} ser_revasc
 */

/**
 * @typedef {Object} CharacterizationFile
 * @property {number} id
 * @property {string} fileName
 * @property {string} filePath
 * @property {string|null} [updatedFilePath]
 * @property {string} epidemiologicalDate
 * @property {'PENDING'|'OBSERVED'|'UPDATED'|'APPROVED'} status
 * @property {CharUser} uploadedBy
 * @property {string|null} [verifiedAt]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Observation[]} observations
 * @property {CharacterizationRecord[]} [records]
 */
