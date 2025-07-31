import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import '../styles/UnderConstruction.css';

const DirectorioInstitucional: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="under-construction-container">
        {/* Botón de regreso al Dashboard */}
        <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
          <img src="/icons/arrows (1).png" alt="Volver" className="back-icon-only" />
        </button>

        <div className="construction-content">
          <div className="construction-icon">
            🚧
          </div>
          <h1>Directorio Institucional</h1>
          <h2>Página en Construcción</h2>
          <p>
            Este módulo estará disponible próximamente.
            <br />
            Aquí podrás consultar y actualizar información de las instituciones UPGD/UI.
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '30%' }}></div>
          </div>
          <span className="progress-text">Progreso: 30%</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default DirectorioInstitucional;
