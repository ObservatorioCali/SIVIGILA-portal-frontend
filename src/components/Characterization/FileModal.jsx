import '../../styles/characterization.css';

export default function FileModal({ file, onClose }) {
  if (!file) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles del Archivo</h2>
        <button className="close-button" onClick={onClose}>✕</button>
        <div className="file-info">
          <p><strong>Nombre:</strong> {file.fileName}</p>
          <p><strong>Estado:</strong> {file.status}</p>
          <p><strong>Fecha Subida:</strong> {new Date(file.createdAt).toLocaleString()}</p>
          {file.verifiedAt && <p><strong>Verificado en:</strong> {new Date(file.verifiedAt).toLocaleString()}</p>}
        </div>
        <div className="observations-section">
          <h3>Observaciones</h3>
          {file.observations && file.observations.length > 0 ? (
            <ul className="observations-list">
              {file.observations.map((obs, idx) => (
                <li key={obs.id || idx}>
                  <p>{obs.message}</p>
                  <span className="observation-date">{new Date(obs.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : <p>No hay observaciones registradas.</p>}
        </div>
      </div>
    </div>
  );
}
