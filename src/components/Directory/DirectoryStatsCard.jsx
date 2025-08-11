export default function DirectoryStatsCard({ stats }) {
  if (!stats) return null;
  return (
    <div className="directory-stats-card">
      <h3>Estadísticas del Directorio</h3>
      <div className="stats-grid">
        <div className="stat-item"><div className="stat-number">{stats.totalEntries}</div><div className="stat-label">Total Instituciones</div></div>
        <div className="stat-item"><div className="stat-number">{stats.upgdCount}</div><div className="stat-label">UPGD</div></div>
        <div className="stat-item"><div className="stat-number">{stats.uiCount}</div><div className="stat-label">UI</div></div>
        <div className="stat-item"><div className="stat-number">{stats.withComiteInfeccionesPct}%</div><div className="stat-label">Con Comité Infecciones</div></div>
        <div className="stat-item"><div className="stat-number">{stats.withSystemsPersonnelPct}%</div><div className="stat-label">Con Personal Sistemas</div></div>
      </div>
    </div>
  );
}
