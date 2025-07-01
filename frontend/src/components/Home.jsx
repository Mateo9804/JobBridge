import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Encuentra tu trabajo ideal</h1>
          <p>Conectamos talento con oportunidades. JobBridge es la plataforma que une profesionales con las mejores empresas.</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="home-btn-primary">Buscar Empleos</Link>
            <Link to="/register" className="home-btn-secondary">Crear Perfil</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>¿Por qué elegir JobBridge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Empleos Personalizados</h3>
              <p>Encuentra ofertas que se adapten a tu perfil y experiencia profesional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Empresas Verificadas</h3>
              <p>Trabaja con empresas confiables y reconocidas en el mercado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Proceso Rápido</h3>
              <p>Aplica a múltiples empleos con un solo clic y recibe respuestas rápidas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>¿Listo para dar el siguiente paso?</h2>
          <p>Únete a miles de profesionales que ya encontraron su trabajo ideal en JobBridge.</p>
          <Link to="/register" className="btn-primary">Empezar Ahora</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>JobBridge</h3>
              <p>Conectando talento con oportunidades desde 2024.</p>
            </div>
            <div className="footer-section">
              <h4>Enlaces</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Empleos</Link></li>
                <li><Link to="/companies">Empresas</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <ul>
                <li>info@jobbridge.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Ciudad, País</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 JobBridge. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 