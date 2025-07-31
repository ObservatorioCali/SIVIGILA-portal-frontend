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
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15; // Incremento aleatorio para simular carga real
      });
    }, 200);

    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !period) {
      setError('Debe seleccionar un archivo y un periodo.');
      return;
    }

    setLoading(true);
    setError('');

    const progressInterval = simulateProgress();

    try {
      await CharacterizationService.uploadFile(file, period, 1);
      
      // Asegurar que el progreso llegue al 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Pequeña pausa para mostrar el 100%
      setTimeout(() => {
        setShowProgressModal(false);
        setShowSuccessModal(true);
        
        // Limpiar el formulario
        setFile(null);
        setPeriod('');
        
        // Resetear el input de archivo
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setShowProgressModal(false);
      setError('Error al subir el archivo. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onUploadSuccess(); // Refrescar la lista de archivos
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
          {loading ? 'Subiendo...' : 'Subir Archivo'}
        </button>
      </form>

      <ProgressModal
        isOpen={showProgressModal}
        progress={uploadProgress}
        title="Subiendo Archivo"
        message="Por favor espere mientras se procesa el archivo..."
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
