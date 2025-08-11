import { useState } from 'react';
import { CharacterizationService } from '../../services/characterization.service.js';
import ProgressModal from '../common/ProgressModal.jsx';
import SuccessModal from '../common/SuccessModal.jsx';
import '../../styles/characterization.css';

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) { setFile(e.target.files[0]); setError(''); }
  };

  const simulateProgress = () => {
    setUploadProgress(0); setShowProgressModal(true);
    const interval = setInterval(() => { setUploadProgress(prev => prev >= 95 ? 95 : prev + Math.random() * 10); }, 300); return interval;
  };

  const handleSubmit = async (e) => { e.preventDefault(); if (!file || !period) { setError('Debe seleccionar un archivo y un periodo.'); return; } await performUpload(); };

  const performUpload = async (isRetry = false) => {
    setLoading(true); setError(''); if (isRetry) { setIsRetrying(true); }
    const isBackendHealthy = await CharacterizationService.checkHealth();
    if (!isBackendHealthy) { setError('El servidor no está disponible. Verifique su conexión e inténtelo más tarde.'); setLoading(false); setIsRetrying(false); return; }
    const progressInterval = simulateProgress();
    try {
      const response = await CharacterizationService.uploadFile(file, period, 1);
      clearInterval(progressInterval); setUploadProgress(100); await new Promise(r => setTimeout(r, 800)); setShowProgressModal(false); setShowSuccessModal(true); setFile(null); setPeriod(''); setRetryCount(0); const fileInput = document.querySelector('input[type="file"]'); if (fileInput) fileInput.value=''; console.log('✅ Archivo subido:', response);
    } catch (err) {
      clearInterval(progressInterval); setShowProgressModal(false); setUploadProgress(0); const canRetry = retryCount < 2 && (err.message.includes('timeout') || err.message.includes('conexión') || err.message.includes('red') || err.message.includes('Network Error'));
      if (canRetry) { setRetryCount(p => p + 1); setError(`Error en la conexión. Reintentando automáticamente... (${retryCount + 1}/3)`); setTimeout(() => { performUpload(true); }, 2000); } else { setError(`Error al subir el archivo: ${err.message}`); setRetryCount(0); }
    } finally { setLoading(false); setIsRetrying(false); }
  };

  const handleSuccessClose = () => { setShowSuccessModal(false); if (onUploadSuccess) onUploadSuccess(); };

  return (
    <>
      <form className="upload-form-enhanced" onSubmit={handleSubmit}>
        <div className="upload-form-header"><div className="upload-icon">📁</div><h3>Subir Archivo de Caracterización</h3><p className="upload-subtitle">Suba archivos Excel (.xls o .xlsx) con los datos de caracterización por periodo epidemiológico</p></div>
        <div className="form-fields">
          <div className="form-group-enhanced"><label htmlFor="period"><span className="label-icon">📅</span>Periodo epidemiológico</label><input id="period" type="date" value={period} onChange={(e) => setPeriod(e.target.value)} className="form-input-enhanced" required /></div>
          <div className="form-group-enhanced"><label htmlFor="file"><span className="label-icon">📄</span>Archivo Excel</label><div className="file-input-wrapper"><input id="file" type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="form-input-file" required /><div className="file-input-display"><span className="file-icon">📎</span><span className="file-text">{file ? file.name : 'Seleccionar archivo .xls o .xlsx'}</span>{file && (<span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>)}</div></div></div>
        </div>
        {error && (<div className="error-message"><span className="error-icon">⚠️</span>{error}</div>)}
        <button type="submit" disabled={loading || !file || !period} className="submit-button-enhanced"><span className="button-icon">⬆️</span>{loading ? (isRetrying ? `Reintentando... (${retryCount}/3)` : 'Subiendo...') : 'Subir Archivo'}</button>
      </form>
      <ProgressModal isOpen={showProgressModal} progress={uploadProgress} title={isRetrying ? 'Reintentando Subida' : 'Subiendo Archivo'} message={isRetrying ? `Reintentando subida del archivo... (${retryCount}/3)` : 'Por favor espere mientras se procesa el archivo...'} />
      <SuccessModal isOpen={showSuccessModal} title="¡Archivo Subido Exitosamente!" message="El archivo de caracterización ha sido procesado y guardado correctamente en el sistema." onClose={handleSuccessClose} />
    </>
  );
}
