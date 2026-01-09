import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useNotification } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, deleteNotification, notifAnim } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' o 'register'

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

  // Función comentada por no uso actual
  // const handleNotifClick = () => {
  //   setNotifMenuOpen((open) => !open);
  //   markAllAsRead();
  // };

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
            <li><Link to="/courses">Cursos</Link></li>
            {user?.role === 'company' && (
              <li>
                <div
                  className="dropdown-menu-wrapper"
                  style={{ position: 'relative', display: 'inline-block' }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
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
                    <Link to="/companies" onClick={() => setDropdownOpen(false)}>Panel de empresas</Link>
                    <Link to="/companies?tab=applications" onClick={() => setDropdownOpen(false)}>Panel de solicitudes</Link>
                    {user?.role === 'company' && (
                      <Link to="/companies?tab=users" onClick={() => setDropdownOpen(false)}>
                        Panel de usuarios
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            )}
            <li><Link to="/pricing">Precios</Link></li>
            <li><Link to="/about">Acerca de</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {isAuthenticated() ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div
                className="user-menu-wrapper"
                ref={userMenuRef}
                tabIndex={0}
                style={{ display: 'inline-block', position: 'relative', marginRight: '12px' }}
              >
                <span
                  className="user-dropdown-trigger"
                  tabIndex={0}
                  style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setUserMenuOpen((open) => !open);
                    setNotifMenuOpen(false);
                  }}
                >
                  {user?.name}
                </span>
                {userMenuOpen && (
                  <div className="user-dropdown-menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999 }}>
                    <Link to="/account"><span>Página de la cuenta</span></Link>
                    <Link to={user?.role === 'company' ? "/company/edit" : "/account/edit"}><span>Editar cuenta</span></Link>
                    <button onClick={handleLogout} className="btn-logout-dropdown"><span>Cerrar sesión</span></button>
                  </div>
                )}
              </div>
              <div
                className="notif-menu-wrapper"
                tabIndex={0}
                style={{ display: 'inline-block', position: 'relative' }}
              >
                <span
                  className={`notification-btn${notifAnim ? ' notif-anim' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 0, display: 'flex', alignItems: 'center', position: 'relative' }}
                  aria-label="Notificaciones"
                  onClick={() => {
                    setNotifMenuOpen((open) => !open);
                    setUserMenuOpen(false);
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M18 16v-5c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1 1v1h14v-1l-1-1zm-6 6c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2z"/>
                  </svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#e53935',
                      color: '#fff',
                      borderRadius: '50%',
                      minWidth: 18,
                      height: 18,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      boxShadow: '0 0 0 2px #fff',
                      zIndex: 2
                    }}>
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </span>
                {notifMenuOpen && (
                  <div className="notif-dropdown-menu" style={{ right: 0, left: 'auto', minWidth: 260, top: 'calc(100% + 8px)', position: 'absolute', zIndex: 10000 }}>
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No tienes notificaciones.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item${!n.read ? ' notif-unread' : ''}`}
                          style={{ background: !n.read ? '#eaf3ff' : 'transparent', fontWeight: !n.read ? 'bold' : 'normal' }}>
                          <span>{n.message}</span>
                          <button className="notif-delete-btn" onClick={() => handleDeleteNotif(n.id)} title="Eliminar notificación">×</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button 
                className="btn-login" 
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
              >
                Iniciar sesión
              </button>
              <button 
                className="btn-register" 
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
              >
                Registrarse
              </button>
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
                    style={{ fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', marginBottom: '18px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen((open) => !open);
                    }}
                  >
                    {user?.name}
                  </span>
                  {userMenuOpen && (
                    <div className="user-dropdown-menu" style={{ position: 'static', background: 'none', boxShadow: 'none', minWidth: 'unset', margin: 0, padding: 0 }}>
                      <Link to="/account" onClick={() => { setMobileMenuOpen(false); setUserMenuOpen(false); }}><span>Ver perfil</span></Link>
                      <Link to={user?.role === 'company' ? "/company/edit" : "/account/edit"} onClick={() => { setMobileMenuOpen(false); setUserMenuOpen(false); }}><span>Editar perfil</span></Link>
                      <button onClick={(e) => { e.preventDefault(); handleLogout(); setMobileMenuOpen(false); setUserMenuOpen(false); }} className="btn-logout-dropdown"><span>Cerrar sesión</span></button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mobile-auth-buttons" style={{ marginBottom: 16 }}>
                  <button 
                    className="btn-login" 
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Iniciar sesión
                  </button>
                  <button 
                    className="btn-register" 
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
            <nav className="mobile-nav-menu">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Empleos</Link></li>
                <li><Link to="/courses">Cursos</Link></li>
                {user?.role === 'company' && (
                  <li>
                    <div
                      className="dropdown-menu-wrapper"
                      style={{ position: 'relative', display: 'block', width: '100%' }}
                      onClick={() => setMobileDropdownOpen(open => !open)}
                      tabIndex={0}
                    >
                      <span
                        className="dropdown-toggle-label"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                      >
                        Empresas
                      </span>
                      <div className="dropdown-menu-content" style={{ display: mobileDropdownOpen ? 'block' : 'none', position: 'static', background: 'none', boxShadow: 'none', padding: '0', marginTop: '0' }}>
                        <Link to="/companies" onClick={() => { setMobileDropdownOpen(false); setMobileMenuOpen(false); }}>Panel de empresas</Link>
                        <Link to="/companies?tab=applications" onClick={() => { setMobileDropdownOpen(false); setMobileMenuOpen(false); }}>Panel de solicitudes</Link>
                        {user?.role === 'company' && (
                          <Link to="/companies?tab=users" onClick={() => { setMobileDropdownOpen(false); setMobileMenuOpen(false); }}>
                            Panel de usuarios
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                )}
                <li><Link to="/pricing">Precios</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}

export default Header; 