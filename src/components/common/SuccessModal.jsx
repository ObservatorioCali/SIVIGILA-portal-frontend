import './Modal.css';

export default function SuccessModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="modal-icon success-icon">✅</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="modal-button success-button" onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
}
