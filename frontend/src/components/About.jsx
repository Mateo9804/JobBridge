import React, { useEffect } from 'react';
import Header from './Header';
import './About.css';

const MaterialIcon = ({ name, color = '#007AFF', size = 24, className = '' }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={{ color, fontSize: size, verticalAlign: 'middle' }}
  >
    {name}
  </span>
);

function About(props) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
            <h2>Nuestra misión</h2>
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <MaterialIcon name="target" color="#007AFF" size={48} />
                </div>
                <h3>Conectar</h3>
                <p>Facilitar la conexión entre empresas y profesionales del sector tecnológico</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <MaterialIcon name="lightbulb" color="#007AFF" size={48} />
                </div>
                <h3>Innovar</h3>
                <p>Utilizar tecnología avanzada para mejorar el proceso de contratación</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <MaterialIcon name="rocket_launch" color="#007AFF" size={48} />
                </div>
                <h3>Crecer</h3>
                <p>Ayudar a las empresas y profesionales a alcanzar su máximo potencial</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>¿Por qué JobBridge?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="palette" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Interfaz intuitiva
                </h4>
                <p>Diseño moderno y fácil de usar que hace que publicar y buscar empleos sea sencillo</p>
              </div>
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="search" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Búsqueda avanzada
                </h4>
                <p>Filtros por categoría, experiencia, ubicación y tipo de trabajo</p>
              </div>
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="work" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Gestión de Empresas
                </h4>
                <p>Panel completo para que las empresas gestionen sus ofertas de trabajo</p>
              </div>
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="smartphone" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Responsive
                </h4>
                <p>Funciona perfectamente en dispositivos móviles, tablets y computadoras</p>
              </div>
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="bolt" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Proceso rápido
                </h4>
                <p>Crear ofertas de trabajo en minutos con nuestro sistema de formularios inteligente</p>
              </div>
              <div className="feature-item">
                <h4>
                  <MaterialIcon name="lock" color="#007AFF" size={20} style={{ marginRight: '8px' }} />
                  Seguro y confiable
                </h4>
                <p>Plataforma segura con validaciones y protección de datos</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Nuestros valores</h2>
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
              <div className="value-card">
                <h4>Confianza</h4>
                <p>Protegemos tus datos y aseguramos relaciones basadas en la fiabilidad</p>
              </div>
              <div className="value-card">
                <h4>Sostenibilidad</h4>
                <p>Impulsamos un crecimiento responsable con impacto positivo en la comunidad</p>
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
                  <span className="contact-icon">
                    <MaterialIcon name="email" color="#007AFF" size={24} />
                  </span>
                  <span>info@jobbridge.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">
                    <MaterialIcon name="language" color="#007AFF" size={24} />
                  </span>
                  <span>www.jobbridge.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">
                    <MaterialIcon name="location_on" color="#007AFF" size={24} />
                  </span>
                  <span>Alicante, Monóvar</span>
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