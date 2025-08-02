// src/components/Characterization/UploadForm.tsx
import React, { useState } from 'react';
import { CharacterizationService  } from '../../services/characterization.service';
import ProgressModal from '../common/ProgressModal';
import SuccessModal from '../common/SuccessModal';
import '../../styles/characterization.css';

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(''); // Limpiar errores al seleccionar archivo
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    setShowProgressModal(true);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) { // No llegar al 100% hasta que termine realmente
          return 95;
        }
        return prev + Math.random() * 10; // Incremento más controlado
      });
    }, 300);

    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !period) {
      setError('Debe seleccionar un archivo y un periodo.');
      return;
    }

    await performUpload();
  };

  const performUpload = async (isRetry = false) => {
    setLoading(true);
    setError('');

    if (isRetry) {
      setIsRetrying(true);
      console.log(`🔄 Reintentando upload (intento ${retryCount + 1}/3)`);
    }

    // Verificar conectividad antes de intentar el upload
    console.log('🔍 Verificando conectividad del backend...');
    const isBackendHealthy = await CharacterizationService.checkHealth();
    if (!isBackendHealthy) {
      setError('El servidor no está disponible. Verifique su conexión e inténtelo más tarde.');
      setLoading(false);
      setIsRetrying(false);
      return;
    }

    const progressInterval = simulateProgress();

    try {
      const response = await CharacterizationService.uploadFile(file!, period, 1);
      
      // Limpiar el intervalo y asegurar que el progreso llegue al 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Esperar un momento para mostrar el 100% completado
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Cerrar modal de progreso y mostrar modal de éxito
      setShowProgressModal(false);
      setShowSuccessModal(true);
      
      // Limpiar el formulario
      setFile(null);
      setPeriod('');
      setRetryCount(0); // Reset retry count on success
      
      // Resetear el input de archivo
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      console.log('✅ Archivo subido exitosamente:', response);

    } catch (err: any) {
      // Limpiar el intervalo en caso de error
      clearInterval(progressInterval);
      setShowProgressModal(false);
      setUploadProgress(0);
      
      console.error('❌ Error en la subida del archivo:', err);
      
      // Determinar si se puede reintentar
      const canRetry = retryCount < 2 && (
        err.message.includes('timeout') || 
        err.message.includes('conexión') || 
        err.message.includes('red') ||
        err.message.includes('Network Error')
      );

      if (canRetry) {
        setRetryCount(prev => prev + 1);
        setError(`Error en la conexión. Reintentando automáticamente... (${retryCount + 1}/3)`);
        
        // Esperar 2 segundos antes de reintentar
        setTimeout(() => {
          performUpload(true);
        }, 2000);
      } else {
        setError(`Error al subir el archivo: ${err.message}`);
        setRetryCount(0); // Reset retry count on final failure
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleSuccessClose = () => {
    console.log('🎉 Cerrando modal de éxito y refrescando lista de archivos');
    setShowSuccessModal(false);
    // Asegurar que se ejecute la función de callback
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  return (
    <>
      <form className="upload-form-enhanced" onSubmit={handleSubmit}>
        <div className="upload-form-header">
          <div className="upload-icon">📁</div>
          <h3>Subir Archivo de Caracterización</h3>
          <p className="upload-subtitle">Suba archivos Excel (.xls o .xlsx) con los datos de caracterización por periodo epidemiológico</p>
        </div>

        <div className="form-fields">
          <div className="form-group-enhanced">
            <label htmlFor="period">
              <span className="label-icon">📅</span>
              Periodo epidemiológico
            </label>
            <input
              id="period"
              type="date"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-input-enhanced"
              required
            />
          </div>

          <div className="form-group-enhanced">
            <label htmlFor="file">
              <span className="label-icon">📄</span>
              Archivo Excel
            </label>
            <div className="file-input-wrapper">
              <input
                id="file"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="form-input-file"
                required
              />
              <div className="file-input-display">
                <span className="file-icon">📎</span>
                <span className="file-text">
                  {file ? file.name : 'Seleccionar archivo .xls o .xlsx'}
                </span>
                {file && (
                  <span className="file-size">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !file || !period}
          className="submit-button-enhanced"
        >
          <span className="button-icon">⬆️</span>
          {loading ? (
            isRetrying ? `Reintentando... (${retryCount}/3)` : 'Subiendo...'
          ) : 'Subir Archivo'}
        </button>
      </form>

      <ProgressModal
        isOpen={showProgressModal}
        progress={uploadProgress}
        title={isRetrying ? "Reintentando Subida" : "Subiendo Archivo"}
        message={
          isRetrying 
            ? `Reintentando subida del archivo... (${retryCount}/3)` 
            : "Por favor espere mientras se procesa el archivo..."
        }
      />

      <SuccessModal
        isOpen={showSuccessModal}
        title="¡Archivo Subido Exitosamente!"
        message="El archivo de caracterización ha sido procesado y guardado correctamente en el sistema."
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default UploadForm;
