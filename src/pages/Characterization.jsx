import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/Characterization/UploadForm.jsx';
import FileTable from '../components/Characterization/FileTable.jsx';
import DataTableModal from '../components/Characterization/DataTableModal.jsx';
import ObservationsModal from '../components/Characterization/ObservationsModal.jsx';
import SuccessModal from '../components/common/SuccessModal.jsx';
import { CharacterizationService } from '../services/characterization.service.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/characterization.css';
import Navbar from '../components/layout/Navbar.jsx';

export const UserRole = { ADMIN: 'ADMIN', UPGD_UI: 'UPGD_UI' };

export default function Characterization() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = user?.role === UserRole.ADMIN;
  const [showDataModal, setShowDataModal] = useState(false);
  const [showObservationsModal, setShowObservationsModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [selectedFileForModal, setSelectedFileForModal] = useState(null);
  const [recordsForModal, setRecordsForModal] = useState([]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await CharacterizationService.getAllFiles();
      if (Array.isArray(response)) setFiles(response); else { setError('Error: formato de datos incorrecto del servidor'); setFiles([]); }
    } catch (err) {
      setError('Error al cargar archivos de caracterización.');
      setFiles([]);
    } finally { setLoading(false); }
  };

  const handleViewAllColumns = async (file) => {
    try {
      setLoadingData(true);
      const fileDetails = await CharacterizationService.getFileById(file.id);
      const recordsData = await CharacterizationService.getFileRecords(file.id, 1, 1000);
      setSelectedFileForModal(fileDetails);
      setRecordsForModal(recordsData.records || []);
      setShowDataModal(true);
    } catch (err) { setError('Error al cargar los datos del archivo.'); }
    finally { setLoadingData(false); }
  };

  const handleViewObservations = (file) => { setSelectedFileForModal(file); setShowObservationsModal(true); };

  const handleObservationAdded = async () => {
    await loadFiles();
    if (selectedFileForModal) {
      try {
        const updatedFile = await CharacterizationService.getFileById(selectedFileForModal.id); setSelectedFileForModal(updatedFile);
      } catch (e) {
        // Silenciar error opcional al refrescar archivo (no crítico para UX)
      }
    }
  };

  const handleDeleteFile = async (file) => {
    try { await CharacterizationService.deleteFile(file.id); await loadFiles(); setShowDeleteSuccessModal(true); return true; }
    catch { setError('Error al eliminar el archivo.'); return false; }
  };

  const closeDataModal = () => { setShowDataModal(false); setSelectedFileForModal(null); setRecordsForModal([]); };
  const closeObservationsModal = () => { setShowObservationsModal(false); setSelectedFileForModal(null); };
  const closeDeleteSuccessModal = () => setShowDeleteSuccessModal(false);

  useEffect(() => { loadFiles(); }, []);

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
                <p className="subtitle">Sube el archivo de corte epidemiológico en formato XLS</p>
                <UploadForm onUploadSuccess={loadFiles} />
              </>
            ) : (
              <p className="subtitle">Revisa los archivos de caracterización y agrega observaciones según sea necesario</p>
            )}
          </div>
        </div>
        <div className="char-table-container">
          {loading ? <p>Cargando archivos...</p> : error ? <p className="error">{error}</p> : (
            <FileTable files={files} onViewAllColumns={handleViewAllColumns} onViewObservations={handleViewObservations} onDelete={isAdmin ? handleDeleteFile : undefined} />
          )}
          {loadingData && (
            <div className="loading-overlay"><div className="loading-spinner"></div><p>Cargando datos del archivo...</p></div>
          )}
        </div>
        <DataTableModal isOpen={showDataModal} onClose={closeDataModal} records={recordsForModal} fileName={selectedFileForModal?.fileName || ''} isFiltered={!isAdmin} userInfo={!isAdmin && user ? `${user.cod_pre}-${user.cod_sub} (${user.institucion})` : ''} />
        <ObservationsModal isOpen={showObservationsModal} onClose={closeObservationsModal} observations={selectedFileForModal?.observations || []} fileName={selectedFileForModal?.fileName || ''} fileId={selectedFileForModal?.id || 0} onObservationAdded={handleObservationAdded} />
        <SuccessModal isOpen={showDeleteSuccessModal} title="Archivo eliminado" message="¡El archivo ha sido eliminado exitosamente!" onClose={closeDeleteSuccessModal} />
      </div>
    </>
  );
}
