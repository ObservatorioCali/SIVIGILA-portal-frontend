/**
 * DirectoryTable.tsx
 * 
 * Componente principal para mostrar el directorio institucional de salud de Cali
 * con funcionalidades avanzadas de paginación, ordenamiento y gestión de registros.
 * 
 * Características principales:
 * - Tabla responsive con 13 columnas de información institucional
 * - Paginación avanzada (5 registros por página) con navegación tipo "ellipsis"
 * - Ordenamiento por columnas clave (nombre, código UPGD, fecha revisión)
 * - Visualización estructurada de contactos (gerente, sistemas, comité, sivigila)
 * - Badges de estado para campos booleanos (tiene sistemas, tiene comité)
 * - Acciones inline para edición y eliminación de registros
 * - Estado de carga durante operaciones asíncronas
 * 
 * @author SIVIGILA Portal Team
 * @version 2.0.0
 * @since 2024-07-31
 */

import React, { useState } from 'react';
import { DirectoryEntry } from '../../types/directory.types';

/**
 * Props del componente DirectoryTable
 * 
 * @interface DirectoryTableProps
 * @property {DirectoryEntry[]} entries - Array de entradas del directorio institucional
 * @property {function} onEdit - Callback opcional para editar una entrada (solo para admin)
 * @property {function} onDelete - Callback opcional para eliminar una entrada (solo para admin)
 */
interface DirectoryTableProps {
  entries: DirectoryEntry[];
  onEdit?: (entry: DirectoryEntry) => void;
  onDelete?: (entry: DirectoryEntry) => Promise<boolean>;
}

/**
 * Componente DirectoryTable
 * 
 * Renderiza una tabla completa del directorio institucional con todas las
 * funcionalidades de gestión, filtrado y navegación necesarias para el
 * sistema SIVIGILA.
 * 
 * @param {DirectoryTableProps} props - Props del componente
 * @returns {JSX.Element} Componente de tabla del directorio
 */
