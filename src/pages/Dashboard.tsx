import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import '../styles/Dashboard.css';
const Dashboard: React.FC = () => {
  const user = { document: 'NOHORA ACEVEDO' }; // Simulación

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h2 className="welcome-text">Bienvenid@, <span>{user.document}</span></h2>

        <div className="cards-grid">
          <div className="dashboard-card">
            <img src="/icons/chart.png" alt="Caracterización" className="card-icon" />
            <h3>Caracterización</h3>
            <p>Sube, revisa y aprueba los archivos de caracterización por periodo.</p>
          </div>

          <div className="dashboard-card">
            <img src="/icons/hospital.png" alt="Directorio" className="card-icon" />
            <h3>Directorio Institucional</h3>
            <p>Consulta y actualiza información de las instituciones UPGD/UI.</p>
          </div>

          <div className="dashboard-card">
            <img src="/icons/user.png" alt="Directorio Profesionales" className="card-icon" />
            <h3>Directorio Profesionales,<br />Epidemiológicos y Técnicos SDDCALI</h3>
            <p>Gestiona datos del personal técnico y profesional autorizado.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;