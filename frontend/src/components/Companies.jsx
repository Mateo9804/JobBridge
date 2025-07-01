import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthModal from './AuthModal';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Companies.css';

function Companies() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
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
  const [success, setSuccess] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();

  // Opciones predefinidas para títulos de puestos
  const jobTitles = [
    'Desarrollador Frontend',
    'Desarrollador Backend',
    'Desarrollador Full Stack',
    'Desarrollador Mobile',
    'Desarrollador React',
    'Desarrollador Angular',
    'Desarrollador Vue.js',
    'Desarrollador Node.js',
    'Desarrollador Python',
    'Desarrollador Java',
    'Desarrollador PHP',
    'Desarrollador .NET',
    'Desarrollador Ruby',
    'Desarrollador Go',
    'Desarrollador Rust',
    'Ingeniero de Software',
    'Arquitecto de Software',
    'DevOps Engineer',
    'Data Scientist',
    'Data Engineer',
    'Machine Learning Engineer',
    'QA Engineer',
    'Test Engineer',
    'Product Manager',
    'Scrum Master',
    'Tech Lead',
    'Team Lead',
    'Project Manager',
    'UX/UI Designer',
    'Diseñador Web',
    'Analista de Sistemas',
    'Administrador de Sistemas',
    'DBA (Database Administrator)',
    'Cloud Engineer',
    'Security Engineer',
    'Blockchain Developer',
    'Game Developer',
    'Embedded Developer',
    'iOS Developer',
    'Android Developer',
    'Flutter Developer',
    'React Native Developer'
  ];

  // Opciones predefinidas para skills/lenguajes
  const availableSkills = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
    'Node.js', 'Python', 'Java', 'PHP', 'C#', '.NET', 'Ruby', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Dart', 'Flutter', 'React Native', 'Xamarin',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Firebase',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jenkins', 'Travis CI',
    'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'PyTest',
    'REST API', 'GraphQL', 'SOAP', 'WebSocket', 'gRPC',
    'Redux', 'Vuex', 'MobX', 'Zustand', 'Context API',
    'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
    'Sass', 'Less', 'Stylus', 'Tailwind CSS', 'Bootstrap',
    'Express.js', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
    'Laravel', 'Symfony', 'CodeIgniter', 'WordPress', 'Drupal',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'Linux', 'Ubuntu', 'CentOS', 'Windows Server', 'macOS',
    'Nginx', 'Apache', 'IIS', 'HAProxy', 'Load Balancer',
    'Microservices', 'Monolith', 'Serverless', 'Event-Driven',
    'Agile', 'Scrum', 'Kanban', 'Waterfall', 'DevOps',
    'CI/CD', 'TDD', 'BDD', 'DDD', 'Clean Architecture'
  ];

  // Cargar trabajos al montar el componente
  useEffect(() => {
    if (isAuthenticated && user?.role === 'company') {
      fetchJobs();
    }
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(API_ENDPOINTS.COMPANY_JOBS, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Error fetching jobs:', response.status);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
      } else {
        console.error('Error fetching jobs:', error);
      }
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación adicional antes de enviar
    if (form.salaryMin > form.salaryMax) {
      setError('El salario mínimo no puede ser mayor que el máximo');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Debes seleccionar al menos una habilidad');
      return;
    }
    
    setLoading(true);

    // Convertir skills a array antes de enviar
    const formToSend = {
      ...form,
      company: user?.company_name || user?.name || '',
      skills: selectedSkills,
    };

    console.log('Datos a enviar:', formToSend);

    try {
      const response = await fetch(API_ENDPOINTS.JOBS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
      });

      if (response.ok) {
        setSuccess('¡Oferta creada exitosamente!');
        addNotification('¡Has publicado una nueva oferta de empleo!');
        setShowCreateForm(false);
        setSelectedSkills([]);
        fetchJobs();
        setTimeout(() => {
          setSuccess('');
          setForm({
            title: '', location: '', category: '', experience: '',
            salaryMin: 20000, salaryMax: 50000, description: '', skills: '', type: 'Presencial'
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        if (response.status === 403 && errorData.limit_reached) {
          setShowLimitModal(true);
        } else {
          setError(errorData.message || 'Error al crear la oferta');
        }
      }
    } catch (err) {
      setError('Error al crear el empleo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    
    // Procesar skills para el formulario de edición
    let jobSkills = [];
    if (Array.isArray(job.skills)) {
      jobSkills = job.skills;
    } else if (typeof job.skills === 'string') {
      jobSkills = job.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    setSelectedSkills(jobSkills);
    
    setForm({
      title: job.title,
      location: job.location,
      category: job.category,
      experience: job.experience,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      description: job.description,
      skills: jobSkills.join(', '),
      type: job.type
    });
    setShowEditForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.salaryMin > form.salaryMax) {
      setError('El salario mínimo no puede ser mayor que el máximo');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Debes seleccionar al menos una habilidad');
      return;
    }
    
    setLoading(true);

    const formToSend = {
      ...form,
      skills: selectedSkills,
    };

    try {
      const response = await fetch(`${API_ENDPOINTS.JOBS}/${editingJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
      });

      if (response.ok) {
        setSuccess('¡Oferta actualizada exitosamente!');
        setShowEditForm(false);
        setEditingJob(null);
        setSelectedSkills([]);
        fetchJobs();
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar la oferta');
      }
    } catch (err) {
      setError('Error al actualizar la oferta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    // Set individual loading state
    setDeletingJobId(jobId);

    // Optimistic update: remove from UI immediately
    const jobToDelete = jobs.find(job => job.id === jobId);
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

    try {
      const response = await fetch(`${API_ENDPOINTS.JOBS}/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('¡Oferta eliminada exitosamente!');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        // If deletion failed, restore the job to the list
        setJobs(prevJobs => [...prevJobs, jobToDelete].sort((a, b) => a.id - b.id));
        setError('Error al eliminar la oferta. Inténtalo de nuevo.');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (err) {
      // If network error, restore the job to the list
      setJobs(prevJobs => [...prevJobs, jobToDelete].sort((a, b) => a.id - b.id));
      setError('Error de conexión. Inténtalo de nuevo.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setDeletingJobId(null);
    }
  };

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!jobToDelete) return;
    
    await handleDeleteJob(jobToDelete.id);
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'skills') {
      // Manejar selección múltiple de skills
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setSelectedSkills(selectedOptions);
      setForm(prev => ({ ...prev, [name]: selectedOptions.join(', ') }));
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Validar que el salario máximo no sea menor que el mínimo
    if (name === 'salaryMin' && parseInt(value) > form.salaryMax) {
      setError('El salario mínimo no puede ser mayor que el máximo');
    } else if (name === 'salaryMax' && parseInt(value) < form.salaryMin) {
      setError('El salario máximo no puede ser menor que el mínimo');
    } else {
      setError('');
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => {
      const isSelected = prev.includes(skill);
      let newSkills;
      
      if (isSelected) {
        newSkills = prev.filter(s => s !== skill);
      } else {
        if (prev.length >= 5) {
          setError('Puedes seleccionar máximo 5 habilidades');
          return prev;
        }
        newSkills = [...prev, skill];
      }
      
      setForm(prevForm => ({ ...prevForm, skills: newSkills.join(', ') }));
      setError('');
      return newSkills;
    });
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(prev => {
      const newSkills = prev.filter(skill => skill !== skillToRemove);
      setForm(prevForm => ({ ...prevForm, skills: newSkills.join(', ') }));
      return newSkills;
    });
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
            <h3>¡Éxito!</h3>
            <p>{success}</p>
          </div>
        )}

        <div className="companies-content">
          <div className="companies-actions">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn-create-job"
              disabled={jobs.length >= 2}
            >
              + Crear Nueva Oferta
            </button>
            {jobs.length >= 2 && (
              <p className="limit-notice">
                Has alcanzado el límite de 2 ofertas gratuitas. 
                <button 
                  onClick={() => setShowLimitModal(true)}
                  className="btn-upgrade"
                >
                  Actualizar a Premium
                </button>
              </p>
            )}
          </div>

          <div className="companies-jobs">
            <h3>Tus Ofertas de Trabajo ({jobs.length}/2)</h3>
            
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
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditJob(job)}
                        disabled={deletingJobId === job.id}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => confirmDelete(job)}
                        disabled={deletingJobId === job.id}
                      >
                        {deletingJobId === job.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
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
                    <select
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona un título</option>
                      {jobTitles.map((title, index) => (
                        <option key={index} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
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
                </div>

                <div className="form-row">
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
                </div>

                <div className="form-row">
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
                  <label htmlFor="skills">Habilidades Requeridas * (Máximo 5)</label>
                  <div className="skills-container">
                    <div className="skills-dropdown">
                      <select
                        id="skills"
                        name="skills"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSkillToggle(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        disabled={loading || selectedSkills.length >= 5}
                      >
                        <option value="">Selecciona habilidades</option>
                        {availableSkills
                          .filter(skill => !selectedSkills.includes(skill))
                          .map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="selected-skills">
                      {selectedSkills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="remove-skill"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {selectedSkills.length >= 5 && (
                      <small className="skills-limit">Has alcanzado el límite de 5 habilidades</small>
                    )}
                  </div>
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

        {/* Modal para editar empleo */}
        {showEditForm && (
          <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Editar Oferta de Trabajo</h2>
                <button className="modal-close" onClick={() => setShowEditForm(false)}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateJob} className="create-job-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Título del Puesto *</label>
                    <select
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona un título</option>
                      {jobTitles.map((title, index) => (
                        <option key={index} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
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
                </div>

                <div className="form-row">
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
                </div>

                <div className="form-row">
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
                  <label htmlFor="skills">Habilidades Requeridas * (Máximo 5)</label>
                  <div className="skills-container">
                    <div className="skills-dropdown">
                      <select
                        id="skills"
                        name="skills"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSkillToggle(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        disabled={loading || selectedSkills.length >= 5}
                      >
                        <option value="">Selecciona habilidades</option>
                        {availableSkills
                          .filter(skill => !selectedSkills.includes(skill))
                          .map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="selected-skills">
                      {selectedSkills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="remove-skill"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {selectedSkills.length >= 5 && (
                      <small className="skills-limit">Has alcanzado el límite de 5 habilidades</small>
                    )}
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowEditForm(false)}
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
                    {loading ? 'Actualizando...' : 'Actualizar Oferta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de límite alcanzado */}
        {showLimitModal && (
          <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
            <div className="modal-content limit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>¡Límite Alcanzado!</h2>
                <button className="modal-close" onClick={() => setShowLimitModal(false)}>
                  ×
                </button>
              </div>
              
              <div className="limit-content">
                <div className="limit-icon">💰</div>
                <h3>Plan Premium Requerido</h3>
                <p>Has alcanzado el límite de <strong>2 ofertas de trabajo gratuitas</strong>.</p>
                <p>Para publicar más ofertas, suscríbete a nuestro plan premium:</p>
                
                <div className="premium-features">
                  <h4>Plan Premium - $2.99/mes</h4>
                  <ul>
                    <li>✅ Ofertas de trabajo ilimitadas</li>
                    <li>✅ Estadísticas avanzadas</li>
                    <li>✅ Prioridad en búsquedas</li>
                    <li>✅ Soporte prioritario</li>
                  </ul>
                </div>
                
                <div className="premium-actions">
                  <button className="btn-primary">
                    Suscribirse por $2.99/mes
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowLimitModal(false)}
                  >
                    Más tarde
                  </button>
                </div>
                
                <p className="premium-note">
                  <small>* Esta funcionalidad estará disponible próximamente</small>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmar eliminación */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>¿Estás seguro de que quieres eliminar esta oferta de trabajo?</h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  ×
                </button>
              </div>
              
              <div className="delete-content">
                <p>Esta acción no se puede deshacer.</p>
                <div className="delete-actions">
                  <button 
                    className="btn-primary"
                    onClick={executeDelete}
                  >
                    Eliminar
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies; 