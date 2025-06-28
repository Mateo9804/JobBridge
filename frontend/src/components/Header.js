import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>JobBridge</h1>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Empleos</Link></li>
            <li><Link to="/companies">Empresas</Link></li>
            <li><Link to="/pricing">Precios</Link></li>
            <li><Link to="/about">Acerca de</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {isAuthenticated() ? (
            <div className="user-menu">
              <span className="user-name">Hola, {user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header; 