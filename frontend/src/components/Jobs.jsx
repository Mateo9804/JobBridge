import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthModal from './AuthModal';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Jobs.css';

function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedExperience, setSelectedExperience] = useState('todos');
  const [selectedLocation, setSelectedLocation] = useState('todos');
  const [selectedDateSort, setSelectedDateSort] = useState('recientes');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicationLimitReached, setApplicationLimitReached] = useState(false);
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  
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
            // Límite de 2 aplicaciones para usuarios con plan gratuito
            if (user.role === 'user' && user.plan === 'free' && data.length >= 2) {
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
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user || user.role !== 'user') return;
      try {
        const response = await fetch(API_ENDPOINTS.USER_FAVORITES, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFavoriteJobs(data);
          }
        }
      } catch (e) {
        console.error('Error fetching favorites:', e);
      }
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Filtrar y ordenar trabajos
  let filteredJobs = [...jobs];

  // Filtrar por favoritos si está activado
  if (showFavoritesOnly && user?.role === 'user') {
    filteredJobs = filteredJobs.filter(job => favoriteJobs.includes(job.id));
  }

  // Ordenar por fecha
  filteredJobs.sort((a, b) => {
    const dateA = new Date(a.created_at || a.updated_at || 0);
    const dateB = new Date(b.created_at || b.updated_at || 0);
    
    if (selectedDateSort === 'recientes') {
      return dateB - dateA; // Más recientes primero
    } else {
      return dateA - dateB; // Más antiguos primero
    }
  });

  const handleApply = (job) => {
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }
    
    if (user.role === 'user') {
      if (!user.is_profile_complete) {
        addNotification('Debes completar tu perfil profesional antes de inscribirte en ofertas.', 'warning');
        return;
      }
      navigate('/apply', { state: { job } });
    }
  };

  const handleToggleFavorite = async (job) => {
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated() || !user || user.role !== 'user') {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.JOB_TOGGLE_FAVORITE(job.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.is_favorite) {
          setFavoriteJobs(prev => [...prev, job.id]);
          addNotification('Trabajo agregado a favoritos', 'success');
        } else {
          setFavoriteJobs(prev => prev.filter(id => id !== job.id));
          addNotification('Trabajo eliminado de favoritos', 'info');
        }
      } else {
        addNotification('Error al gestionar favorito', 'error');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      addNotification('Error al gestionar favorito', 'error');
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

              <div className="filter-group">
                <label>Ordenar por fecha:</label>
                <select 
                  value={selectedDateSort} 
                  onChange={(e) => setSelectedDateSort(e.target.value)}
                >
                  <option value="recientes">Más recientes</option>
                  <option value="antiguos">Más antiguos</option>
                </select>
              </div>

              {user?.role === 'user' && (
                <div className="filter-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Solo favoritos</span>
                  </label>
                </div>
              )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="job-type">{job.type}</span>
                    {user?.role === 'user' && (
                      <button
                        className={`favorite-btn ${favoriteJobs.includes(job.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(job);
                        }}
                        title={favoriteJobs.includes(job.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <span className="material-symbols-outlined">
                          {favoriteJobs.includes(job.id) ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    )}
                  </div>
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
                  <div className="job-vacancies">
                    <strong>Vacantes:</strong> {job.accepted_count || 0} / {job.vacancies}
                  </div>
                </div>
                
                <div className="job-skills">
                  {Array.isArray(job.skills) ? job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  )) : (
                    <span className="skill-tag">Sin habilidades especificadas</span>
                  )}
                </div>

                {/* Lista de Postulantes (Solo número) */}
                <div className="job-applicants-section">
                  <div className="applicants-count-badge">
                    <strong>Postulantes:</strong> {job.applications_count || 0}
                  </div>
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
                      className={`apply-btn${appliedJobs.includes(job.id) || applicationLimitReached ? ' disabled' : ''}`}
                      onClick={() => handleApply(job)}
                      disabled={appliedJobs.includes(job.id) || applicationLimitReached}
                    >
                      {appliedJobs.includes(job.id) 
                        ? 'Ya te inscribiste' 
                        : (!user?.is_profile_complete && isAuthenticated())
                          ? 'Completa tu perfil para inscribirte'
                          : 'Inscribirte Ahora'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        initialMode="login"
      />
    </div>
  );
}

export default Jobs; 