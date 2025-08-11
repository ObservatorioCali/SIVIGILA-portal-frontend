import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { DirectoryService } from '../services/directory.service.js';
import Navbar from '../components/layout/Navbar.jsx';
import DirectoryUploadForm from '../components/Directory/DirectoryUploadForm.jsx';
import DirectoryTable from '../components/Directory/DirectoryTable.jsx';
import DirectoryEntryModal from '../components/Directory/DirectoryEntryModal.jsx';
import DirectoryStatsCard from '../components/Directory/DirectoryStatsCard.jsx';
import SuccessModal from '../components/common/SuccessModal.jsx';
import '../styles/directory.css';

export const UserRole = { ADMIN: 'ADMIN', UPGD_UI: 'UPGD_UI' };

export default function DirectorioInstitucional() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const isAdmin = user?.role === UserRole.ADMIN;
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.UPGD_UI;
  const isUPGD = user?.role === UserRole.UPGD_UI;

  const loadEntries = async () => {
    try {
      setLoading(true);
      const [entriesData, statsData] = await Promise.all([
        DirectoryService.getAllEntries(),
        DirectoryService.getStats(),
      ]);
      let filteredEntries = entriesData;
      if (isUPGD && user?.codigo) {
        filteredEntries = entriesData.filter(entry => entry.codigoUPGD === user.codigo);
        if (filteredEntries.length === 0 && user?.institucion) {
          filteredEntries = entriesData.filter(entry => entry.nombreInstitution === user.institucion);
        }
        const codigoMatches = entriesData.filter(entry => entry.codigoUPGD.includes(user.codigo) || user.codigo.includes(entry.codigoUPGD));
        if (filteredEntries.length === 0 && codigoMatches.length > 0) {
          const exactMatch = codigoMatches.find(entry => entry.codigoUPGD === user.codigo);
          filteredEntries = exactMatch ? [exactMatch] : [codigoMatches[0]];
        }
        if (filteredEntries.length === 0) {
          const codigoSimilar = entriesData.filter(entry => entry.codigoUPGD.includes(user.codigo.substring(0,8)) || user.codigo.includes(entry.codigoUPGD.substring(0,8))).slice(0,10);
          console.log('Códigos similares:', codigoSimilar.map(e => ({ nombreInstitution: e.nombreInstitution, codigoUPGD: e.codigoUPGD })));
        }
      }
      setEntries(filteredEntries);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError('Error al cargar el directorio institucional.');
    } finally { setLoading(false); }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) { loadEntries(); return; }
    try {
      setLoading(true);
      const results = await DirectoryService.search(query);
      let filteredResults = results;
      if (isUPGD && user?.codigo) {
        filteredResults = results.filter(entry => entry.codigoUPGD === user.codigo);
        if (filteredResults.length === 0) {
          const codigoMatches = results.filter(entry => entry.codigoUPGD.includes(user.codigo) || user.codigo.includes(entry.codigoUPGD));
          if (codigoMatches.length > 0) filteredResults = codigoMatches; else if (user?.institucion) filteredResults = results.filter(entry => entry.nombreInstitution === user.institucion);
        }
      }
      setEntries(filteredResults);
    } catch { setError('Error al buscar en el directorio.'); }
    finally { setLoading(false); }
  };

  const handleUploadSuccess = () => { setSuccessMessage('¡Archivo del directorio cargado exitosamente!'); setShowSuccessModal(true); loadEntries(); };
  const handleCreateEntry = () => { setSelectedEntry(null); setShowEntryModal(true); };
  const handleEditEntry = (entry) => { setSelectedEntry(entry); setShowEntryModal(true); };
  const handleEntrySuccess = (message) => { setShowEntryModal(false); setSuccessMessage(message); setShowSuccessModal(true); loadEntries(); };
  const handleDeleteEntry = async (entry) => { try { await DirectoryService.deleteEntry(entry.id); setSuccessMessage(`Institución "${entry.nombreInstitution}" eliminada exitosamente.`); setShowSuccessModal(true); loadEntries(); return true; } catch { setError('Error al eliminar la institución.'); return false; } };

  useEffect(() => {
    loadEntries();
    // loadEntries se define en el componente y no cambia entre renders relevantes para este efecto inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="directory-container">
        <div className="directory-header">
          <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
            <img src="/icons/arrows (1).png" alt="Volver" className="back-icon-only" />
          </button>
          <div className="directory-content">
            <h1>{isUPGD ? 'Mi Institución - Directorio UPGD/UI' : 'Directorio UPGD/UI CALI'}</h1>
            <p className="subtitle">{isUPGD ? `Información de contacto de ${user?.institucion || 'mi institución'}` : 'Gestión del directorio institucional de la Secretaría Distrital de Salud de Cali'}</p>
            {stats && isAdmin && <DirectoryStatsCard stats={stats} />}
            {isAdmin && <div className="directory-upload-section"><DirectoryUploadForm onUploadSuccess={handleUploadSuccess} /></div>}
            <div className="directory-actions">
              <div className="search-section">
                <input type="text" placeholder={isUPGD ? 'Buscar en mi institución...' : 'Buscar por institución, código UPGD o responsable...'} value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="search-input" />
              </div>
              <button className="btn-add-entry" onClick={handleCreateEntry} title="Agregar nueva institución" style={{ display: canEdit ? 'flex' : 'none' }}><span>➕</span> Nueva Institución</button>
            </div>
          </div>
        </div>
        <div className="directory-table-container">
          {loading ? (
            <div className="loading-state"><div className="loading-spinner"></div><p>Cargando directorio...</p></div>
          ) : error ? (
            <div className="error-state"><p className="error">{error}</p><button onClick={loadEntries} className="retry-btn">Reintentar</button></div>
          ) : (
            <DirectoryTable entries={entries} onEdit={canEdit ? handleEditEntry : undefined} onDelete={isAdmin ? handleDeleteEntry : undefined} />
          )}
        </div>
        <DirectoryEntryModal isOpen={showEntryModal} onClose={() => setShowEntryModal(false)} entry={selectedEntry} onSuccess={handleEntrySuccess} />
        <SuccessModal isOpen={showSuccessModal} title="Operación Exitosa" message={successMessage} onClose={() => setShowSuccessModal(false)} />
      </div>
    </>
  );
}
