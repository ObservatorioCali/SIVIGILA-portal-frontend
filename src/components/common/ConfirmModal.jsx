import './Modal.css';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Eliminar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <div className="modal-icon warning-icon">⚠️</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onCancel}>{cancelText}</button>
          <button className="modal-button confirm-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
