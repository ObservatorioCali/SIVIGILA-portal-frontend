import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/Dashboard.css';

export const UserRole = { ADMIN: 'ADMIN', UPGD_UI: 'UPGD_UI' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCharacterizationClick = () => navigate('/characterization');
  const handleDirectorioInstitucionalClick = () => navigate('/directorio-institucional');
  const handleDirectorioProfesionalesClick = () => navigate('/directorio-profesionales');

  const getWelcomeMessage = () => {
    if (!user) return 'Bienvenid@';
    if (user.role === UserRole.ADMIN) return 'Bienvenid@, Administrador';
    if (user.role === UserRole.UPGD_UI) return `Bienvenid@, ${user.institucion || user.codigo}`;
    return `Bienvenid@, ${user.institucion || user.codigo}`;
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h2 className="welcome-text">{getWelcomeMessage()}</h2>
        <div className="cards-grid">
          <div className="dashboard-card" onClick={handleCharacterizationClick} style={{cursor: 'pointer'}}>
            <img src="/icons/chart.png" alt="Caracterización" className="card-icon" />
            <h3>Caracterización</h3>
            <p>Sube, revisa y aprueba los archivos de caracterización por periodo.</p>
          </div>
          <div className="dashboard-card" onClick={handleDirectorioInstitucionalClick} style={{cursor: 'pointer'}}>
            <img src="/icons/hospital.png" alt="Directorio" className="card-icon" />
            <h3>Directorio Institucional</h3>
            <p>Consulta y actualiza información de las instituciones UPGD/UI.</p>
          </div>
          <div className="dashboard-card" onClick={handleDirectorioProfesionalesClick} style={{cursor: 'pointer'}}>
            <img src="/icons/user.png" alt="Directorio Profesionales" className="card-icon" />
            <h3>Directorio Profesionales,<br />Epidemiológicos y Técnicos SDDCALI</h3>
            <p>Gestiona datos del personal técnico y profesional autorizado.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
