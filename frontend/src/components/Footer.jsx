import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/imagenes/logo.png" alt="JobBridge Logo" className="footer-logo-img" />
            </div>
            <p>Conectando talento con oportunidades desde 2025.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/jobs" className="footer-link">Empleos</Link></li>
              {user?.role === 'company' && (
                <li><Link to="/companies" className="footer-link">Empresas</Link></li>
              )}
              <li><Link to="/about" className="footer-link">Acerca de</Link></li>
              <li><Link to="/contact" className="footer-link">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul className="footer-contact">
              <li>
                <a href="mailto:info@jobbridge.com" className="footer-contact-link">
                  info@jobbridge.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="footer-contact-link">
                  +1 (555) 123-4567
                </a>
              </li>
              <li>Alicante, Monóvar</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobBridge. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

