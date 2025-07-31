import React from 'react';
import './Modal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <div className="modal-icon warning-icon">
          ⚠️
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="modal-button confirm-button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
