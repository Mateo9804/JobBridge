import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Contact.css';

const MaterialIcon = ({ name, color = '#007AFF', size = 24, className = '' }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={{ color, fontSize: size, verticalAlign: 'middle' }}
  >
    {name}
  </span>
);

function Contact(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'message' && value.length > 500) {
      return;
    }
    
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

    setTimeout(() => {
      setLoading(false);
      setSuccess('¡Mensaje enviado exitosamente! Te responderemos pronto.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
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
              <h2>Información de contacto</h2>
              <p>Estamos aquí para ayudarte. No dudes en contactarnos por cualquier consulta.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <MaterialIcon name="email" color="#007AFF" size={32} />
                  </div>
                  <div className="contact-text">
                    <h4>Email</h4>
                    <p>info@jobbridge.com</p>
                    <p>soporte@jobbridge.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <MaterialIcon name="phone" color="#007AFF" size={32} />
                  </div>
                  <div className="contact-text">
                    <h4>Teléfono</h4>
                    <p>+34 91 123 45 67</p>
                    <p>Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <MaterialIcon name="location_on" color="#007AFF" size={32} />
                  </div>
                  <div className="contact-text">
                    <h4>Oficina</h4>
                    <p>03640 Alicante, Monóvar</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <MaterialIcon name="language" color="#007AFF" size={32} />
                  </div>
                  <div className="contact-text">
                    <h4>Redes sociales</h4>
                    <div className="social-links">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                      <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Empresas registradas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2000+</div>
                  <div className="stat-label">Ofertas publicadas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10000+</div>
                  <div className="stat-label">Profesionales</div>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2>
                  ¡Hablemos!
                </h2>
                <p>Cuéntanos qué tienes en mente. Estamos aquí para ayudarte y responder todas tus dudas.</p>
              </div>

              {success && (
                <div className="success-message">
                  <div className="success-icon">
                    <MaterialIcon name="celebration" color="#00C897" size={32} />
                  </div>
                  <div>
                    <p className="success-title">¡Genial! Tu mensaje está en camino</p>
                    <p className="success-subtitle">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">
                    <MaterialIcon name="sentiment_dissatisfied" color="#E74C3C" size={32} />
                  </div>
                  <div>
                    <p className="error-title">Ups, algo salió mal</p>
                    <p className="error-subtitle">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group floating-label">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder=" "
                    className="form-input"
                  />
                  <label htmlFor="name" className="form-label">
                    <span className="label-icon">
                      <MaterialIcon name="waving_hand" color="#007AFF" size={20} />
                    </span> ¿Cómo te llamamos?
                  </label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group floating-label">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder=" "
                    className="form-input"
                  />
                  <label htmlFor="email" className="form-label">
                    <span className="label-icon">
                      <MaterialIcon name="mail" color="#007AFF" size={20} />
                    </span> Tu email (para responderte)
                  </label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group floating-label">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-input"
                  >
                    <option value="" disabled hidden> </option>
                    <option value="general">Tengo una pregunta general</option>
                    <option value="support">Necesito ayuda técnica</option>
                    <option value="business">Quiero hablar de negocios</option>
                    <option value="partnership">Me interesa colaborar</option>
                    <option value="feedback">Tengo una sugerencia</option>
                    <option value="bug">Encontré un problema</option>
                    <option value="other">Algo más que quieras contarnos</option>
                  </select>
                  <label htmlFor="subject" className={`form-label ${formData.subject ? 'label-active' : ''}`}>
                    <span className="label-icon">
                      <MaterialIcon name="description" color="#007AFF" size={20} />
                    </span> ¿De qué quieres hablar?
                  </label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group floating-label textarea-group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows="6"
                    placeholder=" "
                    className="form-input"
                  />
                  <label htmlFor="message" className="form-label">
                    <span className="label-icon">
                      <MaterialIcon name="edit" color="#007AFF" size={20} />
                    </span> Cuéntanos todo con detalle...
                  </label>
                  <div className="input-underline"></div>
                  <div className="char-counter">
                    {formData.message.length} / 500
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-loader"></span>
                      <span>Enviando tu mensaje...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar mensaje</span>
                    </>
                  )}
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
                <p>Regístrate como empresa, inicia sesión y usa el botón "Crear nueva oferta" en el panel de empresas.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Cuántas ofertas puedo publicar gratuitamente?</h4>
                <p>Puedes publicar hasta 2 ofertas de trabajo de forma gratuita. La opción para publicar más ofertas (plan profesional) todavía no está disponible.</p>
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