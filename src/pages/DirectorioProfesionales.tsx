import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import '../styles/UnderConstruction.css';

const DirectorioProfesionales: React.FC = () => {
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
          <h1>Directorio Profesionales, Epidemiológicos y Técnicos SDDCALI</h1>
          <h2>Página en Construcción</h2>
          <p>
            Este módulo estará disponible próximamente.
            <br />
            Aquí podrás gestionar datos del personal técnico y profesional autorizado.
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '15%' }}></div>
          </div>
          <span className="progress-text">Progreso: 15%</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default DirectorioProfesionales;
