import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicosService, pacientesService, citasService } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    medicos: 0,
    pacientes: 0,
    citas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar estadísticas
  const fetchStats = async () => {
    console.log('[Home] Iniciando carga de estadísticas');
    setLoading(true);
    setError(null);
    try {
      console.log('[Home] Realizando llamadas paralelas a APIs para obtener estadísticas');
      // Realizar llamadas en paralelo a todas las APIs
      const [medicosData, pacientesData, citasData] = await Promise.all([
        medicosService.getAll(),
        pacientesService.getAll(),
        citasService.getAll()
      ]);

      console.log('[Home] Datos estadísticos recibidos:', {
        medicos: medicosData?.length || 0,
        pacientes: pacientesData?.length || 0,
        citas: citasData?.length || 0
      });

      setStats({
        medicos: medicosData.length,
        pacientes: pacientesData.length,
        citas: citasData.length
      });
      console.log('[Home] Estado de estadísticas actualizado');
    } catch (err) {
      console.error('[Home] Error al cargar estadísticas:', err.message, err.stack);
      setError('Error al cargar las estadísticas. Por favor, intenta nuevamente.');
    } finally {
      console.log('[Home] Finalizando proceso de carga de estadísticas');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRetry = () => {
    // Reintentar carga de datos
    fetchStats();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="mt-3">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h3>Error</h3>
        <p>{error}</p>
        <button className="btn btn-primary mt-3" onClick={handleRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        {/* Tarjeta de Médicos */}
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ color: '#4299e1' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="stat-card-value">{stats.medicos}</div>
          <div className="stat-card-label">Médicos</div>
          <Link to="/medicos" className="btn btn-primary mt-3">Ver Médicos</Link>
        </div>

        {/* Tarjeta de Pacientes */}
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ color: '#48bb78' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-card-value">{stats.pacientes}</div>
          <div className="stat-card-label">Pacientes</div>
          <Link to="/pacientes" className="btn btn-primary mt-3">Ver Pacientes</Link>
        </div>

        {/* Tarjeta de Citas */}
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ color: '#ed8936' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-card-value">{stats.citas}</div>
          <div className="stat-card-label">Citas</div>
          <Link to="/citas" className="btn btn-primary mt-3">Ver Citas</Link>
        </div>
      </div>

      <div className="card mt-5">
        <div className="card-header">
          Información del Sistema
        </div>
        <div className="card-body">
          <h3>Bienvenido al Sistema de Gestión Clínica</h3>
          <p className="mt-3">
            Este sistema permite administrar la información de médicos, pacientes y citas médicas
            de forma eficiente y organizada. Utiliza la barra de navegación superior para acceder
            a los diferentes módulos.
          </p>
          <div className="mt-4">
            <h4>Funcionalidades principales:</h4>
            <ul className="list-group mt-3">
              <li className="list-group-item">Gestión completa de médicos</li>
              <li className="list-group-item">Administración de pacientes</li>
              <li className="list-group-item">Programación y seguimiento de citas médicas</li>
              <li className="list-group-item">Panel de estadísticas en tiempo real</li>
            </ul>
          </div>
          <div className="mt-4">
            <a href="https://localhost:7021/swagger" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Ver Documentación API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
