import React, { useState } from 'react';
import { CharacterizationFile } from '../../types/characterization.types';
import ConfirmModal from '../common/ConfirmModal';
import '../../styles/characterization.css';

interface FileTableProps {
  files: CharacterizationFile[];
  onView?: (file: CharacterizationFile) => void;
  onViewAllColumns?: (file: CharacterizationFile) => void;
  onViewObservations?: (file: CharacterizationFile) => void;
  onDelete?: (file: CharacterizationFile) => Promise<boolean>;
}

const FileTable: React.FC<FileTableProps> = ({ 
  files, 
  onViewAllColumns, 
  onViewObservations,
  onDelete
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<CharacterizationFile | null>(null);

  const handleDeleteClick = (file: CharacterizationFile) => {
    setFileToDelete(file);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete && onDelete) {
      setShowConfirmModal(false);
      await onDelete(fileToDelete);
      setFileToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setFileToDelete(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Si la fecha incluye 'T', es un formato ISO, usarla directamente
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    
    // Si es solo una fecha (YYYY-MM-DD), parseamos directamente los componentes
    // para evitar problemas de zona horaria
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Los meses en Date son 0-indexados
      const day = parseInt(dateParts[2]);
      
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    
    return 'Formato de fecha inválido';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Subido - Pendiente de revisión';
      case 'OBSERVED':
        return 'Revisado con Observaciones';
      case 'APPROVED':
        return 'Verificado y actualizado en web OK';
      case 'UPDATED':
        return 'Verificado y actualizado en web OK';
      default:
        return status;
    }
  };

  return (
    <div className="char-table-container">
      <table className="char-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del Archivo</th>
            <th>Fecha Epidemiológica</th>
            <th>Fecha de Subida</th>
            <th>Estado</th>
            <th>Fecha Realización Actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id}>
              <td>{index + 1}</td>
              <td>
                <div className="file-info">
                  <span className="file-name">{file.fileName}</span>
                </div>
              </td>
              <td>{formatDate(file.epidemiologicalDate)}</td>
              <td>{formatDate(file.createdAt)}</td>
              <td>
                <span className={`status-badge status-${file.status.toLowerCase()}`}>
                  {getStatusText(file.status)}
                </span>
              </td>
              <td>
                {file.verifiedAt ? (
                  <span className="verified-date">
                    {formatDate(file.verifiedAt)}
                  </span>
                ) : (
                  <span className="no-date">-</span>
                )}
              </td>
              <td>
                <div className="action-buttons-modern">
                  {onViewAllColumns && (
                    <button
                      className="btn-modern btn-details-modern"
                      onClick={() => onViewAllColumns(file)}
                      title="Ver todas las columnas"
                    >
                      <span className="btn-text">Detalles</span>
                    </button>
                  )}
                  {onViewObservations && (
                    <button
                      className="btn-modern btn-observations-modern"
                      onClick={() => onViewObservations(file)}
                      title="Ver observaciones"
                    >
                      <span className="btn-text">Observaciones</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-modern btn-delete-modern"
                      onClick={() => handleDeleteClick(file)}
                      title="Eliminar archivo"
                    >
                      <span className="btn-text">Eliminar</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar el archivo "${fileToDelete?.fileName}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default FileTable;
