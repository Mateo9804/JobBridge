import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [selectedType, setSelectedType] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated && user?.role === 'user') {
      fetchMyCourses();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, selectedLevel, selectedType]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.COURSES}?type=todos`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.USER_COURSES}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyCourses(data);
      }
    } catch (error) {
      console.error('Error fetching my courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== 'todos') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (selectedType !== 'todos') {
      filtered = filtered.filter(course => course.type === selectedType);
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      return;
    }

    if (user?.role === 'company') {
      setMessage('❌ Las empresas no pueden inscribirse en cursos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ No hay token de autenticación');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ ¡Te has inscrito exitosamente en el curso!');
        fetchCourses();
        fetchMyCourses();
        setTimeout(() => setMessage(''), 3000);
        // Ir directamente al curso
        navigate(`/courses/${courseId}`);
      } else {
        setMessage(`❌ ${data.error || 'Error al inscribirse en el curso'}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      setMessage('❌ Error al inscribirse en el curso');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const isEnrolled = (courseId) => {
    return myCourses.some(enrollment => enrollment.course_id === courseId);
  };

  const getEnrollment = (courseId) => {
    return myCourses.find(enrollment => enrollment.course_id === courseId);
  };

  const canEnroll = (course) => {
    if (!isAuthenticated || user?.role !== 'user') {
      return false;
    }

    if (course.type === 'premium') {
      // En este proyecto solo existe el plan gratuito: el contenido premium es "próximamente".
      return false;
    }
    
    return true;
  };

  return (
    <div className="courses-page">
      <Header />
      
      <div className="courses-container">
        <div className="courses-header">
          <h1>
            JobAcademy <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '2.5rem', verticalAlign: 'middle' }}>menu_book</span>
          </h1>
          <p>Desarrolla tus habilidades con nuestros cursos de programación</p>
        </div>

        {message && (
          <div className={`courses-message ${message.includes('exitosamente') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Filtros */}
        <div className="courses-filters">
          <div className="filter-group">
            <label>Categoría:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="todos">Todas las categorías</option>
              <option value="programming">Programación</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Mobile</option>
              <option value="devops">DevOps</option>
              <option value="data">Data Science</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Nivel:</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="todos">Todos los niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="todos">Todos los tipos</option>
              <option value="free">Gratis</option>
              <option value="premium">Premium (próximamente)</option>
            </select>
          </div>
        </div>

        {/* Lista de cursos */}
        {loading ? (
          <div className="courses-loading">
            <p>Cargando cursos...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.length === 0 ? (
              <div className="no-courses">
                <p>No hay cursos disponibles con los filtros seleccionados</p>
              </div>
            ) : (
              filteredCourses.map(course => {
                const enrolled = isEnrolled(course.id);
                const enrollment = getEnrollment(course.id);
                
                return (
                  <div
                    key={course.id}
                    className="course-card"
                    onClick={() => {
                      if (enrolled) {
                        navigate(`/courses/${course.id}`);
                      }
                    }}
                    style={{ cursor: enrolled ? 'pointer' : 'default' }}
                  >
                    {course.image_url && (
                      <div className="course-image">
                        <img src={course.image_url} alt={course.title} />
                      </div>
                    )}
                    
                    <div className="course-badge">
                      {course.type === 'free' ? (
                        <span className="badge-free">🆓 Gratis</span>
                      ) : (
                        <span className="badge-premium">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>diamond</span>
                          Premium (próximamente)
                        </span>
                      )}
                    </div>

                    <div className="course-content">
                      <div className="course-title-section">
                        <h3>{course.title}</h3>
                        <div className="course-rating">
                          {'⭐'.repeat(Math.floor(course.rating))} {course.rating > 0 && course.rating.toFixed(1)}
                        </div>
                      </div>

                      <p className="course-description">{course.description}</p>

                      <div className="course-meta">
                        <div className="course-meta-item">
                          <span className="meta-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#007AFF' }}>menu_book</span>
                            Categoría:
                          </span>
                          <span className="meta-value">{course.category}</span>
                        </div>
                        <div className="course-meta-item">
                          <span className="meta-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#007AFF' }}>bar_chart</span>
                            Nivel:
                          </span>
                          <span className="meta-value capitalize">{course.level}</span>
                        </div>
                        {course.duration && (
                          <div className="course-meta-item">
                            <span className="meta-label">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#007AFF' }}>schedule</span>
                              Duración:
                            </span>
                            <span className="meta-value">{course.duration}</span>
                          </div>
                        )}
                      </div>

                      {course.instructor && (
                        <div className="course-instructor">
                          <strong>Instructor:</strong> {course.instructor}
                        </div>
                      )}

                      {course.what_you_will_learn && (
                        <div className="course-learn">
                          <strong>Lo que aprenderás:</strong>
                          <p>{course.what_you_will_learn.substring(0, 100)}...</p>
                        </div>
                      )}

                      {enrolled && (
                        <div className="course-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            ></div>
                          </div>
                          <p>{enrollment.progress_percentage}% completado</p>
                        </div>
                      )}

                      <div className="course-footer">
                        <button
                          className={`course-enroll-btn ${
                            (user?.role === 'company' || (!enrolled && (!isAuthenticated || course.type === 'premium')))
                              ? 'disabled' : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (enrolled) {
                              navigate(`/courses/${course.id}`);
                              return;
                            }
                            
                            const token = localStorage.getItem('token');
                            
                            if (!token || !isAuthenticated || !user) {
                              setMessage(''); 
                              setShowLoginModal(true);
                              return;
                            }
                            
                            if (user.role === 'company') {
                              setMessage('❌ Las empresas no pueden inscribirse en cursos');
                              setTimeout(() => setMessage(''), 3000);
                              return;
                            }

                            if (course.type === 'premium') {
                              setMessage('ℹ️ Este curso es Premium (próximamente).');
                              setTimeout(() => setMessage(''), 3000);
                              return;
                            }
                            
                            handleEnroll(course.id);
                          }}
                          disabled={user?.role === 'company'}
                        >
                          {enrolled ? 'Ir al curso' : 
                           !isAuthenticated ? 'Inicia sesión para inscribirte' :
                           user?.role === 'company' ? 'Solo para usuarios' :
                           (course.type === 'premium') ? 'Próximamente' :
                           'Inscribirse'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '24px', verticalAlign: 'middle', marginRight: '8px' }}>lock</span>
                Acceso requerido
              </h2>
              <button className="modal-close" onClick={() => setShowLoginModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Debes iniciar sesión o registrarte para inscribirte en un curso.
              </p>
              <p className="modal-description">
                Únete a JobBridge para acceder a nuestros cursos de programación y desarrollar tus habilidades.
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
};

export default Courses;
