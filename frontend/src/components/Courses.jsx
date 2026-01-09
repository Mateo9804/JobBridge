import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthModal from './AuthModal';
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
  const [sortBy, setSortBy] = useState('recientes'); // 'recientes', 'antiguos', 'completados', 'menos-completados'
  const [loading, setLoading] = useState(true);
  const [loadingUserCourses, setLoadingUserCourses] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated && user?.role === 'user') {
      fetchMyCourses();
    } else {
      // Limpiar los cursos del usuario cuando cierra sesión
      setMyCourses([]);
    }
  }, [isAuthenticated, user]);

  const filterCourses = React.useCallback(() => {
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

    // Ordenar cursos
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recientes') {
        // Más nuevos primero (por fecha de creación)
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB - dateA;
      } else if (sortBy === 'antiguos') {
        // Más antiguos primero
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateA - dateB;
      } else if (sortBy === 'completados' || sortBy === 'menos-completados') {
        // Ordenar por progreso de completado
        const enrollmentA = myCourses.find(e => e.course_id === a.id);
        const enrollmentB = myCourses.find(e => e.course_id === b.id);
        
        const progressA = enrollmentA?.progress_percentage || 0;
        const progressB = enrollmentB?.progress_percentage || 0;
        
        // Si no están inscritos, van al final
        if (!enrollmentA && !enrollmentB) return 0;
        if (!enrollmentA) return 1;
        if (!enrollmentB) return -1;
        
        // Ordenar por progreso
        if (sortBy === 'completados') {
          return progressB - progressA; // Más completados primero
        } else {
          return progressA - progressB; // Menos completados primero
        }
      }
      return 0;
    });

    setFilteredCourses(filtered);
  }, [courses, selectedCategory, selectedLevel, selectedType, sortBy, myCourses]);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

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
      setLoadingUserCourses(true);
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
    } finally {
      setLoadingUserCourses(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      return;
    }

    if (user?.role === 'company') {
      setMessage('Las empresas no pueden inscribirse en cursos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No hay token de autenticación');
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
        setMessage('¡Te has inscrito exitosamente en el curso!');
        fetchCourses();
        fetchMyCourses();
        setTimeout(() => setMessage(''), 3000);
        // Ir directamente al curso
        navigate(`/courses/${courseId}`);
      } else {
        setMessage(`${data.error || 'Error al inscribirse en el curso'}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      setMessage('Error al inscribirse en el curso');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const isEnrolled = (courseId) => {
    return myCourses.some(enrollment => enrollment.course_id === courseId);
  };

  const getEnrollment = (courseId) => {
    return myCourses.find(enrollment => enrollment.course_id === courseId);
  };

  // Función comentada por no uso actual
  // const canEnroll = (course) => {
  //   if (!isAuthenticated || user?.role !== 'user') {
  //     return false;
  //   }

  //   if (course.type === 'premium') {
  //     // Solo usuarios con plan profesional pueden inscribirse en cursos premium
  //     return user?.plan === 'professional';
  //   }
    
  //   return true;
  // };

  return (
    <div className="courses-page">
      <Header />
      
      <div className="courses-container">
        <div className="courses-header">
          <h1>
            JobAcademy <span className="material-symbols-outlined" style={{ color: '#000000', fontSize: '2.5rem', verticalAlign: 'middle' }}>menu_book</span>
          </h1>
          <p>Desarrolla tus habilidades con nuestros cursos de programación</p>
        </div>

        {message && (
          <div className={`courses-message ${message.includes('exitosamente') ? 'success' : 'error'}`}>
            <span className="material-symbols-outlined" style={{ 
              fontSize: '20px', 
              verticalAlign: 'middle', 
              marginRight: '8px' 
            }}>
              {message.includes('exitosamente') ? 'check_circle' : message.includes('Premium') ? 'lock' : 'error'}
            </span>
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
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="completados">Más completados</option>
              <option value="menos-completados">Menos completados</option>
            </select>
          </div>
        </div>

        {/* Lista de cursos */}
        {loading || loadingUserCourses ? (
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
                          Premium {user?.plan === 'professional' ? '' : '(Requiere Plan Profesional)'}
                        </span>
                      )}
                    </div>

                    <div className="course-content">
                      <div className="course-title-section">
                        <h3>{course.title}</h3>
                        <div className="course-rating">
                          {(() => {
                            // Verificar si hay rating válido (puede ser que ratings_count sea 0 pero rating tenga valor)
                            const hasRating = (course.ratings_count > 0) || (course.rating && course.rating > 0);
                            if (!hasRating) {
                              return <span style={{ visibility: 'hidden' }}>&nbsp;</span>;
                            }
                            
                            const numericRating = typeof course.rating === 'number' ? course.rating : parseFloat(course.rating) || 0;
                            if (numericRating <= 0) {
                              return <span style={{ visibility: 'hidden' }}>&nbsp;</span>;
                            }
                            
                            const decimalPart = numericRating % 1;
                            const fullStars = Math.floor(numericRating);
                            const hasHalfStar = decimalPart >= 0.3;
                            const displayRating = hasHalfStar ? (fullStars + 0.5) : fullStars;
                            const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
                            return (
                              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map((s) => {
                                  if (s <= fullStars) {
                                    return (
                                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" style={{ display: 'block' }}>
                                        <path d={starPath} />
                                      </svg>
                                    );
                                  } else if (s === fullStars + 1 && hasHalfStar) {
                                    return (
                                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                        <defs>
                                          <mask id={`course-star-mask-${course.id}-${s}`}>
                                            <rect x="0" y="0" width="12" height="24" fill="white" />
                                            <rect x="12" y="0" width="12" height="24" fill="black" />
                                          </mask>
                                        </defs>
                                        <path d={starPath} fill="#ccc" />
                                        <path d={starPath} fill="#FFD700" mask={`url(#course-star-mask-${course.id}-${s})`} />
                                      </svg>
                                    );
                                  } else {
                                    return (
                                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#ccc" style={{ display: 'block' }}>
                                        <path d={starPath} />
                                      </svg>
                                    );
                                  }
                                })}
                                <span>({displayRating.toFixed(1)})</span>
                                {course.ratings_count > 0 && (
                                  <span style={{ color: '#999', fontSize: '0.85rem', marginLeft: '4px' }}>
                                    {course.ratings_count} {course.ratings_count === 1 ? 'reseña' : 'reseñas'}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
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
                            (user?.role === 'company' || (!enrolled && (!isAuthenticated || (course.type === 'premium' && user?.plan !== 'professional'))))
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
                              setMessage('Las empresas no pueden inscribirse en cursos');
                              setTimeout(() => setMessage(''), 3000);
                              return;
                            }

                            if (course.type === 'premium' && user.plan !== 'professional') {
                              setMessage('Este curso es Premium. Necesitas el Plan Profesional para acceder. ¡Actualiza tu plan!');
                              setTimeout(() => {
                                setMessage('');
                                navigate('/pricing');
                              }, 3000);
                              return;
                            }
                            
                            handleEnroll(course.id);
                          }}
                          disabled={user?.role === 'company'}
                        >
                          {enrolled ? 'Ir al curso' : 
                           !isAuthenticated ? 'Inicia sesión para inscribirte' :
                           user?.role === 'company' ? 'Solo para usuarios' :
                           (course.type === 'premium' && user?.plan !== 'professional') ? 'Requiere Plan Premium' :
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
      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default Courses;
