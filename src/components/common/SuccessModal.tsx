import React from 'react';
import './Modal.css';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="modal-icon success-icon">
          ✅
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        
        <button className="modal-button success-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
