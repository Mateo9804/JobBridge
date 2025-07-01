import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './JobApplication.css';

function JobApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const job = location.state?.job;

  const [form, setForm] = useState({
    cover_letter: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.APPLICATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: job.id,
          cover_letter: form.cover_letter,
          experience: form.experience,
        }),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al enviar la postulación.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      <Header />
      <div className="application-container">
        <div className="application-header">
          <h1>Aplicar al Trabajo</h1>
          <div className="job-info">
            <h2>{job.title}</h2>
            <p>Empresa: {job.company}</p>
            <p>Ubicación: {job.location}</p>
          </div>
        </div>
        {success ? (
          <div className="success-message">
            <h3>¡Aplicación Enviada!</h3>
            <p>Tu postulación ha sido enviada correctamente.</p>
            <p>Redirigiendo a la página de empleos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="cover_letter">Carta de Presentación *</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={form.cover_letter}
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
                placeholder="Describe tu experiencia relevante para este puesto..."
                rows="4"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/jobs')} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
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