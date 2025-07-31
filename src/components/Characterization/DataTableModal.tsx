import React, { useState, useEffect } from 'react';
import './DataTableModal.css';
import { CharacterizationRecord } from '../../types/characterization.types';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CharacterizationRecord[];
  fileName: string;
}

const DataTableModal: React.FC<DataTableModalProps> = ({ isOpen, onClose, records, fileName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Reiniciar a la primera página cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calcular paginación
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Todas las columnas de la entidad Characterization
  const allColumns = [
    { key: 'cod_pre', label: 'Código Prestador' },
    { key: 'cod_sub', label: 'Código Subred' },
    { key: 'fec_inicar', label: 'Fecha Inicial' },
    { key: 'fec_car', label: 'Fecha Caracterización' },
    { key: 'raz_soc', label: 'Razón Social' },
    { key: 'nit_upgd', label: 'NIT UPGD' },
    { key: 'dir', label: 'Dirección' },
    { key: 'rep_leg', label: 'Representante Legal' },
    { key: 'cor_ele', label: 'Correo Electrónico' },
    { key: 'res_not', label: 'Resolución Notificación' },
    { key: 'tel', label: 'Teléfono' },
    { key: 'fec_con', label: 'Fecha Constitución' },
    { key: 'nat_jur', label: 'Naturaleza Jurídica' },
    { key: 'niv', label: 'Nivel' },
    { key: 'tipo_unidad', label: 'Tipo Unidad' },
    { key: 'estadoupgd', label: 'Estado UPGD' },
    { key: 'loc_o_zona', label: 'Localidad/Zona' },
    { key: 'notif_iad', label: 'Notificación IAD' },
    { key: 'notif_iso', label: 'Notificación ISO' },
    { key: 'notif_cab', label: 'Notificación CAB' },
    { key: 'uni_ana', label: 'Unidad Análisis' },
    { key: 'cov', label: 'COV' },
    { key: 'tal_hum', label: 'Talento Humano' },
    { key: 'tec_dis', label: 'Tecnología Disponible' },
    { key: 'com', label: 'Comunicaciones' },
    { key: 'fax_mod', label: 'Fax/Módem' },
    { key: 'tie_cor', label: 'Tiempo Correo' },
    { key: 'int', label: 'Internet' },
    { key: 'tel_fax', label: 'Teléfono/Fax' },
    { key: 'rad_tel', label: 'Radio/Teléfono' },
    { key: 'act_siv', label: 'Actividad SIVIGILA' },
    { key: 'hosp_unive', label: 'Hospital Universitario' },
    { key: 'reg_excepc', label: 'Régimen Excepción' },
    { key: 'tot_camas', label: 'Total Camas' },
    { key: 'comite_inf', label: 'Comité Infecciones' },
    { key: 'bi_profesi', label: 'Bioprofesional' },
    { key: 'iaas_ultim', label: 'IAAS Último' },
    { key: 'inf_tenden', label: 'Infección Tendencia' },
    { key: 'social_ten', label: 'Social Tendencia' },
    { key: 'lab_microb', label: 'Lab. Microbiología' },
    { key: 'lab_propio', label: 'Lab. Propio' },
    { key: 'labs_contr', label: 'Labs. Contrato' },
    { key: 'ident_gye', label: 'Identificación G&E' },
    { key: 'prue_sucep', label: 'Pruebas Susceptibilidad' },
    { key: 'lab_automa', label: 'Lab. Automatizado' },
    { key: 'vitek', label: 'VITEK' },
    { key: 'microscan', label: 'MicroScan' },
    { key: 'phoenix', label: 'Phoenix' },
    { key: 'lab_cci', label: 'Lab. CCI' },
    { key: 'lab_cce', label: 'Lab. CCE' },
    { key: 'micr_cdi', label: 'Micro CDI' },
    { key: 'whonet', label: 'WHONET' },
    { key: 'inform_pat', label: 'Informes Patología' },
    { key: 'lab_con_pe', label: 'Lab. Control Peso' },
    { key: 'lab_rem_ce', label: 'Lab. Remisión CE' },
    { key: 'lab_report', label: 'Lab. Reportes' },
    { key: 'quien_vcab', label: 'Quién VCAB' },
    { key: 'ser_cesare', label: 'Servicio Cesárea' },
    { key: 'ser_par_va', label: 'Servicio Parto Vaginal' },
    { key: 'ser_coleci', label: 'Servicio Colecistectomía' },
    { key: 'ser_hernio', label: 'Servicio Hernioplastia' },
    { key: 'ser_revasc', label: 'Servicio Revascularización' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="excel-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Datos Completos - {fileName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {records.length === 0 ? (
            <p>No hay registros disponibles para este archivo.</p>
          ) : (
            <>
              <div className="pagination-info">
                <span>
                  Mostrando {startIndex + 1} - {Math.min(endIndex, records.length)} de {records.length} registros
                </span>
              </div>
              
              <div className="excel-table-container">
                <table className="excel-table">
                  <thead>
                    <tr>
                      <th className="row-number">#</th>
                      {allColumns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record, index) => (
                      <tr key={record.id || startIndex + index}>
                        <td className="row-number">{index + 1}</td>
                        {allColumns.map((column) => (
                          <td key={column.key}>
                            {record[column.key as keyof CharacterizationRecord] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination-controls">
                <button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <span>◀</span> Anterior
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let page;
                    if (totalPages <= 10) {
                      page = i + 1;
                    } else {
                      // Lógica para mostrar páginas alrededor de la página actual
                      if (currentPage <= 5) {
                        page = i + 1;
                      } else if (currentPage > totalPages - 5) {
                        page = totalPages - 9 + i;
                      } else {
                        page = currentPage - 4 + i;
                      }
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`page-btn ${page === currentPage ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 10 && currentPage < totalPages - 5 && (
                    <>
                      <span className="page-ellipsis">...</span>
                      <button
                        onClick={() => goToPage(totalPages)}
                        className="page-btn"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Siguiente <span>▶</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableModal;
