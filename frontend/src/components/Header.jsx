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
            <li><Link to="/companies">Empresas</Link></li>
            <li><Link to="/pricing">Precios</Link></li>
            <li><Link to="/about">Acerca de</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {isAuthenticated() ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="user-name user-menu-btn" onClick={() => setUserMenuOpen((open) => !open)}>
                  Hola, {user?.name}
                </button>
                <div ref={notifMenuRef} style={{ position: 'relative' }}>
                  <button
                    className={`notification-btn${notifAnim ? ' notif-anim' : ''}${notifClickAnim ? ' notif-bounce-click' : ''}`}
                    title="Notificaciones"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', position: 'relative' }}
                    onClick={handleNotifClick}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#fff"/>
                    </svg>
                    {notifications.some(n => !n.read) && (
                      <span style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, background: '#e53935', borderRadius: '50%', border: '2px solid #fff' }}></span>
                    )}
                  </button>
                  {notifMenuOpen && (
                    <div className="notif-dropdown-menu">
                      <h4 style={{ margin: '8px 0 12px 0', fontWeight: 700, fontSize: '1rem', textAlign: 'center' }}>Notificaciones</h4>
                      {notifications.length === 0 ? (
                        <div className="notif-empty">Sin notificaciones por el momento</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="notif-item">
                            <span>{n.message}</span>
                            <button className="notif-delete-btn" onClick={() => handleDeleteNotif(n.id)} title="Borrar notificación">×</button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="user-name user-menu-btn" onClick={() => setUserMenuOpen((open) => !open)}>
                      Hola, {user?.name}
                    </button>
                    <div ref={notifMenuRef} style={{ position: 'relative' }}>
                      <button
                        className={`notification-btn${notifAnim ? ' notif-anim' : ''}${notifClickAnim ? ' notif-bounce-click' : ''}`}
                        title="Notificaciones"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', position: 'relative' }}
                        onClick={handleNotifClick}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#fff"/>
                        </svg>
                        {notifications.some(n => !n.read) && (
                          <span style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, background: '#e53935', borderRadius: '50%', border: '2px solid #fff' }}></span>
                        )}
                      </button>
                      {notifMenuOpen && (
                        <div className="notif-dropdown-menu">
                          <h4 style={{ margin: '8px 0 12px 0', fontWeight: 700, fontSize: '1rem', textAlign: 'center' }}>Notificaciones</h4>
                          {notifications.length === 0 ? (
                            <div className="notif-empty">Sin notificaciones por el momento</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className="notif-item">
                                <span>{n.message}</span>
                                <button className="notif-delete-btn" onClick={() => handleDeleteNotif(n.id)} title="Borrar notificación">×</button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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