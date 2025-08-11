import { useState } from 'react';
import './ObservationsModal.css';
import { CharacterizationService } from '../../services/characterization.service.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function ObservationsModal({ isOpen, onClose, observations = [], fileName, fileId, onObservationAdded }) {
  const { user } = useAuth();
  const [newObservation, setNewObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleSubmitObservation = async (e) => {
    e.preventDefault();
    if (!newObservation.trim()) { setSubmitError('La observación no puede estar vacía'); return; }
    if (!user?.id) { setSubmitError('Error: Usuario no autenticado'); return; }
    setIsSubmitting(true); setSubmitError('');
    try {
      await CharacterizationService.addObservation(fileId, newObservation, user.id);
      setNewObservation('');
      onObservationAdded && onObservationAdded();
      onClose();
    } catch (err) {
      console.error('Error al agregar observación:', err);
      setSubmitError('Error al agregar la observación. Inténtalo de nuevo.');
    } finally { setIsSubmitting(false); }
  };

  const handleMarkResolved = async () => {
    setIsSubmitting(true); setSubmitError('');
    try {
      await CharacterizationService.markObservationsResolved(fileId);
      onObservationAdded && onObservationAdded();
      onClose();
    } catch (err) {
      console.error('Error al marcar observaciones como resueltas:', err);
      setSubmitError('Error al marcar las observaciones como resueltas. Inténtalo de nuevo.');
    } finally { setIsSubmitting(false); }
  };

  const handleClearObservations = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar todas las observaciones? Esta acción no se puede deshacer.')) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await CharacterizationService.clearObservations(fileId);
      onObservationAdded && onObservationAdded();
      onClose();
    } catch (err) {
      console.error('Error al eliminar observaciones:', err);
      setSubmitError('Error al eliminar las observaciones. Inténtalo de nuevo.');
    } finally { setIsSubmitting(false); }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isUploader = user?.role === 'UPGD_UI';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="observations-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Observaciones - {fileName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="observations-body">
          {isUploader && (
            <div className="add-observation-section">
              <h3>Agregar nueva observación</h3>
              <form onSubmit={handleSubmitObservation}>
                <div className="form-group">
                  <textarea value={newObservation} onChange={(e) => setNewObservation(e.target.value)} placeholder="Escribe tu observación aquí..." rows={3} className="observation-textarea" disabled={isSubmitting} />
                </div>
                {submitError && <div className="error-message">{submitError}</div>}
                <div className="form-actions">
                  <button type="submit" className="btn-submit-observation" disabled={isSubmitting || !newObservation.trim()}>{isSubmitting ? 'Enviando...' : 'Agregar Observación'}</button>
                </div>
              </form>
            </div>
          )}
          {isAdmin && observations.length > 0 && (
            <div className="admin-actions-section">
              <h3>Acciones de Administrador</h3>
              <p className="admin-info">Revisar las observaciones reportadas y marcar como resueltas una vez atendidas.</p>
              {submitError && <div className="error-message">{submitError}</div>}
              <div className="admin-actions">
                <button onClick={handleMarkResolved} className="btn-resolve-observations" disabled={isSubmitting}>{isSubmitting ? 'Procesando...' : '✓ Marcar Observaciones como Resueltas'}</button>
                <button onClick={handleClearObservations} className="btn-clear-observations" disabled={isSubmitting}>{isSubmitting ? 'Procesando...' : '🗑️ Eliminar Todas las Observaciones'}</button>
              </div>
            </div>
          )}
          {isAdmin && (
            <div className="existing-observations-section">
              <h3>Observaciones existentes</h3>
              {observations.length > 0 ? (
                <div className="observations-content">
                  {observations.map((observation, idx) => (
                    <div key={observation.id || idx} className="observation-item">
                      <div className="observation-header">
                        <span className="observation-user">{observation.user?.institucion || observation.user?.codigo || 'Usuario desconocido'}</span>
                        <span className="observation-date">{new Date(observation.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="observation-message">{observation.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-observations"><p>No hay observaciones registradas para este archivo.</p></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
