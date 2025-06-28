import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inicia Sesión o Regístrate</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <p className="modal-message">
            Para aplicar a este trabajo, necesitas tener una cuenta. 
            ¿Ya tienes una cuenta o quieres crear una nueva?
          </p>
          
          <div className="modal-actions">
            <button 
              className="btn-login"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            
            <button 
              className="btn-register"
              onClick={handleRegister}
            >
              Registrarse
            </button>
          </div>
          
          <p className="modal-footer">
            Es gratis y solo toma unos minutos
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal; 