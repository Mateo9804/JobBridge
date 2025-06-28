import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import './JobApplication.css';

function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    coverLetter: '',
    experience: '',
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Datos del trabajo (en una app real, esto vendría de una API)
  const jobData = {
    1: { title: 'Desarrollador Frontend React', company: 'TechCorp' },
    2: { title: 'Desarrollador Backend Python', company: 'StartupXYZ' },
    3: { title: 'Full Stack Developer', company: 'Digital Solutions' },
    4: { title: 'Desarrollador Mobile React Native', company: 'AppStudio' },
    5: { title: 'DevOps Engineer', company: 'CloudTech' },
    6: { title: 'Data Scientist', company: 'Analytics Pro' },
    7: { title: 'Desarrollador Java Spring', company: 'Enterprise Solutions' },
    8: { title: 'Desarrollador Angular', company: 'WebTech' }
  };

  const job = jobData[jobId];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // Simular envío exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/jobs');
      }, 3000);
    } catch (err) {
      setError('Error al enviar la aplicación. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="application-page">
        <Header />
        <div className="application-container">
          <h2>Trabajo no encontrado</h2>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Volver a Empleos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-page">
      <Header />
      
      <div className="application-container">
        <div className="application-header">
          <h1>Aplicar al Trabajo</h1>
          <div className="job-info">
            <h2>{job.title}</h2>
            <p>Empresa: {job.company}</p>
          </div>
        </div>

        {success ? (
          <div className="success-message">
            <h3>¡Aplicación Enviada!</h3>
            <p>Tu aplicación ha sido enviada exitosamente. Te contactaremos pronto.</p>
            <p>Redirigiendo a la página de empleos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="coverLetter">Carta de Presentación *</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Cuéntanos por qué eres el candidato ideal para este puesto..."
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Experiencia Relevante *</label>
              <textarea
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Describe tu experiencia en tecnologías relacionadas..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio (URL)</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                placeholder="https://tu-portfolio.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn (URL)</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>

            <div className="form-group">
              <label htmlFor="github">GitHub (URL)</label>
              <input
                type="url"
                id="github"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/tu-usuario"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/jobs')}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Aplicación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default JobApplication; 