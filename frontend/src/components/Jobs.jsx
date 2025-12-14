import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Jobs.css';

function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedExperience, setSelectedExperience] = useState('todos');
  const [selectedLocation, setSelectedLocation] = useState('todos');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicationLimitReached, setApplicationLimitReached] = useState(false);
  const [jobsWithMaxApplications, setJobsWithMaxApplications] = useState([]);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = [];
        if (selectedCategory !== 'todos') params.push(`category=${encodeURIComponent(selectedCategory)}`);
        if (selectedExperience !== 'todos') params.push(`experience=${encodeURIComponent(selectedExperience)}`);
        if (selectedLocation !== 'todos') params.push(`location=${encodeURIComponent(selectedLocation)}`);
        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        const response = await fetch(`${API_ENDPOINTS.JOBS}${queryString}`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [selectedCategory, selectedExperience, selectedLocation]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;
      try {
        const response = await fetch(`${API_ENDPOINTS.USER_APPLICATIONS}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setAppliedJobs(data.map(app => app.job_id));
            if (data.length >= 2) {
              setApplicationLimitReached(true);
            } else {
              setApplicationLimitReached(false);
            }
          }
        }
      } catch (e) {}
    };
    fetchAppliedJobs();
  }, [user]);

  useEffect(() => {
    const fetchJobsWithMaxApplications = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.JOBS}`);
        if (response.ok) {
          const jobsData = await response.json();
          const jobsWithMax = [];
          for (const job of jobsData) {
            if (job.applications_count >= 5) {
              jobsWithMax.push(job.id);
            }
          }
          setJobsWithMaxApplications(jobsWithMax);
        }
      } catch (e) {}
    };
    fetchJobsWithMaxApplications();
  }, [jobs]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const filteredJobs = jobs;

  const handleApply = (job) => {
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }
    
    if (user.role === 'user') {
      navigate('/apply', { state: { job } });
    }
  };

  return (
    <div className="jobs-page">
      <Header />
      
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Ofertas de trabajo para programadores en España</h1>
          <p>Encuentra tu próximo trabajo en tecnología</p>
        </div>

        <div className="jobs-content">
          {/* Filtros */}
          <div className="filters-section">
            <h3>Filtros</h3>
            <div className="filters">
              <div className="filter-group">
                <label>Tipo de Trabajo:</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="todos">Todos los tipos</option>
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
                  value={selectedExperience} 
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  <option value="todos">Todas las experiencias</option>
                  <option value="junior">Junior (0-2 años)</option>
                  <option value="mid">Mid (2-5 años)</option>
                  <option value="senior">Senior (5+ años)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Ubicación:</label>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="todos">Todas las ubicaciones</option>
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
          </div>

          {/* Lista de trabajos */}
          <div className="jobs-list">
            <div className="jobs-count">
              <p>{filteredJobs.length} ofertas encontradas</p>
            </div>
            
            {filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                
                <div className="job-company">
                  <h4>{job.company}</h4>
                  <span className="job-location">📍 {job.location}</span>
                </div>
                
                <p className="job-description">{job.description}</p>
                
                <div className="job-details">
                  <div className="job-salary">
                    <strong>Salario:</strong> €{job.salary_min?.toLocaleString()} - €{job.salary_max?.toLocaleString()}
                  </div>
                  <div className="job-experience">
                    <strong>Experiencia:</strong> {job.experience.charAt(0).toUpperCase() + job.experience.slice(1)}
                  </div>
                </div>
                
                <div className="job-skills">
                  {Array.isArray(job.skills) ? job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  )) : (
                    <span className="skill-tag">Sin habilidades especificadas</span>
                  )}
                </div>
                
                <div className="job-footer">
                  <span className="job-posted">{job.posted}</span>
                  {user?.role === 'company' ? (
                    <button 
                      className="apply-btn disabled"
                      disabled
                      title="Las empresas no pueden aplicar a trabajos"
                    >
                      Solo para Usuarios
                    </button>
                  ) : (
                    <button
                      className={`apply-btn${appliedJobs.includes(job.id) || applicationLimitReached || jobsWithMaxApplications.includes(job.id) ? ' disabled' : ''}`}
                      onClick={() => handleApply(job)}
                      disabled={appliedJobs.includes(job.id) || applicationLimitReached || jobsWithMaxApplications.includes(job.id)}
                    >
                      {appliedJobs.includes(job.id) ? 'Ya te inscribiste' : 'Inscribirte Ahora'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Acceso requerido</h2>
              <button className="modal-close" onClick={() => setShowLoginModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Debes iniciar sesión o registrarte para postularte a un trabajo.
              </p>
              <p className="modal-description">
                Únete a JobBridge para postularte a trabajos de programación en España.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn-cancel" 
                onClick={() => setShowLoginModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="modal-btn-confirm" 
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs; 