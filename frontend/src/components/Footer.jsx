import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JobBridge</h3>
            <p>Conectando talento con oportunidades desde 2024.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/jobs" className="footer-link">Empleos</Link></li>
              <li><Link to="/companies" className="footer-link">Empresas</Link></li>
              <li><Link to="/about" className="footer-link">Acerca de</Link></li>
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

