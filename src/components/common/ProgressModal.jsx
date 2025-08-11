import './Modal.css';

export default function ProgressModal({ isOpen, progress, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content progress-modal">
        <div className="modal-icon">📤</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="progress-container">
          <div className="progress-bar-modal">
            <div className="progress-fill-modal" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
