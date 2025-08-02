import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { DirectoryEntry, DirectoryStats } from '../types/directory.types';
import { DirectoryService } from '../services/directory.service';
import Navbar from '../components/layout/Navbar';
import DirectoryUploadForm from '../components/Directory/DirectoryUploadForm';
import DirectoryTable from '../components/Directory/DirectoryTable';
import DirectoryEntryModal from '../components/Directory/DirectoryEntryModal';
import DirectoryStatsCard from '../components/Directory/DirectoryStatsCard';
import SuccessModal from '../components/common/SuccessModal';
import '../styles/directory.css';

const DirectorioInstitucional: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [stats, setStats] = useState<DirectoryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estados para modales
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<DirectoryEntry | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
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
      
      // Filtrar entradas para usuarios UPGD_UI - solo mostrar su institución
      let filteredEntries = entriesData;
      if (isUPGD && user?.codigo) {
        // Buscar por código UPGD primero (más confiable)
        filteredEntries = entriesData.filter(entry => 
          entry.codigoUPGD === user.codigo
        );
        
        // Si no hay resultados, intentar filtrar por nombre de institución
        if (filteredEntries.length === 0 && user?.institucion) {
          filteredEntries = entriesData.filter(entry => 
            entry.nombreInstitution === user.institucion
          );
        }
        
        // Log para debugging mejorado
        console.log('🔍 Debug filtrado UPGD_UI:');
        console.log('Usuario institucion:', user.institucion);
        console.log('Usuario codigo:', user.codigo);
        console.log('Total entradas:', entriesData.length);
        console.log('Entradas filtradas:', filteredEntries.length);
        
        // Buscar entradas que contengan el código del usuario
        const codigoMatches = entriesData.filter(entry => 
          entry.codigoUPGD.includes(user.codigo) || user.codigo.includes(entry.codigoUPGD)
        );
        console.log('Coincidencias de código encontradas:', codigoMatches.length);
        if (codigoMatches.length > 0) {
          console.log('Coincidencias de código COMPLETAS:', codigoMatches.map(e => ({
            nombreInstitution: e.nombreInstitution,
            codigoUPGD: e.codigoUPGD,
            id: e.id
          })));
          
          // Si encontramos coincidencias, usar la primera como resultado
          if (filteredEntries.length === 0) {
            // Buscar la coincidencia más exacta (preferir coincidencia completa)
            const exactMatch = codigoMatches.find(entry => entry.codigoUPGD === user.codigo);
            if (exactMatch) {
              filteredEntries = [exactMatch];
              console.log('✅ Coincidencia exacta encontrada:', exactMatch.nombreInstitution);
            } else {
              // Si no hay coincidencia exacta, usar la primera coincidencia parcial
              filteredEntries = [codigoMatches[0]];
              console.log('⚠️ Usando coincidencia parcial:', codigoMatches[0].nombreInstitution);
            }
          }
        }
        
        // Si aún no hay resultados, mostrar códigos similares para debugging
        if (filteredEntries.length === 0) {
          const codigoSimilar = entriesData.filter(entry => 
            entry.codigoUPGD.includes(user.codigo.substring(0, 8)) ||
            user.codigo.includes(entry.codigoUPGD.substring(0, 8))
          ).slice(0, 10);
          console.log('Códigos similares encontrados:', codigoSimilar.map(e => ({
            nombreInstitution: e.nombreInstitution,
            codigoUPGD: e.codigoUPGD
          })));
        }
      }
      
      setEntries(filteredEntries);
      setStats(statsData);
      setError('');
    } catch (err: any) {
      setError('Error al cargar el directorio institucional.');
      console.error('Error loading directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadEntries();
      return;
    }

    try {
      setLoading(true);
      const results = await DirectoryService.search(query);
      
      // Filtrar resultados de búsqueda para usuarios UPGD_UI
      let filteredResults = results;
      if (isUPGD && user?.codigo) {
        // Buscar por código UPGD primero
        filteredResults = results.filter(entry => 
          entry.codigoUPGD === user.codigo
        );
        
        // Si no hay resultados exactos, buscar coincidencias parciales
        if (filteredResults.length === 0) {
          const codigoMatches = results.filter(entry => 
            entry.codigoUPGD.includes(user.codigo) || user.codigo.includes(entry.codigoUPGD)
          );
          if (codigoMatches.length > 0) {
            filteredResults = codigoMatches;
          } else if (user?.institucion) {
            // Como último recurso, intentar por nombre de institución
            filteredResults = results.filter(entry => 
              entry.nombreInstitution === user.institucion
            );
          }
        }
      }
      
      setEntries(filteredResults);
    } catch (err) {
      setError('Error al buscar en el directorio.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setSuccessMessage('¡Archivo del directorio cargado exitosamente!');
    setShowSuccessModal(true);
    loadEntries();
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setShowEntryModal(true);
  };

  const handleEditEntry = (entry: DirectoryEntry) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  const handleEntrySuccess = (message: string) => {
    setShowEntryModal(false);
    setSuccessMessage(message);
    setShowSuccessModal(true);
    loadEntries();
  };

  const handleDeleteEntry = async (entry: DirectoryEntry): Promise<boolean> => {
    try {
      await DirectoryService.deleteEntry(entry.id);
      setSuccessMessage(`Institución "${entry.nombreInstitution}" eliminada exitosamente.`);
      setShowSuccessModal(true);
      loadEntries();
      return true;
    } catch (err: any) {
      setError('Error al eliminar la institución.');
      return false;
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <>
      <Navbar />
      <div className="directory-container">
        <div className="directory-header">
          <button 
            className="back-to-dashboard-btn" 
            onClick={() => navigate('/dashboard')} 
            title="Volver al Dashboard"
          >
            <img src="/icons/arrows (1).png" alt="Volver" className="back-icon-only" />
          </button>
          
          <div className="directory-content">
            <h1>{isUPGD ? 'Mi Institución - Directorio UPGD/UI' : 'Directorio UPGD/UI CALI'}</h1>
            <p className="subtitle">
              {isUPGD 
                ? `Información de contacto de ${user?.institucion || 'mi institución'}` 
                : 'Gestión del directorio institucional de la Secretaría Distrital de Salud de Cali'
              }
            </p>

            {/* Estadísticas del directorio - Solo para Admin */}
            {stats && isAdmin && <DirectoryStatsCard stats={stats} />}

            {/* Formulario de carga inicial - Solo para Admin */}
            {isAdmin && (
              <div className="directory-upload-section">
                <DirectoryUploadForm onUploadSuccess={handleUploadSuccess} />
              </div>
            )}

            {/* Barra de búsqueda y botón para agregar */}
            <div className="directory-actions">
              <div className="search-section">
                <input
                  type="text"
                  placeholder={isUPGD ? "Buscar en mi institución..." : "Buscar por institución, código UPGD o responsable..."}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button 
                className="btn-add-entry"
                onClick={handleCreateEntry}
                title="Agregar nueva institución"
                style={{ display: canEdit ? 'flex' : 'none' }}
              >
                <span>➕</span> Nueva Institución
              </button>
            </div>
          </div>
        </div>

        {/* Tabla del directorio */}
        <div className="directory-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando directorio...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error">{error}</p>
              <button onClick={loadEntries} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : (
            <DirectoryTable
              entries={entries}
              onEdit={canEdit ? handleEditEntry : undefined}
              onDelete={isAdmin ? handleDeleteEntry : undefined}
            />
          )}
        </div>

        {/* Modales */}
        <DirectoryEntryModal
          isOpen={showEntryModal}
          onClose={() => setShowEntryModal(false)}
          entry={selectedEntry}
          onSuccess={handleEntrySuccess}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          title="Operación Exitosa"
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </>
  );
};

export default DirectorioInstitucional;
