import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './JobApplication.css';

function JobApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const job = location.state?.job;

  const [cvOption, setCvOption] = useState(null); // 'profile', 'web', null
  const [hasCvData, setHasCvData] = useState(false);
  
  const [form, setForm] = useState({
    cover_letter: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Verificar si el usuario tiene al menos un CV (cargado o web)
  const hasAnyCv = (user?.cv || hasCvData);

  // Establecer cvOption por defecto cuando se carguen los datos
  useEffect(() => {
    if (user?.cv && !cvOption) {
      setCvOption('profile');
    } else if (hasCvData && !user?.cv && !cvOption) {
      setCvOption('web');
    }
  }, [user?.cv, hasCvData, cvOption]);

  useEffect(() => {
    const checkCvData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_CV_DATA_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setHasCvData(true);
      } catch (e) {}
    };
    checkCvData();
  }, []);

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      const token = localStorage.getItem('token');
      if (!token || !job) return;
      try {
        const response = await fetch(`${API_ENDPOINTS.USER_APPLICATIONS}?job_id=${job.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setAlreadyApplied(true);
          }
        }
      } catch (e) {}
    };
    checkAlreadyApplied();
  }, [job]);

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validar que tenga al menos un CV
    if (!hasAnyCv) {
      setError('Debes tener al menos un CV configurado (CV cargado o CV web) para enviar una aplicación.');
      setLoading(false);
      return;
    }

    // Validar que haya seleccionado una opción de CV válida
    if (!user?.cv && cvOption === 'profile') {
      setError('No tienes un CV cargado. Por favor, selecciona tu CV web o sube un CV en tu perfil.');
      setLoading(false);
      return;
    }

    if (!hasCvData && cvOption === 'web') {
      setError('No tienes un CV web configurado. Por favor, crea tu CV web o sube un CV en tu perfil.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('job_id', job.id);
      formData.append('cover_letter', form.cover_letter);
      formData.append('experience', form.experience);
      formData.append('cv_option', cvOption);

      const response = await fetch(API_ENDPOINTS.APPLICATIONS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || data.errors || 'Error al enviar la postulación.');
      }
    } catch (err) {
      console.error('Error al enviar aplicación:', err);
      setError('Error de conexión. Por favor, verifica tu conexión a internet.');
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
            <h3>¡Aplicación enviada!</h3>
            <p>Tu postulación ha sido enviada correctamente.</p>
            <p>Redirigiendo a la página de empleos...</p>
          </div>
        ) : alreadyApplied ? (
          <div className="error-message">
            Ya has enviado una postulación para este trabajo.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="cover_letter">Carta de presentación</label>
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
              <label htmlFor="experience">Experiencia relevante</label>
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
            <div className="form-group">
              <label>Selecciona tu CV</label>
              <div className="cv-selection-options">
                {user?.cv && (
                  <label className="cv-option">
                    <input
                      type="radio"
                      name="cvOption"
                      value="profile"
                      checked={cvOption === 'profile'}
                      onChange={() => setCvOption('profile')}
                    />
                    <span className="cv-option-label">
                      Usar CV actual
                    </span>
                  </label>
                )}

                {hasCvData && (
                  <label className="cv-option">
                    <input
                      type="radio"
                      name="cvOption"
                      value="web"
                      checked={cvOption === 'web'}
                      onChange={() => setCvOption('web')}
                    />
                    <span className="cv-option-label">
                      Usar mi CV web
                    </span>
                  </label>
                )}

                {!user?.cv && !hasCvData && (
                  <p className="input-hint" style={{ color: '#e53e3e' }}>
                    No tienes ningún CV configurado. Por favor, sube uno en tu perfil o crea tu CV Web.
                  </p>
                )}
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/jobs')} className="btn-secondary">
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading || alreadyApplied || !hasAnyCv}
                title={!hasAnyCv ? 'Debes tener al menos un CV configurado para enviar una aplicación' : ''}
              >
                {loading ? 'Enviando...' : 'Enviar aplicación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default JobApplication; 