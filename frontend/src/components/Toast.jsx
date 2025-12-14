import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ message, isOpen, onClose, type = 'success' }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="toast-overlay" onClick={onClose}>
      <div className="toast-container" onClick={(e) => e.stopPropagation()}>
        <div className="toast-header">
          <span className="toast-title">{window.location.hostname} dice</span>
        </div>
        <div className="toast-body">
          <p className="toast-message">{message}</p>
        </div>
        <div className="toast-footer">
          <button className="toast-button" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;

