import { useState } from 'react';
import { DirectoryService } from '../../services/directory.service.js';
import ProgressModal from '../common/ProgressModal.jsx';

export default function DirectoryUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(selectedFile.type)) {
        setError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 95) { progress = 95; clearInterval(interval); }
      setUploadProgress(Math.floor(progress));
    }, 500);
    return interval;
  };

  const handleUpload = async () => {
    if (!file) { setError('Por favor selecciona un archivo'); return; }
    setIsUploading(true); setError(''); setUploadProgress(0);
    const progressInterval = simulateProgress();
    try {
      await DirectoryService.uploadInitialFile(file);
      clearInterval(progressInterval); setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false); setFile(null); onUploadSuccess();
        const input = document.getElementById('directory-file-input'); if (input) input.value = '';
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval); setIsUploading(false);
      setError(err?.response?.data?.message || 'Error al cargar el archivo del directorio');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="directory-upload-form">
      <div className="upload-card">
        <h3>Carga Inicial del Directorio</h3>
        <p className="upload-description">Cargar el archivo Excel con los datos iniciales del directorio UPGD/UI CALI</p>
        <div className="file-input-section">
          <input id="directory-file-input" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="file-input" disabled={isUploading} />
          <label htmlFor="directory-file-input" className="file-input-label">{file ? <span className="file-selected">📄 {file.name}</span> : <span className="file-placeholder">📋 Seleccionar archivo Excel del directorio</span>}</label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="upload-actions">
          <button onClick={handleUpload} disabled={!file || isUploading} className="btn-upload">{isUploading ? 'Cargando...' : 'Cargar Directorio'}</button>
        </div>
        <div className="upload-instructions">
          <h4>Instrucciones:</h4>
          <ul>
            <li>El archivo debe ser formato Excel (.xlsx o .xls)</li>
            <li>Debe contener las columnas correspondientes a las 5 secciones del formulario</li>
            <li>La primera fila debe contener los encabezados de las columnas</li>
            <li>Los códigos UPGD deben seguir el formato: 76001_________</li>
          </ul>
        </div>
      </div>
      <ProgressModal isOpen={isUploading} progress={uploadProgress} title="Cargando Directorio" message="Procesando archivo del directorio institucional..." />
    </div>
  );
}