const DirectoryTable: React.FC<DirectoryTableProps> = ({ entries, onEdit, onDelete }) => {
  // ===========================
  // ESTADO DEL COMPONENTE
  // ===========================
  
  /** Campo por el cual se está ordenando la tabla */
  const [sortField, setSortField] = useState<keyof DirectoryEntry>('nombreInstitution');
  
  /** Orden de clasificación: ascendente o descendente */
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  /** ID del registro que se está eliminando (para mostrar estado de carga) */
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  /** Página actual de la paginación */
  const [currentPage, setCurrentPage] = useState(1);
  
  /** Número de registros por página - configurado para optimizar la visualización */
  const itemsPerPage = 5;

  // ===========================
  // FUNCIONES DE MANEJO
  // ===========================

  /**
   * Maneja el ordenamiento de la tabla por cualquier campo válido
   * 
   * Si se hace clic en la misma columna, alterna entre asc/desc.
   * Si se hace clic en una nueva columna, establece orden ascendente.
   * 
   * @param {keyof DirectoryEntry} field - Campo por el cual ordenar
   */
  const handleSort = (field: keyof DirectoryEntry) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  /**
   * Ordena las entradas según el campo y orden actuales
   * 
   * Maneja casos especiales:
   * - Valores nulos/undefined (se colocan al final en orden asc)
   * - Comparación de strings, números y fechas
   * - Preserva el orden estable para valores iguales
   */
  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Manejar valores indefinidos - los null/undefined van al final en orden ascendente
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
    if (bValue == null) return sortOrder === 'asc' ? -1 : 1;
    
    // Comparación estándar para todos los tipos de datos
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // ===========================
  // LÓGICA DE PAGINACIÓN
  // ===========================

  /** Número total de páginas basado en la cantidad de registros y registros por página */
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  
  /** Índice inicial del slice para la página actual (0-based) */
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  /** Índice final del slice para la página actual */
  const endIndex = startIndex + itemsPerPage;
  
  /** Entradas que se mostrarán en la página actual */
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  /**
   * Navega a una página específica
   * @param {number} page - Número de página (1-based)
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Navega a la página anterior (si existe)
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Navega a la página siguiente (si existe)
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Maneja la eliminación de una entrada del directorio
   * 
   * Proceso:
   * 1. Muestra confirmación al usuario con el nombre de la institución
   * 2. Si se confirma, establece el estado de "eliminando"
   * 3. Ejecuta el callback onDelete (operación asíncrona)
   * 4. Limpia el estado de "eliminando"
   * 
   * @param {DirectoryEntry} entry - Entrada a eliminar
   */
  const handleDelete = async (entry: DirectoryEntry) => {
    if (!onDelete) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar la institución "${entry.nombreInstitution}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      setDeletingId(entry.id);
      await onDelete(entry);
      setDeletingId(null);
    }
  };

  /**
   * Formatea una fecha para mostrar en formato colombiano
   * @param {Date | string} date - Fecha a formatear
   * @returns {string} Fecha formateada (DD/MM/AAAA)
   */
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO');
  };

  /**
   * Retorna el ícono apropiado para el estado de ordenamiento de una columna
   * @param {keyof DirectoryEntry} field - Campo de la columna
   * @returns {string} Emoji del ícono (↕️, ⬆️, ⬇️)
   */
  const getSortIcon = (field: keyof DirectoryEntry) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '⬆️' : '⬇️';
  };

  // ===========================
  // RENDERIZADO CONDICIONAL
  // ===========================

  /**
   * Estado vacío: se muestra cuando no hay instituciones registradas
   * Incluye ícono, título y descripción amigables para el usuario
   */
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No hay instituciones registradas</h3>
        <p>Aún no se han registrado instituciones en el directorio.</p>
      </div>
    );
  }

  // ===========================
  // RENDERIZADO PRINCIPAL
  // ===========================

  return (
    <div className="directory-table-wrapper">
      {/* ===========================
          INFORMACIÓN DE PAGINACIÓN 
          =========================== */}
      <div className="pagination-info-top">
        <span>
          Mostrando {startIndex + 1} - {Math.min(endIndex, entries.length)} de {entries.length} instituciones
        </span>
      </div>
      
      {/* ===========================
          CONTROLES DE PAGINACIÓN
          =========================== */}
      <div className="pagination-controls-top">
        {/* Botón Anterior */}
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <span>◀</span> Anterior
        </button>
        
        {/* Números de Página con Lógica Ellipsis */}
        <div className="page-numbers">
          {/* Mostrar primera página y ... cuando sea necesario */}
          {totalPages > 10 && currentPage > 6 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="page-btn"
              >
                1
              </button>
              <span className="page-ellipsis">...</span>
            </>
          )}
          
          {/* 
            Lógica de paginación inteligente:
            - Si hay ≤10 páginas: mostrar todas
            - Si hay >10 páginas: mostrar ventana deslizante de 10 páginas
            - Centrada en la página actual cuando es posible
          */}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            let page;
            if (totalPages <= 10) {
              page = i + 1;
            } else {
              // Lógica para mostrar páginas alrededor de la página actual
              if (currentPage <= 5) {
                page = i + 1;
              } else if (currentPage > totalPages - 5) {
                page = totalPages - 9 + i;
              } else {
                page = currentPage - 4 + i;
              }
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            );
          })}
          
          {/* Mostrar ... y última página cuando sea necesario */}
          {totalPages > 10 && currentPage < totalPages - 5 && (
            <>
              <span className="page-ellipsis">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="page-btn"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        {/* Botón Siguiente */}
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Siguiente <span>▶</span>
        </button>
      </div>

      {/* ===========================
          TABLA PRINCIPAL DEL DIRECTORIO
          =========================== */}
      <div className="char-table-container">
        <table className="char-table">
          {/* ENCABEZADOS DE TABLA */}
          <thead>
            <tr>
              <th>#</th>
              {/* Código UPGD - Sorteable */}
              <th onClick={() => handleSort('codigoUPGD')} className="sortable">
                Código UPGD {getSortIcon('codigoUPGD')}
              </th>
              {/* Nombre Institución - Sorteable (campo principal) */}
              <th onClick={() => handleSort('nombreInstitution')} className="sortable">
                Nombre Institución {getSortIcon('nombreInstitution')}
              </th>
              <th>Email Principal</th>
              <th>Gerente/Coordinador</th>
              <th>¿Tiene Sistemas?</th>
              <th>Personal Sistemas</th>
              <th>¿Tiene Comité Infecciones?</th>
              <th>Comité Infecciones</th>
              <th>Responsable Sivigila</th>
              {/* Fecha Revisión - Sorteable */}
              <th onClick={() => handleSort('fechaRevision')} className="sortable">
                Fecha Revisión {getSortIcon('fechaRevision')}
              </th>
              <th>Revisor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          
          {/* FILAS DE DATOS */}
          <tbody>
            {currentEntries.map((entry, index) => (
              <tr key={entry.id} className={!entry.isActive ? 'inactive' : ''}>
                {/* Número de fila (considerando la paginación) */}
                <td>{startIndex + index + 1}</td>
                
                {/* Código UPGD */}
                <td className="codigo-upgd">{entry.codigoUPGD}</td>
                
                {/* Nombre de la Institución con ícono */}
                <td className="institucion">
                  <div className="file-name-cell">
                    <span className="file-icon">🏥</span>
                    <strong>{entry.nombreInstitution}</strong>
                  </div>
                </td>
                
                {/* Email Principal */}
                <td>{entry.email}</td>
                
                {/* Información del Gerente/Coordinador */}
                <td>
                  {entry.nombreGerente ? (
                    <div className="contact-info">
                      <div className="name">{entry.nombreGerente}</div>
                      {entry.emailGerente && <div className="email">{entry.emailGerente}</div>}
                      {entry.celularGerente && <div className="phone">{entry.celularGerente}</div>}
                    </div>
                  ) : '-'}
                </td>
                
                {/* Badge: ¿Tiene Personal de Sistemas? */}
                <td>
                  <span className={`status-badge ${entry.tieneSistemas ? 'yes' : 'no'}`}>
                    {entry.tieneSistemas ? 'Sí' : 'No'}
                  </span>
                </td>
                
                {/* Información del Personal de Sistemas */}
                <td>
                  {entry.nombreSistemas ? (
                    <div className="contact-info">
                      <div className="name">{entry.nombreSistemas}</div>
                      {entry.emailSistemas && <div className="email">{entry.emailSistemas}</div>}
                      {entry.celularSistemas && <div className="phone">{entry.celularSistemas}</div>}
                    </div>
                  ) : '-'}
                </td>
                
                {/* Badge: ¿Tiene Comité de Infecciones? */}
                <td>
                  <span className={`status-badge ${entry.tieneComiteInfecciones ? 'yes' : 'no'}`}>
                    {entry.tieneComiteInfecciones ? 'Sí' : 'No'}
                  </span>
                </td>
                
                {/* Información del Comité de Infecciones */}
                <td>
                  {entry.nombreComiteInfecciones ? (
                    <div className="contact-info">
                      <div className="name">{entry.nombreComiteInfecciones}</div>
                      {entry.emailComiteInfecciones && <div className="email">{entry.emailComiteInfecciones}</div>}
                      {entry.celularComiteInfecciones && <div className="phone">{entry.celularComiteInfecciones}</div>}
                    </div>
                  ) : '-'}
                </td>
                
                {/* Información del Responsable Sivigila */}
                <td>
                  {entry.nombreSivigila ? (
                    <div className="contact-info">
                      <div className="name">{entry.nombreSivigila}</div>
                      {entry.emailSivigila && <div className="email">{entry.emailSivigila}</div>}
                      {entry.celularSivigila && <div className="phone">{entry.celularSivigila}</div>}
                    </div>
                  ) : '-'}
                </td>
                
                {/* Fecha de Revisión */}
                <td>{formatDate(entry.fechaRevision)}</td>
                
                {/* Nombre del Revisor */}
                <td>{entry.nombreRevisor}</td>
                
                {/* Acciones (Editar/Eliminar) */}
                <td>
                  <div className="action-buttons-modern">
                    {/* Botón Editar (solo si se proporciona callback) */}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(entry)}
                        className="btn btn-primary"
                        title="Editar institución"
                      >
                        <span className="btn-text">Editar</span>
                      </button>
                    )}
                    
                    {/* Botón Eliminar (solo si se proporciona callback) */}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(entry)}
                        className="btn btn-danger"
                        title="Eliminar institución"
                        disabled={deletingId === entry.id}
                      >
                        <span className="btn-text">
                          {deletingId === entry.id ? 'Eliminando...' : 'Eliminar'}
                        </span>
                      </button>
                    )}
                    
                    {/* Mensaje para usuarios sin permisos de edición */}
                    {!onEdit && !onDelete && (
                      <span className="no-actions-text">Solo consulta</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Exportación por defecto del componente DirectoryTable
 * 
 * Este componente es el corazón de la visualización del directorio institucional
 * del sistema SIVIGILA, proporcionando una interfaz rica y completa para
 * la gestión de instituciones de salud de Cali.
 */
export default DirectoryTable;
