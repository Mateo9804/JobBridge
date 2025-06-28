import React, { useState } from 'react';
import Header from './Header';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simular envío de formulario (en una app real, aquí iría la llamada a la API)
    setTimeout(() => {
      setLoading(false);
      setSuccess('¡Mensaje enviado exitosamente! Te responderemos pronto.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    }, 2000);
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-container">
        <div className="contact-hero">
          <h1>Contacto</h1>
          <p className="hero-subtitle">¿Tienes alguna pregunta? ¡Nos encantaría escucharte!</p>
        </div>

        <div className="contact-content">
          <div className="contact-grid">
            {/* Información de Contacto */}
            <div className="contact-info-section">
              <h2>Información de Contacto</h2>
              <p>Estamos aquí para ayudarte. No dudes en contactarnos por cualquier consulta.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">
                    <h4>Email</h4>
                    <p>info@jobbridge.com</p>
                    <p>soporte@jobbridge.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div className="contact-text">
                    <h4>Teléfono</h4>
                    <p>+34 91 123 45 67</p>
                    <p>Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <h4>Oficina</h4>
                    <p>Calle Gran Vía, 28</p>
                    <p>28013 Madrid, España</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div className="contact-text">
                    <h4>Redes Sociales</h4>
                    <div className="social-links">
                      <a href="#" className="social-link">LinkedIn</a>
                      <a href="#" className="social-link">Twitter</a>
                      <a href="#" className="social-link">Facebook</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Empresas Registradas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2000+</div>
                  <div className="stat-label">Ofertas Publicadas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10000+</div>
                  <div className="stat-label">Profesionales</div>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="contact-form-section">
              <h2>Envíanos un Mensaje</h2>
              <p>Completa el formulario y te responderemos lo antes posible.</p>

              {success && (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <p>{success}</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠</div>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="general">Consulta General</option>
                    <option value="support">Soporte Técnico</option>
                    <option value="business">Oportunidad de Negocio</option>
                    <option value="partnership">Colaboración</option>
                    <option value="feedback">Sugerencias</option>
                    <option value="bug">Reportar un Problema</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows="6"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Preguntas Frecuentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>¿Cómo puedo publicar una oferta de trabajo?</h4>
                <p>Regístrate como empresa, inicia sesión y usa el botón "Crear Nueva Oferta" en el panel de empresas.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Cuántas ofertas puedo publicar gratuitamente?</h4>
                <p>Puedes publicar hasta 2 ofertas de trabajo de forma gratuita. Para más ofertas, suscríbete a nuestro plan premium.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Cómo me registro en JobBridge?</h4>
                <p>Haz clic en "Registrarse" en el header y completa el formulario con tus datos. Puedes registrarte como usuario o empresa.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Es seguro usar JobBridge?</h4>
                <p>Sí, utilizamos las mejores prácticas de seguridad para proteger tus datos personales y empresariales.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Puedo editar o eliminar mis ofertas?</h4>
                <p>Sí, desde el panel de empresas puedes editar o eliminar tus ofertas de trabajo en cualquier momento.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Qué tecnologías soporta la plataforma?</h4>
                <p>Soportamos todas las tecnologías del sector IT: Frontend, Backend, Mobile, DevOps, Data Science, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 