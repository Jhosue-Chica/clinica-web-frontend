import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// Importamos las páginas
import Home from './pages/Home';
import MedicosPage from './pages/MedicosPage';
import PacientesPage from './pages/PacientesPage';
import CitasPage from './pages/CitasPage';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú cuando se hace clic en un enlace en dispositivos móviles
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Sistema Clínico
            </Link>
            
            {/* Botón de hamburguesa para móviles */}
            <button 
              className="mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ 
                display: 'none', 
                '@media (max-width: 768px)': {
                  display: 'block',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }
              }}>
              ☰
            </button>
            
            {/* Enlaces de navegación */}
            <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleLinkClick}>
                Inicio
              </NavLink>
              <NavLink to="/medicos" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleLinkClick}>
                Médicos
              </NavLink>
              <NavLink to="/pacientes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleLinkClick}>
                Pacientes
              </NavLink>
              <NavLink to="/citas" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleLinkClick}>
                Citas
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medicos" element={<MedicosPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/citas" element={<CitasPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Sistema de Gestión Clínica - Todos los derechos reservados</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
