import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useNotification } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, addNotification, deleteNotification, markAllAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifAnim, setNotifAnim] = useState(false);
  const [notifClickAnim, setNotifClickAnim] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Simular llegada de notificación (puedes borrar esto luego)
  // setTimeout(() => {
  //   setNotifications((prev) => [
  //     { id: Date.now(), message: 'Nueva notificación de ejemplo', read: false, date: new Date() },
  //     ...prev
  //   ]);
  //   setNotifAnim(true);
  // }, 10000);

  // Animación al llegar notificación
  React.useEffect(() => {
    if (notifications.length > 0 && notifications.some(n => !n.read)) {
      setNotifAnim(true);
      const timer = setTimeout(() => setNotifAnim(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Cerrar el menú si se hace click fuera
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifMenuOpen(false);
      }
    }
    if (userMenuOpen || notifMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, notifMenuOpen]);

  const handleLogout = () => {
    logout();
  };

  const handleNotifClick = () => {
    setNotifMenuOpen((open) => !open);
    setNotifAnim(false);
    markAllAsRead();
    setNotifClickAnim(false);
    setTimeout(() => setNotifClickAnim(true), 10);
    setTimeout(() => setNotifClickAnim(false), 700);
  };

  const handleDeleteNotif = (id) => {
    deleteNotification(id);
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
            <li>
              <div
                className="dropdown-menu-wrapper"
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                tabIndex={0}
              >
                <span
                  className="dropdown-toggle-label"
                  tabIndex={0}
                  style={{ display: 'inline-block', cursor: 'pointer', fontWeight: 700, color: '#222', textDecoration: 'none' }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Empresas
                </span>
                <div className="dropdown-menu-content">
                  <Link to="/companies" onClick={() => setDropdownOpen(false)}>Panel de Empresas</Link>
                  <Link to="/companies?tab=applications" onClick={() => setDropdownOpen(false)}>Panel de Solicitudes</Link>
                </div>
              </div>
            </li>
            <li><Link to="/pricing">Precios</Link></li>
            <li><Link to="/about">Acerca de</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {isAuthenticated() ? (
            <div
              className="user-menu-wrapper"
              ref={userMenuRef}
              tabIndex={0}
            >
              <span
                className="user-dropdown-trigger"
                tabIndex={0}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                Hola, {user?.name}
              </span>
              <div className="user-dropdown-menu">
                <Link to="/account"><span>Página de la cuenta</span></Link>
                <Link to={user?.role === 'company' ? "/company/edit" : "/account/edit"}><span>Editar cuenta</span></Link>
                <button onClick={handleLogout} className="btn-logout-dropdown"><span>Cerrar Sesión</span></button>
              </div>
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
            <div className="mobile-auth-dropdown">
              {isAuthenticated() ? (
                <div className="user-menu-wrapper" ref={userMenuRef} tabIndex={0}>
                  <span
                    className="user-dropdown-trigger"
                    tabIndex={0}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{ color: '#222', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', display: 'block', margin: '0 auto 12px auto', textAlign: 'center' }}
                  >
                    Hola, {user?.name}
                  </span>
                  {userMenuOpen && (
                    <div className="user-dropdown-menu" style={{ position: 'static', background: 'none', boxShadow: 'none', minWidth: 'unset', margin: 0, padding: 0 }}>
                      <Link to="/account" onClick={() => setMobileMenuOpen(false)}><span>Página de la cuenta</span></Link>
                      <Link to={user?.role === 'company' ? "/company/edit" : "/account/edit"} onClick={() => setMobileMenuOpen(false)}><span>Editar cuenta</span></Link>
                      <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-logout-dropdown"><span>Cerrar Sesión</span></button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mobile-auth-buttons" style={{ marginBottom: 16 }}>
                  <Link to="/login" className="btn-login" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                  <Link to="/register" className="btn-register" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                </div>
              )}
            </div>
            <nav className="mobile-nav-menu">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Empleos</Link></li>
                <li>
                  <div
                    className="dropdown-menu-wrapper"
                    style={{ position: 'relative', display: 'inline-block' }}
                    onClick={() => setMobileDropdownOpen(open => !open)}
                    tabIndex={0}
                  >
                    <span
                      className="dropdown-toggle-label"
                      tabIndex={0}
                      style={{ display: 'inline-block', cursor: 'pointer', fontWeight: 700, color: '#222', textDecoration: 'none' }}
                    >
                      Empresas
                    </span>
                    <div className="dropdown-menu-content" style={{ display: mobileDropdownOpen ? 'block' : 'none', position: 'static', background: 'none', boxShadow: 'none' }}>
                      <Link to="/companies" onClick={() => setMobileDropdownOpen(false)}>Panel de Empresas</Link>
                      <Link to="/companies?tab=applications" onClick={() => setMobileDropdownOpen(false)}>Panel de Solicitudes</Link>
                    </div>
                  </div>
                </li>
                <li><Link to="/pricing">Precios</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header; 