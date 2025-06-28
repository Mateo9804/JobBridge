import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import './Companies.css';

function Companies() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    category: '',
    experience: '',
    salaryMin: 20000,
    salaryMax: 50000,
    description: '',
    skills: '',
    type: 'Presencial'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Cargar trabajos al montar el componente
  useEffect(() => {
    if (isAuthenticated && user?.role === 'company') {
      fetchJobs();
      // Establecer el nombre de la empresa en el formulario
      setForm(prev => ({
        ...prev,
        company: user?.company_name || user?.name || ''
      }));
    }
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost/api/company/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Empleos de ejemplo (en una app real vendrían de la API)
  const [companyJobs] = useState([
    {
      id: 1,
      title: 'Desarrollador Frontend React',
      location: 'Madrid, España',
      category: 'frontend',
      experience: 'junior',
      salary: '€25,000 - €35,000',
      description: 'Buscamos un desarrollador Frontend con experiencia en React.',
      skills: ['React', 'JavaScript', 'CSS', 'HTML'],
      type: 'Remoto',
      posted: 'Hace 2 días',
      status: 'activo'
    }
  ]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación adicional antes de enviar
    if (form.salaryMin > form.salaryMax) {
      setError('El salario mínimo no puede ser mayor que el máximo');
      return;
    }
    
    setLoading(true);

    // Convertir skills a array antes de enviar
    const formToSend = {
      ...form,
      skills: form.skills
        ? form.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };

    console.log('Datos a enviar:', formToSend);

    try {
      const response = await fetch('http://localhost/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
      });

      if (response.ok) {
        setSuccess(true);
        setShowCreateForm(false);
        fetchJobs();
        setTimeout(() => {
          setSuccess(false);
          setForm({
            title: '', company: '', location: '', category: '', experience: '',
            salaryMin: 20000, salaryMax: 50000, description: '', skills: '', type: 'Presencial'
          });
        }, 3000);
      }
    } catch (err) {
      setError('Error al crear el empleo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validar que el salario máximo no sea menor que el mínimo
    if (name === 'salaryMin' && parseInt(value) > form.salaryMax) {
      setError('El salario mínimo no puede ser mayor que el máximo');
    } else if (name === 'salaryMax' && parseInt(value) < form.salaryMin) {
      setError('El salario máximo no puede ser menor que el mínimo');
    } else {
      setError('');
    }
  };

  // Si no está autenticado, mostrar modal de autenticación
  if (!isAuthenticated()) {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <div className="auth-required">
            <h2>Acceso Requerido</h2>
            <p>Para acceder a la sección de empresas, necesitas iniciar sesión o registrarte.</p>
            <div className="auth-buttons">
              <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Iniciar Sesión o Registrarse
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  // Si es usuario (no empresa), mostrar mensaje de acceso denegado
  if (user?.role === 'user') {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <div className="access-denied">
            <h2>Acceso Restringido</h2>
            <p>Esta sección es exclusiva para empresas. Solo las empresas pueden crear y gestionar ofertas de trabajo.</p>
            <div className="access-buttons">
              <button onClick={() => navigate('/jobs')} className="btn-primary">
                Ver Ofertas de Trabajo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si es empresa, mostrar panel de gestión
  return (
    <div className="companies-page">
      <Header />
      <div className="companies-container">
        <div className="companies-header">
          <h1>Panel de Empresa</h1>
          <p>Gestiona tus ofertas de trabajo</p>
        </div>

        {success && (
          <div className="success-message">
            <h3>¡Empleo Creado!</h3>
            <p>Tu oferta de trabajo ha sido publicada exitosamente.</p>
          </div>
        )}

        <div className="companies-content">
          <div className="companies-actions">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn-create-job"
            >
              + Crear Nueva Oferta
            </button>
          </div>

          <div className="companies-jobs">
            <h3>Tus Ofertas de Trabajo ({jobs.length})</h3>
            
            {jobs.length === 0 ? (
              <div className="no-jobs">
                <p>No tienes ofertas de trabajo publicadas.</p>
                <p>Crea tu primera oferta para empezar a recibir candidatos.</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <h4>{job.title}</h4>
                      <span className="job-status active">
                        Activo
                      </span>
                    </div>
                    <div className="job-details">
                      <p><strong>Ubicación:</strong> {job.location}</p>
                      <p><strong>Salario:</strong> €{job.salary_min?.toLocaleString()} - €{job.salary_max?.toLocaleString()}</p>
                      <p><strong>Tipo:</strong> {job.type}</p>
                      <p><strong>Categoría:</strong> {job.category}</p>
                      <p><strong>Experiencia:</strong> {job.experience}</p>
                    </div>
                    <div className="job-actions">
                      <button className="btn-edit">Editar</button>
                      <button className="btn-delete">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal para crear empleo */}
        {showCreateForm && (
          <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Crear Nueva Oferta de Trabajo</h2>
                <button className="modal-close" onClick={() => setShowCreateForm(false)}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateJob} className="create-job-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Título del Puesto *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Empresa *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      disabled={true}
                      className="disabled-input"
                    />
                    <small className="form-help">El nombre de la empresa no se puede modificar</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Ubicación *</label>
                    <select
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona una ciudad</option>
                      <option value="Madrid, España">Madrid</option>
                      <option value="Barcelona, España">Barcelona</option>
                      <option value="Valencia, España">Valencia</option>
                      <option value="Sevilla, España">Sevilla</option>
                      <option value="Bilbao, España">Bilbao</option>
                      <option value="Málaga, España">Málaga</option>
                      <option value="Zaragoza, España">Zaragoza</option>
                      <option value="Alicante, España">Alicante</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="type">Tipo de Trabajo *</label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Categoría *</label>
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="fullstack">Full Stack</option>
                      <option value="mobile">Mobile</option>
                      <option value="devops">DevOps</option>
                      <option value="data">Data Science</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Experiencia *</label>
                    <select
                      id="experience"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona experiencia</option>
                      <option value="junior">Junior (0-2 años)</option>
                      <option value="mid">Mid (2-5 años)</option>
                      <option value="senior">Senior (5+ años)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Rango de Salario (€) *</label>
                  <div className="salary-range">
                    <div className="salary-inputs">
                      <div className="salary-input">
                        <label htmlFor="salaryMin">Mínimo</label>
                        <input
                          type="number"
                          id="salaryMin"
                          name="salaryMin"
                          value={form.salaryMin}
                          onChange={handleChange}
                          min="15000"
                          max="100000"
                          step="1000"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="salary-input">
                        <label htmlFor="salaryMax">Máximo</label>
                        <input
                          type="number"
                          id="salaryMax"
                          name="salaryMax"
                          value={form.salaryMax}
                          onChange={handleChange}
                          min="15000"
                          max="100000"
                          step="1000"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="salary-display">
                      <span>€{form.salaryMin.toLocaleString()} - €{form.salaryMax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción del Puesto *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe las responsabilidades y requisitos del puesto..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Habilidades Requeridas *</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Ej: React, JavaScript, CSS, HTML"
                    required
                    disabled={loading}
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Crear Oferta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies; 