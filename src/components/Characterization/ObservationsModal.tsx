import React, { useState } from 'react';
import './ObservationsModal.css';
import { Observation } from '../../types/characterization.types';
import { CharacterizationService } from '../../services/characterization.service';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface ObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: Observation[];
  fileName: string;
  fileId: number;
  onObservationAdded?: () => void;
}

const ObservationsModal: React.FC<ObservationsModalProps> = ({ 
  isOpen, 
  onClose, 
  observations, 
  fileName,
  fileId,
  onObservationAdded
}) => {
  const { user } = useAuth();
  const [newObservation, setNewObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newObservation.trim()) {
      setSubmitError('La observación no puede estar vacía');
      return;
    }

    if (!user?.id) {
      setSubmitError('Error: Usuario no autenticado');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await CharacterizationService.addObservation(fileId, newObservation, user.id);
      setNewObservation('');
      setSubmitError('');
      
      // Notificar al componente padre para que recargue las observaciones
      if (onObservationAdded) {
        onObservationAdded();
      }
      
      // Cerrar el modal después de enviar exitosamente
      onClose();
    } catch (error) {
      console.error('Error al agregar observación:', error);
      setSubmitError('Error al agregar la observación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkResolved = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await CharacterizationService.markObservationsResolved(fileId);
      
      // Notificar al componente padre para que recargue los archivos
      if (onObservationAdded) {
        onObservationAdded();
      }
      
      // Cerrar el modal después de marcar como resuelto
      onClose();
    } catch (error) {
      console.error('Error al marcar observaciones como resueltas:', error);
      setSubmitError('Error al marcar las observaciones como resueltas. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="observations-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Observaciones - {fileName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="observations-body">
          {/* Solo usuarios UPGD_UI pueden agregar observaciones */}
          {user?.role === UserRole.UPGD_UI && (
            <div className="add-observation-section">
              <h3>Agregar nueva observación</h3>
              <form onSubmit={handleSubmitObservation}>
                <div className="form-group">
                  <textarea
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    placeholder="Escribe tu observación aquí..."
                    rows={3}
                    className="observation-textarea"
                    disabled={isSubmitting}
                  />
                </div>
                {submitError && (
                  <div className="error-message">
                    {submitError}
                  </div>
                )}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-submit-observation"
                    disabled={isSubmitting || !newObservation.trim()}
                  >
                    {isSubmitting ? 'Enviando...' : 'Agregar Observación'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Solo usuarios ADMIN pueden marcar como resueltas */}
                    {user?.role === UserRole.ADMIN && observations && observations.length > 0 && (
            <div className="admin-actions-section">
              <h3>Acciones de Administrador</h3>
              <p className="admin-info">
                Revisar las observaciones reportadas y marcar como resueltas una vez atendidas.
              </p>
              {submitError && (
                <div className="error-message">
                  {submitError}
                </div>
              )}
              <div className="admin-actions">
                <button 
                  onClick={handleMarkResolved}
                  className="btn-resolve-observations"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : '✓ Marcar Observaciones como Resueltas'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de observaciones existentes - Solo para ADMIN */}
          {user?.role === UserRole.ADMIN && (
            <div className="existing-observations-section">
              <h3>Observaciones existentes</h3>
              {(() => {
                console.log('🔍 DEBUG: Usuario actual (ADMIN):', {
                  id: user.id,
                  codigo: user.codigo,
                  institucion: user.institucion,
                  role: user.role
                });
                console.log('🔍 DEBUG: Observaciones recibidas:', observations);
                return null;
              })()}
              {observations && observations.length > 0 ? (
                <div className="observations-content">
                  {observations.map((observation, index) => (
                    <div key={observation.id || index} className="observation-item">
                      <div className="observation-header">
                        <span className="observation-user">
                          {observation.user?.institucion || observation.user?.codigo || 'Usuario desconocido'}
                        </span>
                        <span className="observation-date">
                          {new Date(observation.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="observation-message">
                        {observation.message}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-observations">
                  <p>No hay observaciones registradas para este archivo.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObservationsModal;
