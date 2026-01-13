import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import AuthModal from './AuthModal';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Companies.css';
import CompanyApplicationsPanel from './CompanyApplicationsPanel';
import CompanyUserPanel from './CompanyUserPanel';

function Companies() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [form, setForm] = useState({
    title: '',
    location: '',
    category: '',
    experience: '',
    salaryMin: 20000,
    salaryMax: 50000,
    description: '',
    skills: '',
    type: 'Presencial',
    vacancies: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterExperience, setFilterExperience] = useState('todos');
  const [filterLocation, setFilterLocation] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [filterSkill, setFilterSkill] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated, user, token, setUser } = useAuth();
  const { fetchNotifications } = useNotification();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  // Opciones predefinidas para títulos de puestos
  const jobTitles = [
    'Desarrollador frontend',
    'Desarrollador backend',
    'Desarrollador full stack',
    'Desarrollador mobile',
    'Desarrollador react',
    'Desarrollador angular',
    'Desarrollador vue.js',
    'Desarrollador node.js',
    'Desarrollador python',
    'Desarrollador java',
    'Desarrollador PHP',
    'Desarrollador .NET',
    'Desarrollador ruby',
    'Desarrollador go',
    'Desarrollador rust',
    'Ingeniero de software',
    'Arquitecto de software',
    'DevOps engineer',
    'Data scientist',
    'Data engineer',
    'Machine learning engineer',
    'QA engineer',
    'Test engineer',
    'Product manager',
    'Scrum master',
    'Tech lead',
    'Team lead',
    'Project manager',
    'UX/UI designer',
    'Diseñador web',
    'Analista de sistemas',
    'Administrador de sistemas',
    'DBA (Database administrator)',
    'Cloud engineer',
    'Security engineer',
    'Blockchain developer',
    'Game developer',
    'Embedded developer',
    'iOS developer',
    'Android developer',
    'Flutter developer',
    'React native developer'
  ];

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

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.COMPANY_JOBS, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else if (!silent) {
        setJobs([]);
        setError('Error al cargar las ofertas de trabajo');
      }
    } catch (err) {
      if (!silent) {
        setJobs([]);
        setError('Error de conexión al cargar las ofertas');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    
    // Solo cargar si el usuario es empresa y tenemos token
    if (token && user?.role === 'company') {
      const loadInitialData = async () => {
        // Cargar trabajos
        await fetchJobs();
        if (!isMounted) return;
        
        // Solo refrescar perfil si no tenemos datos básicos o para verificar el plan
        try {
          const response = await fetch(API_ENDPOINTS.PROFILE_GET, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok && isMounted) {
            const userData = await response.json();
            // Evitar actualización si los datos son idénticos
            if (JSON.stringify(userData) !== JSON.stringify(user)) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      };
      loadInitialData();
    }
    
    return () => { isMounted = false; };
  }, [token, user?.id, fetchJobs, setUser, user]); // Depender de token e ID de usuario para estabilidad

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleCreateJob = async (e) => {
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
      company: user?.company_name || user?.name || '',
      skills: selectedSkills,
    };

    console.log('Datos a enviar:', formToSend);

    try {
      const response = await fetch(API_ENDPOINTS.JOBS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formToSend),
      });

      if (response.ok) {
        setSuccess('¡Oferta creada exitosamente!');
        setShowCreateForm(false);
        setSelectedSkills([]);
        await fetchJobs(true); // Carga silenciosa para evitar parpadeo
        fetchNotifications();
        setTimeout(() => {
          setSuccess('');
          setForm({
            title: '', location: '', category: '', experience: '',
            salaryMin: 20000, salaryMax: 50000, description: '', skills: '', type: 'Presencial', vacancies: 1
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
      type: job.type,
      vacancies: job.vacancies || 1
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
      company: user?.company_name || user?.name || '',
      skills: selectedSkills,
    };

    try {
      const response = await fetch(`${API_ENDPOINTS.JOBS}/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formToSend),
      });

      if (response.ok) {
        setSuccess('¡Oferta actualizada exitosamente!');
        setShowEditForm(false);
        setEditingJob(null);
        setSelectedSkills([]);
        fetchJobs();
        fetchNotifications();
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
    setDeletingJobId(jobId);

    const jobToDelete = jobs.find(job => job.id === jobId);
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

    try {
      const response = await fetch(`${API_ENDPOINTS.JOBS}/${jobId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      if (response.ok) {
        setSuccess('¡Oferta eliminada exitosamente!');
        fetchNotifications();
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setJobs(prevJobs => [...prevJobs, jobToDelete].sort((a, b) => a.id - b.id));
        setError('Error al eliminar la oferta. Inténtalo de nuevo.');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (err) {
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
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setSelectedSkills(selectedOptions);
      setForm(prev => ({ ...prev, [name]: selectedOptions.join(', ') }));
    } else {
      setForm({ ...form, [name]: value });
    }
    
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

  if (!isAuthenticated()) {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <div className="auth-required">
            <h2>Acceso requerido</h2>
            <p>Para acceder a la sección de empresas, necesitas iniciar sesión o registrarte.</p>
            <div className="auth-buttons">
              <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Iniciar sesión o registrarse
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (user?.role !== 'company') {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <div className="access-denied">
            <h2>Acceso restringido</h2>
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

  if (tab === 'applications') {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <CompanyApplicationsPanel onApplicationStatusChange={fetchJobs} />
        </div>
      </div>
    );
  }

  if (tab === 'users') {
    return (
      <div className="companies-page">
        <Header />
        <div className="companies-container">
          <CompanyUserPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="companies-page">
      <Header />
      <div className="companies-container">
        <div className="companies-header">
          <h1>Panel de empresa</h1>
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
            {(() => {
              // Verificar si el usuario tiene plan profesional
              const isPremium = user?.plan === 'professional';
              // Solo limitar si tiene plan gratuito
              const limitReached = !isPremium && jobs && jobs.length >= 2;
              
              return (
                <>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="btn-create-job"
                    disabled={limitReached}
                  >
                    + Crear nueva oferta
                  </button>
                  {limitReached && (
                    <p className="limit-notice">
                      Has alcanzado el límite de 2 ofertas (Plan gratuito). 
                      <button 
                        onClick={() => setShowLimitModal(true)}
                        className="btn-upgrade"
                      >
                        Actualizar a Plan Profesional
                      </button>
                    </p>
                  )}
                </>
              );
            })()}
          </div>

          <div className="companies-jobs">
            <h3>Tus ofertas de trabajo</h3>
            
            {/* Filtros */}
            {jobs && jobs.length > 0 && (
              <div className="jobs-filters">
                <div className="filter-group full-search">
                  <label>Buscar oferta:</label>
                  <input 
                    type="text" 
                    placeholder="Título o tecnologías..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-jobs"
                  />
                </div>

                <div className="filter-group">
                  <label>Categoría:</label>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="todos">Todas</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="mobile">Mobile</option>
                    <option value="devops">DevOps</option>
                    <option value="data">Data Science</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Experiencia:</label>
                  <select 
                    value={filterExperience} 
                    onChange={(e) => setFilterExperience(e.target.value)}
                  >
                    <option value="todos">Todas</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Habilidad:</label>
                  <select 
                    value={filterSkill} 
                    onChange={(e) => setFilterSkill(e.target.value)}
                  >
                    <option value="todos">Cualquiera</option>
                    {availableSkills.slice(0, 15).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Ubicación:</label>
                  <select 
                    value={filterLocation} 
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="todos">Todas</option>
                    <option value="Madrid, España">Madrid</option>
                    <option value="Barcelona, España">Barcelona</option>
                    <option value="Valencia, España">Valencia</option>
                    <option value="Sevilla, España">Sevilla</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Tipo:</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>
            )}

            {(() => {
              if (jobs === null || (loading && jobs.length === 0)) {
                return (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando ofertas...</p>
                  </div>
                );
              }

              // Filtrar trabajos
              let filteredJobs = jobs;
              
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filteredJobs = filteredJobs.filter(job => 
                  job.title.toLowerCase().includes(query) || 
                  (job.skills && job.skills.toLowerCase().includes(query))
                );
              }
              if (filterCategory !== 'todos') {
                filteredJobs = filteredJobs.filter(job => job.category === filterCategory);
              }
              if (filterExperience !== 'todos') {
                filteredJobs = filteredJobs.filter(job => job.experience === filterExperience);
              }
              if (filterLocation !== 'todos') {
                filteredJobs = filteredJobs.filter(job => job.location === filterLocation);
              }
              if (filterType !== 'todos') {
                filteredJobs = filteredJobs.filter(job => job.type === filterType);
              }
              if (filterSkill !== 'todos') {
                filteredJobs = filteredJobs.filter(job => 
                  job.skills && job.skills.includes(filterSkill)
                );
              }

              if (filteredJobs.length === 0 && jobs.length > 0) {
                return (
                  <div className="no-jobs">
                    <p>No se encontraron ofertas con los filtros seleccionados.</p>
                  </div>
                );
              }

              if (jobs.length === 0) {
                return (
                  <div className="no-jobs">
                    <p>No tienes ofertas de trabajo publicadas.</p>
                    <p>Crea tu primera oferta para empezar a recibir candidatos.</p>
                  </div>
                );
              }

              return (
                <div className="jobs-grid">
                  {filteredJobs.map(job => (
                    <div key={job.id} className={`job-card ${job.status}`}>
                      <div className="job-header">
                        <h4>{job.title}</h4>
                        <span className={`job-status ${job.status}`}>
                          {job.status === 'open' ? 'Activo' : 'Finalizada'}
                        </span>
                      </div>
                      <div className="job-details">
                        <p><strong>Ubicación:</strong> {job.location}</p>
                        <p><strong>Salario:</strong> €{job.salary_min?.toLocaleString()} - €{job.salary_max?.toLocaleString()}</p>
                      <p><strong>Tipo:</strong> {job.type}</p>
                      <p><strong>Vacantes:</strong> {job.accepted_count || 0} / {job.vacancies}</p>
                    </div>

                    {/* Contador de postulantes para la empresa */}
                    <div className="job-applicants-preview">
                      <div className="applicants-count-badge">
                        <strong>Postulantes:</strong> {job.applications_count || 0}
                      </div>
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
              );
            })()}
          </div>
        </div>

        {/* Modal para crear empleo */}
        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Crear nueva oferta de trabajo</h2>
                <button className="modal-close" onClick={() => setShowCreateForm(false)}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateJob} className="create-job-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Título del puesto *</label>
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
                    <label htmlFor="type">Tipo de trabajo</label>
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
                    <label htmlFor="category">Categoría</label>
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
                    <label htmlFor="vacancies">Número de vacantes *</label>
                    <input
                      type="number"
                      id="vacancies"
                      name="vacancies"
                      value={form.vacancies}
                      onChange={handleChange}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">Experiencia</label>
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

                <div className="form-group">
                  <label htmlFor="skills">Habilidades requeridas (Máximo 5)</label>
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
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Rango de salario (€) al año</label>
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
                          min="1"
                          max="100000"
                          step="1"
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
                          min="1"
                          max="100000"
                          step="1"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="salary-display">
                      <span>{form.salaryMin.toLocaleString()}€ - {form.salaryMax.toLocaleString()}€</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción del puesto</label>
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
                    {loading ? 'Creando...' : 'Crear oferta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar empleo */}
        {showEditForm && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Editar oferta de trabajo</h2>
                <button className="modal-close" onClick={() => setShowEditForm(false)}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateJob} className="create-job-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Título del puesto</label>
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
                    <label htmlFor="location">Ubicación</label>
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
                    <label htmlFor="type">Tipo de trabajo</label>
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
                    <label htmlFor="category">Categoría</label>
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
                    <label htmlFor="vacancies">Número de vacantes *</label>
                    <input
                      type="number"
                      id="vacancies"
                      name="vacancies"
                      value={form.vacancies}
                      onChange={handleChange}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience">Experiencia</label>
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
                  <label htmlFor="salary">Rango de salario (€) al año</label>
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
                          min="1"
                          max="100000"
                          step="1"
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
                          min="1"
                          max="100000"
                          step="1"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="salary-display">
                      <span>{form.salaryMin.toLocaleString()}€ - {form.salaryMax.toLocaleString()}€</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción del puesto</label>
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
                  <label htmlFor="skills">Habilidades requeridas (Máximo 5)</label>
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
                    {loading ? 'Actualizando...' : 'Actualizar oferta'}
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
                <h2>¡Límite alcanzado!</h2>
                <button className="modal-close" onClick={() => setShowLimitModal(false)}>
                  ×
                </button>
              </div>
              
              <div className="limit-content">
                <div className="limit-icon">ℹ️</div>
                <h3>Plan Profesional</h3>
                <p>Has alcanzado el límite de <strong>2 ofertas de trabajo gratuitas</strong>.</p>
                <p>Actualiza a <strong>Plan Profesional</strong> para publicar ofertas ilimitadas y acceder a todas las funcionalidades premium.</p>

                <div className="premium-actions">
                  <button className="btn-primary" onClick={() => {
                    setShowLimitModal(false);
                    navigate('/pricing');
                  }}>
                    Ver planes
                  </button>
                  <button className="btn-secondary" onClick={() => setShowLimitModal(false)}>
                    Cerrar
                  </button>
                </div>
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