import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Cerrar el menú si se hace click fuera
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

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
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button className="user-name user-menu-btn" onClick={() => setUserMenuOpen((open) => !open)}>
                Hola, {user?.name}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link to="/account" onClick={() => setUserMenuOpen(false)}>Página de la cuenta</Link>
                  <Link to="/account/edit" onClick={() => setUserMenuOpen(false)}>Editar cuenta</Link>
                  <button onClick={handleLogout} className="btn-logout-dropdown">Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </div>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <nav className="mobile-nav-menu">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Empleos</Link></li>
                <li><Link to="/companies">Empresas</Link></li>
                <li><Link to="/pricing">Precios</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
              </ul>
            </nav>
            <div className="mobile-auth-buttons">
              {isAuthenticated() ? (
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button className="user-name user-menu-btn" onClick={() => setUserMenuOpen((open) => !open)}>
                    Hola, {user?.name}
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown-menu">
                      <Link to="/account" onClick={() => setUserMenuOpen(false)}>Página de la cuenta</Link>
                      <Link to="/account/edit" onClick={() => setUserMenuOpen(false)}>Editar cuenta</Link>
                      <button onClick={handleLogout} className="btn-logout-dropdown">Cerrar Sesión</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                  <Link to="/register" className="btn-register">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header; 