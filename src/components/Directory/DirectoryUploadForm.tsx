import React, { useState } from 'react';
import { DirectoryService } from '../../services/directory.service';
import ProgressModal from '../common/ProgressModal';

interface DirectoryUploadFormProps {
  onUploadSuccess: () => void;
}

const DirectoryUploadForm: React.FC<DirectoryUploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          selectedFile.type !== 'application/vnd.ms-excel') {
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
      if (progress > 95) {
        progress = 95;
        clearInterval(interval);
      }
      setUploadProgress(Math.floor(progress));
    }, 500);
    return interval;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    const progressInterval = simulateProgress();

    try {
      await DirectoryService.uploadInitialFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Dar tiempo para mostrar el 100%
      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        onUploadSuccess();
        
        // Reset input file
        const fileInput = document.getElementById('directory-file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }, 1000);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.response?.data?.message || 'Error al cargar el archivo del directorio');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="directory-upload-form">
      <div className="upload-card">
        <h3>Carga Inicial del Directorio</h3>
        <p className="upload-description">
          Cargar el archivo Excel con los datos iniciales del directorio UPGD/UI CALI
        </p>

        <div className="file-input-section">
          <input
            id="directory-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
          />
          
          <label htmlFor="directory-file-input" className="file-input-label">
            {file ? (
              <span className="file-selected">
                📄 {file.name}
              </span>
            ) : (
              <span className="file-placeholder">
                📋 Seleccionar archivo Excel del directorio
              </span>
            )}
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="upload-actions">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="btn-upload"
          >
            {isUploading ? 'Cargando...' : 'Cargar Directorio'}
          </button>
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

      <ProgressModal
        isOpen={isUploading}
        progress={uploadProgress}
        title="Cargando Directorio"
        message="Procesando archivo del directorio institucional..."
      />
    </div>
  );
};

export default DirectoryUploadForm;
