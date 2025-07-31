import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/Characterization/UploadForm';
import FileTable from '../components/Characterization/FileTable';
import DataTableModal from '../components/Characterization/DataTableModal';
import ObservationsModal from '../components/Characterization/ObservationsModal';
import SuccessModal from '../components/common/SuccessModal';
import { CharacterizationFile, CharacterizationRecord } from '../types/characterization.types';
import { CharacterizationService } from '../services/characterization.service';
import { UserRole } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import '../styles/characterization.css';
import Navbar from '../components/layout/Navbar';

const Characterization: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<CharacterizationFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Verificar rol del usuario
  const isAdmin = user?.role === UserRole.ADMIN;

  // Estados para los nuevos modales
  const [showDataModal, setShowDataModal] = useState<boolean>(false);
  const [showObservationsModal, setShowObservationsModal] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [selectedFileForModal, setSelectedFileForModal] = useState<CharacterizationFile | null>(null);
  const [recordsForModal, setRecordsForModal] = useState<CharacterizationRecord[]>([]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await CharacterizationService.getAllFiles();
      setFiles(response);
    } catch (err) {
      setError('Error al cargar archivos de caracterización.');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar los modales
  const handleViewAllColumns = async (file: CharacterizationFile) => {
    try {
      setLoadingData(true);
      const fileDetails = await CharacterizationService.getFileById(file.id);
      setSelectedFileForModal(fileDetails);
      setRecordsForModal(fileDetails.records || []);
      setShowDataModal(true);
    } catch (err) {
      setError('Error al cargar los datos del archivo.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewObservations = (file: CharacterizationFile) => {
    setSelectedFileForModal(file);
    setShowObservationsModal(true);
  };

  const handleObservationAdded = async () => {
    // Recargar los archivos para actualizar las observaciones
    await loadFiles();
    
    // Si tenemos un archivo seleccionado, recargamos sus detalles
    if (selectedFileForModal) {
      try {
        const updatedFile = await CharacterizationService.getFileById(selectedFileForModal.id);
        setSelectedFileForModal(updatedFile);
      } catch (error) {
        console.error('Error al recargar detalles del archivo:', error);
      }
    }
  };

  const handleDeleteFile = async (file: CharacterizationFile): Promise<boolean> => {
    try {
      console.log('Eliminando archivo del servidor:', file.fileName);
      await CharacterizationService.deleteFile(file.id);
      setError('');
      // Recargar la lista de archivos
      await loadFiles();
      console.log('Archivo eliminado exitosamente, mostrando modal de éxito');
      setShowDeleteSuccessModal(true);
      return true; // Éxito
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      setError('Error al eliminar el archivo.');
      console.error(err);
      return false; // Error
    }
  };

  const closeDataModal = () => {
    setShowDataModal(false);
    setSelectedFileForModal(null);
    setRecordsForModal([]);
  };

  const closeObservationsModal = () => {
    setShowObservationsModal(false);
    setSelectedFileForModal(null);
  };

  const closeDeleteSuccessModal = () => {
    setShowDeleteSuccessModal(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <>
      <Navbar />

      <div className="char-container">
        <div className="char-header-horizontal">
          <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
            <img src="/icons/arrows (1).png" alt="Volver" className="back-icon-only" />
          </button>
          <div className="char-text-content">
            <h1>Caracterización</h1>
            {isAdmin ? (
              <>
                <p className="subtitle">
                  Sube el archivo de corte epidemiológico en formato XLS
                </p>
                <UploadForm onUploadSuccess={loadFiles} />
              </>
            ) : (
              <p className="subtitle">
                Revisa los archivos de caracterización y agrega observaciones según sea necesario
              </p>
            )}
          </div>
        </div>

        <div className="char-table-container">
          {loading ? (
            <p>Cargando archivos...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <FileTable
              files={files}
              onViewAllColumns={handleViewAllColumns}
              onViewObservations={handleViewObservations}
              onDelete={isAdmin ? handleDeleteFile : undefined}
            />
          )}

          {loadingData && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando datos del archivo...</p>
            </div>
          )}
        </div>


        {/* Modal para ver todas las columnas */}
        <DataTableModal
          isOpen={showDataModal}
          onClose={closeDataModal}
          records={recordsForModal}
          fileName={selectedFileForModal?.fileName || ''}
        />

        {/* Modal para ver observaciones */}
        <ObservationsModal
          isOpen={showObservationsModal}
          onClose={closeObservationsModal}
          observations={selectedFileForModal?.observations || []}
          fileName={selectedFileForModal?.fileName || ''}
          fileId={selectedFileForModal?.id || 0}
          onObservationAdded={handleObservationAdded}
        />

        {/* Modal de éxito para eliminación */}
        <SuccessModal
          isOpen={showDeleteSuccessModal}
          title="Archivo eliminado"
          message="¡El archivo ha sido eliminado exitosamente!"
          onClose={closeDeleteSuccessModal}
        />
      </div>
    </>
  );
};

export default Characterization;
