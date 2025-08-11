import { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal.jsx';
import '../../styles/characterization.css';

export default function FileTable({ files, onViewAllColumns, onViewObservations, onDelete }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (file) => { if (isDeleting) return; setFileToDelete(file); setShowConfirmModal(true); };
  const handleConfirmDelete = async () => { if (fileToDelete && onDelete && !isDeleting) { setIsDeleting(true); setShowConfirmModal(false); try { await onDelete(fileToDelete); } finally { setIsDeleting(false); setFileToDelete(null); } } };
  const handleCancelDelete = () => { if (isDeleting) return; setShowConfirmModal(false); setFileToDelete(null); };

  const formatDate = (dateString) => { if (!dateString) return 'N/A'; if (dateString.includes('T')) { const date = new Date(dateString); if (isNaN(date.getTime())) return 'Fecha inválida'; return date.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }); } const dateParts = dateString.split('-'); if (dateParts.length === 3) { const [y,m,d] = dateParts; const date = new Date(parseInt(y), parseInt(m)-1, parseInt(d)); if (isNaN(date.getTime())) return 'Fecha inválida'; return date.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }); } return 'Formato de fecha inválido'; };
  const getStatusText = (status) => { switch (status) { case 'PENDING': return 'Subido - Pendiente de revisión'; case 'OBSERVED': return 'Revisado con Observaciones'; case 'APPROVED': return 'Verificado y actualizado en web OK'; case 'UPDATED': return 'Verificado y actualizado en web OK'; default: return status; } };

  return (
    <div className="char-table-container">
      <table className="char-table">
        <thead><tr><th>#</th><th>Nombre del Archivo</th><th>Fecha Epidemiológica</th><th>Fecha de Subida</th><th>Estado</th><th>Fecha Realización Actualización</th><th>Acciones</th></tr></thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id}>
              <td>{index + 1}</td>
              <td><div className="file-info"><span className="file-name">{file.fileName}</span></div></td>
              <td>{formatDate(file.epidemiologicalDate)}</td>
              <td>{formatDate(file.createdAt)}</td>
              <td><span className={`status-badge status-${file.status.toLowerCase()}`}>{getStatusText(file.status)}</span></td>
              <td>{file.verifiedAt ? <span className="verified-date">{formatDate(file.verifiedAt)}</span> : <span className="no-date">-</span>}</td>
              <td>
                <div className="action-buttons-modern">
                  {onViewAllColumns && (<button className="btn-modern btn-details-modern" onClick={() => onViewAllColumns(file)} title="Ver todas las columnas"><span className="btn-text">Detalles</span></button>)}
                  {onViewObservations && (<button className="btn-modern btn-observations-modern" onClick={() => onViewObservations(file)} title="Ver observaciones"><span className="btn-text">Observaciones</span></button>)}
                  {onDelete && (<button className={`btn-modern btn-delete-modern ${isDeleting ? 'disabled' : ''}`} onClick={() => handleDeleteClick(file)} disabled={isDeleting} title={isDeleting ? 'Eliminando...' : 'Eliminar archivo'}><span className="btn-text">{isDeleting ? 'Eliminando...' : 'Eliminar'}</span></button>)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmModal && (<ConfirmModal isOpen={showConfirmModal} title="Confirmar eliminación" message={`¿Estás seguro de que deseas eliminar el archivo "${fileToDelete?.fileName}"?`} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />)}
    </div>
  );
}
