import React from 'react';
import Header from './Header';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <Header />
      <div className="about-container">
        <div className="about-hero">
          <h1>Acerca de JobBridge</h1>
          <p className="hero-subtitle">Conectando talento con oportunidades</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>¿Qué es JobBridge?</h2>
            <p>
              JobBridge es una plataforma innovadora diseñada para conectar empresas con profesionales 
              del sector tecnológico. Nuestra misión es simplificar el proceso de contratación y 
              facilitar que las empresas encuentren el talento que necesitan, mientras que los 
              profesionales descubran oportunidades que se alinean con sus habilidades y aspiraciones.
            </p>
          </section>

          <section className="about-section">
            <h2>Nuestra Misión</h2>
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">🎯</div>
                <h3>Conectar</h3>
                <p>Facilitar la conexión entre empresas y profesionales del sector tecnológico</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">💡</div>
                <h3>Innovar</h3>
                <p>Utilizar tecnología avanzada para mejorar el proceso de contratación</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">🚀</div>
                <h3>Crecer</h3>
                <p>Ayudar a las empresas y profesionales a alcanzar su máximo potencial</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>¿Por qué JobBridge?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h4>🎨 Interfaz Intuitiva</h4>
                <p>Diseño moderno y fácil de usar que hace que publicar y buscar empleos sea sencillo</p>
              </div>
              <div className="feature-item">
                <h4>🔍 Búsqueda Avanzada</h4>
                <p>Filtros por categoría, experiencia, ubicación y tipo de trabajo</p>
              </div>
              <div className="feature-item">
                <h4>💼 Gestión de Empresas</h4>
                <p>Panel completo para que las empresas gestionen sus ofertas de trabajo</p>
              </div>
              <div className="feature-item">
                <h4>📱 Responsive</h4>
                <p>Funciona perfectamente en dispositivos móviles, tablets y computadoras</p>
              </div>
              <div className="feature-item">
                <h4>⚡ Proceso Rápido</h4>
                <p>Crear ofertas de trabajo en minutos con nuestro sistema de formularios inteligente</p>
              </div>
              <div className="feature-item">
                <h4>🔒 Seguro y Confiable</h4>
                <p>Plataforma segura con validaciones y protección de datos</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-card">
                <h4>Transparencia</h4>
                <p>Procesos claros y honestos en todas nuestras interacciones</p>
              </div>
              <div className="value-card">
                <h4>Innovación</h4>
                <p>Constante mejora y adopción de nuevas tecnologías</p>
              </div>
              <div className="value-card">
                <h4>Excelencia</h4>
                <p>Compromiso con la calidad en cada aspecto de nuestra plataforma</p>
              </div>
              <div className="value-card">
                <h4>Colaboración</h4>
                <p>Fomentamos la colaboración entre empresas y profesionales</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Tecnologías Utilizadas</h2>
            <div className="tech-stack">
              <div className="tech-category">
                <h4>Frontend</h4>
                <div className="tech-tags">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">CSS3</span>
                  <span className="tech-tag">HTML5</span>
                </div>
              </div>
              <div className="tech-category">
                <h4>Backend</h4>
                <div className="tech-tags">
                  <span className="tech-tag">Laravel</span>
                  <span className="tech-tag">PHP</span>
                  <span className="tech-tag">MySQL</span>
                  <span className="tech-tag">REST API</span>
                </div>
              </div>
              <div className="tech-category">
                <h4>Herramientas</h4>
                <div className="tech-tags">
                  <span className="tech-tag">Git</span>
                  <span className="tech-tag">XAMPP</span>
                  <span className="tech-tag">npm</span>
                  <span className="tech-tag">Composer</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Plan de Desarrollo</h2>
            <div className="roadmap">
              <div className="roadmap-item completed">
                <div className="roadmap-marker">✓</div>
                <div className="roadmap-content">
                  <h4>Fase 1: MVP</h4>
                  <p>Plataforma básica con registro, login, creación y visualización de ofertas</p>
                </div>
              </div>
              <div className="roadmap-item current">
                <div className="roadmap-marker">🔄</div>
                <div className="roadmap-content">
                  <h4>Fase 2: Mejoras UX</h4>
                  <p>Sistema de tags, desplegables, modales personalizados y optimizaciones</p>
                </div>
              </div>
              <div className="roadmap-item">
                <div className="roadmap-marker">⏳</div>
                <div className="roadmap-content">
                  <h4>Fase 3: Funcionalidades Avanzadas</h4>
                  <p>Sistema de aplicaciones, notificaciones, filtros avanzados y analytics</p>
                </div>
              </div>
              <div className="roadmap-item">
                <div className="roadmap-marker">⏳</div>
                <div className="roadmap-content">
                  <h4>Fase 4: Plan Premium</h4>
                  <p>Implementación del sistema de pagos y funcionalidades premium</p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Contacto</h2>
            <div className="contact-info">
              <p>
                ¿Tienes preguntas, sugerencias o quieres colaborar con JobBridge? 
                No dudes en contactarnos.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@jobbridge.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <span>www.jobbridge.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Madrid, España</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About; 