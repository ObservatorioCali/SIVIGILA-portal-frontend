import { useState } from 'react';

export default function DirectoryTable({ entries = [], onEdit, onDelete }) {
  const [sortField, setSortField] = useState('nombreInstitution');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!Array.isArray(entries)) entries = [];

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
    if (bValue == null) return sortOrder === 'asc' ? -1 : 1;
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  const handlePageChange = (p) => setCurrentPage(p);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleDelete = async (entry) => {
    if (!onDelete) return;
    if (!window.confirm(`¿Estás seguro de eliminar la institución "${entry.nombreInstitution}"?\n\nEsta acción no se puede deshacer.`)) return;
    setDeletingId(entry.id); await onDelete(entry); setDeletingId(null);
  };

  const formatDate = (d) => { const date = new Date(d); return date.toLocaleDateString('es-CO'); };
  const getSortIcon = (field) => { if (sortField !== field) return '↕️'; return sortOrder === 'asc' ? '⬆️' : '⬇️'; };

  if (!entries.length) return (<div className="empty-state"><div className="empty-icon">📋</div><h3>No hay instituciones registradas</h3><p>Aún no se han registrado instituciones en el directorio.</p></div>);

  return (
    <div className="directory-table-wrapper">
      <div className="pagination-info-top"><span>Mostrando {startIndex + 1} - {Math.min(endIndex, entries.length)} de {entries.length} instituciones</span></div>
      <div className="pagination-controls-top">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn"><span>◀</span> Anterior</button>
        <div className="page-numbers">
          {totalPages > 10 && currentPage > 6 && (<><button onClick={() => handlePageChange(1)} className="page-btn">1</button><span className="page-ellipsis">...</span></>)}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => { let page; if (totalPages <= 10) page = i + 1; else { if (currentPage <= 5) page = i + 1; else if (currentPage > totalPages - 5) page = totalPages - 9 + i; else page = currentPage - 4 + i; } return (<button key={page} onClick={() => handlePageChange(page)} className={`page-btn ${page === currentPage ? 'active' : ''}`}>{page}</button>); })}
          {totalPages > 10 && currentPage < totalPages - 5 && (<><span className="page-ellipsis">...</span><button onClick={() => handlePageChange(totalPages)} className="page-btn">{totalPages}</button></>)}
        </div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">Siguiente <span>▶</span></button>
      </div>
      <div className="char-table-container">
        <table className="char-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('codigoUPGD')} className="sortable">Código UPGD {getSortIcon('codigoUPGD')}</th>
              <th onClick={() => handleSort('nombreInstitution')} className="sortable">Nombre Institución {getSortIcon('nombreInstitution')}</th>
              <th>Email Principal</th>
              <th>Gerente/Coordinador</th>
              <th>¿Tiene Sistemas?</th>
              <th>Personal Sistemas</th>
              <th>¿Tiene Comité Infecciones?</th>
              <th>Comité Infecciones</th>
              <th>Responsable Sivigila</th>
              <th onClick={() => handleSort('fechaRevision')} className="sortable">Fecha Revisión {getSortIcon('fechaRevision')}</th>
              <th>Revisor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, idx) => (
              <tr key={entry.id} className={!entry.isActive ? 'inactive' : ''}>
                <td>{startIndex + idx + 1}</td>
                <td className="codigo-upgd">{entry.codigoUPGD}</td>
                <td className="institucion"><div className="file-name-cell"><span className="file-icon">🏥</span><strong>{entry.nombreInstitution}</strong></div></td>
                <td>{entry.email}</td>
                <td>{entry.nombreGerente ? (<div className="contact-info"><div className="name">{entry.nombreGerente}</div>{entry.emailGerente && <div className="email">{entry.emailGerente}</div>}{entry.celularGerente && <div className="phone">{entry.celularGerente}</div>}</div>) : '-'}</td>
                <td><span className={`status-badge ${entry.tieneSistemas ? 'yes' : 'no'}`}>{entry.tieneSistemas ? 'Sí' : 'No'}</span></td>
                <td>{entry.nombreSistemas ? (<div className="contact-info"><div className="name">{entry.nombreSistemas}</div>{entry.emailSistemas && <div className="email">{entry.emailSistemas}</div>}{entry.celularSistemas && <div className="phone">{entry.celularSistemas}</div>}</div>) : '-'}</td>
                <td><span className={`status-badge ${entry.tieneComiteInfecciones ? 'yes' : 'no'}`}>{entry.tieneComiteInfecciones ? 'Sí' : 'No'}</span></td>
                <td>{entry.nombreComiteInfecciones ? (<div className="contact-info"><div className="name">{entry.nombreComiteInfecciones}</div>{entry.emailComiteInfecciones && <div className="email">{entry.emailComiteInfecciones}</div>}{entry.celularComiteInfecciones && <div className="phone">{entry.celularComiteInfecciones}</div>}</div>) : '-'}</td>
                <td>{entry.nombreSivigila ? (<div className="contact-info"><div className="name">{entry.nombreSivigila}</div>{entry.emailSivigila && <div className="email">{entry.emailSivigila}</div>}{entry.celularSivigila && <div className="phone">{entry.celularSivigila}</div>}</div>) : '-'}</td>
                <td>{formatDate(entry.fechaRevision)}</td>
                <td>{entry.nombreRevisor}</td>
                <td>
                  <div className="action-buttons-modern">
                    {onEdit && <button onClick={() => onEdit(entry)} className="btn btn-primary" title="Editar institución"><span className="btn-text">Editar</span></button>}
                    {onDelete && <button onClick={() => handleDelete(entry)} className="btn btn-danger" title="Eliminar institución" disabled={deletingId === entry.id}><span className="btn-text">{deletingId === entry.id ? 'Eliminando...' : 'Eliminar'}</span></button>}
                    {!onEdit && !onDelete && <span className="no-actions-text">Solo consulta</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
