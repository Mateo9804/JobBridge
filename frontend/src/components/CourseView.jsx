import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { moduleContent } from './LessonContent';
import AuthImage from './AuthImage';
import './CourseView.css';

const MaterialIcon = ({ name, color = '#007AFF', size = 24, className = '', style = {} }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={{ color, fontSize: size, verticalAlign: 'middle', ...style }}
  >
    {name}
  </span>
);

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();

  const [course, setCourse] = useState(null);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPct, setProgressPct] = useState(0);
  const [progressLoading, setProgressLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [courseRes, myRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.COURSES}/${id}`),
          (async () => {
            if (!isAuthenticated) return { ok: false };
            const token = localStorage.getItem('token');
            return fetch(`${API_ENDPOINTS.USER_COURSES}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          })(),
        ]);

        if (courseRes.ok) {
          const data = await courseRes.json();
          setCourse(data);
        }

        if (myRes && myRes.ok) {
          const data = await myRes.json();
          setMyEnrollments(data);
        }
      } catch (e) {
        setMessage('Error cargando el curso');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  // Fetch reviews when course is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!course) return;
      try {
        setLoadingReviews(true);
        const res = await fetch(API_ENDPOINTS.COURSE_REVIEWS(id));
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
          // Verificar si el usuario actual ya tiene una reseña
          if (isAuthenticated && user) {
            const userReview = data.find(review => review.user?.id === user.id);
            if (userReview) {
              setHasReview(true);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id, course, isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    // Verificar el scroll inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const enrollment = useMemo(() => {
    return myEnrollments.find((en) => String(en.course_id) === String(id));
  }, [myEnrollments, id]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!enrollment) {
        setProgressLoading(false);
        return;
      }
      setProgressLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.ENROLLMENT_PROGRESS(enrollment.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const done = new Set(
            Array.isArray(data.progress_details)
              ? data.progress_details.filter(p => p.is_completed).map(p => p.lesson_id)
              : []
          );
          setCompletedLessons(done);
          if (data.enrollment && typeof data.enrollment.progress_percentage === 'number') {
            setProgressPct(data.enrollment.progress_percentage);
          }
        }
      } catch (e) {
      } finally {
        setProgressLoading(false);
      }
    };
    fetchProgress();
  }, [enrollment]);

  const isCppCourse = useMemo(() => {
    if (!course) return false;
    return (course.title || '').toLowerCase().includes('c++');
  }, [course]);

  const isCSharpCourse = useMemo(() => {
    if (!course) return false;
    const t = (course.title || '').toLowerCase();
    return t.includes('c#') || t.includes('csharp') || t.includes('c# y .net');
  }, [course]);

  const isCCourse = useMemo(() => {
    if (!course) return false;
    const t = (course.title || '').toLowerCase();
    return t.includes('programación en c');
  }, [course]);

  const isSpringBootCourse = useMemo(() => {
    if (!course) return false;
    const t = (course.title || '').toLowerCase();
    return t.includes('spring boot');
  }, [course]);

  const isReactAdvancedCourse = useMemo(() => {
    if (!course) return false;
    const t = (course.title || '').toLowerCase();
    return t.includes('react avanzado');
  }, [course]);

  const isJavaScriptCourse = useMemo(() => {
    if (!course) return false;
    const t = (course.title || '').toLowerCase();
    return t.includes('javascript');
  }, [course]);


  // Get all module IDs for the course
  const getAllModuleIds = useMemo(() => {
    if (!course) return [];
    const moduleKeys = Object.keys(moduleContent);
    const courseTitle = (course.title || '').toLowerCase();
    
    if (courseTitle.includes('c++') || courseTitle.includes('cpp')) {
      return moduleKeys.filter(k => k.startsWith('modulo-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('c#')) {
      return moduleKeys.filter(k => k.startsWith('csharp-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('programación en c') || courseTitle.includes(' lenguaje c')) {
      return moduleKeys.filter(k => k.startsWith('c-') && !k.startsWith('csharp-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('spring')) {
      return moduleKeys.filter(k => k.startsWith('spring-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('react')) {
      return moduleKeys.filter(k => k.startsWith('react-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('javascript')) {
      return moduleKeys.filter(k => k.startsWith('js-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('python')) {
      return moduleKeys.filter(k => k.startsWith('python-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('html') && courseTitle.includes('css')) {
      return moduleKeys.filter(k => k.startsWith('htmlcss-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    } else if (courseTitle.includes('node.js') || courseTitle.includes('nodejs') || courseTitle.includes('express')) {
      return moduleKeys.filter(k => k.startsWith('nodejs-')).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    }
    return [];
  }, [course]);

  // Check if a module is completed (all lessons completed)
  const isModuleCompleted = (moduleId) => {
    const module = moduleContent[moduleId];
    if (!module || !module.lessons) return false;
    return module.lessons.every(l => completedLessons.has(l.id));
  };

  // Check if a module is unlocked
  const isModuleUnlocked = (moduleId) => {
    const moduleIds = getAllModuleIds;
    const moduleIndex = moduleIds.indexOf(moduleId);
    if (moduleIndex === -1) return false;
    if (moduleIndex === 0) return true; // First module is always unlocked
    const prevModuleId = moduleIds[moduleIndex - 1];
    return isModuleCompleted(prevModuleId);
  };

  // Helper function to render module title (blocked or unlocked)
  const renderModuleTitle = (moduleId, title) => {
    const unlocked = isModuleUnlocked(moduleId);
    if (unlocked) {
      return <Link to={`/courses/${id}/module/${moduleId}`}>{title}</Link>;
    } else {
      return (
        <span style={{ opacity: 0.5, cursor: 'not-allowed', color: '#718096', display: 'inline-flex', alignItems: 'center', gap: '4px' }} title="Completa los módulos anteriores para acceder">
          <MaterialIcon name="lock" color="#718096" size={18} />
          {title}
        </span>
      );
    }
  };

  // Helper function to render lesson link (blocked or unlocked based on module)
  const renderLessonLink = (moduleId, lessonId, lessonTitle) => {
    const unlocked = isModuleUnlocked(moduleId);
    if (unlocked) {
      return <Link to={`/courses/${id}/module/${moduleId}/lesson/${lessonId}`}>{lessonTitle}</Link>;
    } else {
      return (
        <span style={{ opacity: 0.5, cursor: 'not-allowed', color: '#718096', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <MaterialIcon name="lock" color="#718096" size={16} />
          {lessonTitle}
        </span>
      );
    }
  };

  // Función comentada por no uso actual
  // const markLessonCompleted = async (idx) => {
  //   if (!enrollment) return;
  //   const token = localStorage.getItem('token');
  //   const lessonId = lessonIdForIndex(idx);
  //   if (completedLessons.has(lessonId)) return;
  //   try {
  //     const res = await fetch(API_ENDPOINTS.COMPLETE_LESSON(enrollment.id), {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ lesson_id: lessonId, time_spent: 0 }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       setCompletedLessons(prev => new Set([...prev, lessonId]));
  //       if (typeof data.progress === 'number') setProgressPct(data.progress);
  //     } else {
  //       setMessage(data.error || 'No se pudo marcar la lección');
  //       setTimeout(() => setMessage(''), 3000);
  //     }
  //   } catch (e) {
  //     setMessage('Error de red al completar la lección');
  //     setTimeout(() => setMessage(''), 3000);
  //   }
  // };

  const handleGoToCourses = () => navigate('/courses');

  // Function to render stars for a rating
  const renderStars = (rating) => {
    // Asegurarse de que rating sea un número
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
    
    // Lógica de redondeo: si es >= x.3, mostrar x.5, si es < x.3, mostrar x completo
    const decimalPart = numericRating % 1;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = decimalPart >= 0.3;
    
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((s) => {
          if (s <= fullStars) {
            return (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" style={{ display: 'block' }}>
                <path d={starPath} />
              </svg>
            );
          } else if (s === fullStars + 1 && hasHalfStar) {
            return (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <defs>
                  <mask id={`review-star-mask-${id}-${s}`}>
                    <rect x="0" y="0" width="12" height="24" fill="white" />
                    <rect x="12" y="0" width="12" height="24" fill="black" />
                  </mask>
                </defs>
                <path d={starPath} fill="#ccc" />
                <path d={starPath} fill="#FFD700" mask={`url(#review-star-mask-${id}-${s})`} />
              </svg>
            );
          } else {
            return (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#ccc" style={{ display: 'block' }}>
                <path d={starPath} />
              </svg>
            );
          }
        })}
        <span style={{ marginLeft: '6px', color: '#666', fontSize: '0.85rem' }}>
          ({hasHalfStar ? (fullStars + 0.5).toFixed(1) : fullStars.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      // Asegurarse de que el rating sea un número válido (puede ser decimal)
      const ratingToSend = typeof rating === 'number' ? rating : parseFloat(rating) || 5;
      
      const res = await fetch(API_ENDPOINTS.COURSE_REVIEW(id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: ratingToSend, comment: comment || '' }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setReviewSubmitted(true);
        setHasReview(true);
        
        // Actualizar el curso con el rating actualizado si viene en la respuesta
        if (data.course) {
          setCourse(data.course);
        } else {
          // Si no viene, recargar el curso completo
          const courseRes = await fetch(`${API_ENDPOINTS.COURSES}/${id}`);
          if (courseRes.ok) {
            const courseData = await courseRes.json();
            setCourse(courseData);
          }
        }
        
        // Recargar las reseñas para incluir la nueva
        const reviewsRes = await fetch(API_ENDPOINTS.COURSE_REVIEWS(id));
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }
        setTimeout(() => setShowReviewModal(false), 3000);
      } else {
        // Mejor manejo de errores - mostrar mensaje más descriptivo
        const errorMessage = data.error || data.message || (data.errors && JSON.stringify(data.errors)) || 'Error al enviar la reseña';
        alert(errorMessage);
        console.error('Error al enviar reseña:', data);
      }
    } catch (e) {
      console.error('Error de red al enviar reseña:', e);
      alert('Error de red. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="course-view-page"><p>Cargando curso...</p></div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="course-view-page">
          <p>No se encontró el curso.</p>
          <button onClick={handleGoToCourses}>Volver a cursos</button>
        </div>
      </>
    );
  }

  const EnrollGate = () => {
    if (!isAuthenticated || user?.role !== 'user') {
      return (
        <div className="course-gate">
          <p>Inicia sesión como usuario para acceder al curso.</p>
          <div className="actions">
            <button onClick={() => navigate('/login')}>Iniciar sesión</button>
            <button onClick={handleGoToCourses}>Volver</button>
          </div>
        </div>
      );
    }

    if (!enrollment) {
      return (
        <div className="course-gate">
          <p>Debes inscribirte para acceder al contenido.</p>
          <div className="actions">
            <button onClick={handleGoToCourses}>Ir a inscribirme</button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="course-view-page">
        <div className="course-hero">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          {message && <div className="course-message">{message}</div>}
        </div>

        <EnrollGate />

        {enrollment && (
          <div className="course-content">
            <div className="course-progress">
              <div className="progress-bar" style={{ height: 10, background: '#eee', borderRadius: 6 }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: '#2f80ed',
                    borderRadius: 6,
                    transition: 'width 240ms ease',
                  }}
                />
              </div>
              <p style={{ marginTop: 8 }}>{progressPct}% completado</p>
            </div>
            {progressLoading ? (
              <div className="cpp-content" style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                Cargando...
              </div>
            ) : isCppCourse ? (
              <div className="cpp-content">

                <div className="module">
                  <h3>{renderModuleTitle('modulo-1', 'Módulo 1: Fundamentos de C++')}</h3>
                  <ul>
                    <li>{renderLessonLink('modulo-1', 'leccion-1-1', 'Configuración del entorno (compiladores, CMake, IDEs)')}</li>
                    <li>{renderLessonLink('modulo-1', 'leccion-1-2', 'Sintaxis básica y tipos')}</li>
                    <li>{renderLessonLink('modulo-1', 'leccion-1-3', 'Control de flujo y funciones')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('modulo-2', 'Módulo 2: POO en C++')}</h3>
                  <ul>
                    <li>{renderLessonLink('modulo-2', 'leccion-2-1', 'Clases, objetos, constructores y destructores')}</li>
                    <li>{renderLessonLink('modulo-2', 'leccion-2-2', 'Encapsulamiento, herencia, polimorfismo')}</li>
                    <li>{renderLessonLink('modulo-2', 'leccion-2-3', 'RAII y gestión de recursos')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('modulo-3', 'Módulo 3: STL y templates')}</h3>
                  <ul>
                    <li>{renderLessonLink('modulo-3', 'leccion-3-1', 'Contenedores (vector, map, unordered_map, etc.)')}</li>
                    <li>{renderLessonLink('modulo-3', 'leccion-3-2', 'Iteradores, algoritmos y rangos')}</li>
                    <li>{renderLessonLink('modulo-3', 'leccion-3-3', 'Plantillas, deducción de tipos y `constexpr`')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('modulo-4', 'Módulo 4: C++ moderno')}</h3>
                  <ul>
                    <li>{renderLessonLink('modulo-4', 'leccion-4-1', 'Smart pointers (`unique_ptr`, `shared_ptr`, `weak_ptr`)')}</li>
                    <li>{renderLessonLink('modulo-4', 'leccion-4-2', 'Lambdas, `auto`, `decltype`')}</li>
                    <li>{renderLessonLink('modulo-4', 'leccion-4-3', 'Buenas prácticas y patrones')}</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña
                    </button>
                  )}
                </div>
              </div>
            ) : isCSharpCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>{renderModuleTitle('csharp-1', 'Módulo 1: Introducción a C#')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-1', 'csharp-1-1', 'Sintaxis básica y tipos')}</li>
                    <li>{renderLessonLink('csharp-1', 'csharp-1-2', 'Estructuras de control y métodos')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-2', 'Módulo 2: POO en C#')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-2', 'csharp-2-1', 'Clases, propiedades y constructores')}</li>
                    <li>{renderLessonLink('csharp-2', 'csharp-2-2', 'Herencia e interfaces')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-3', 'Módulo 3: Colecciones y LINQ')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-3', 'csharp-3-1', 'List, Dictionary y IEnumerable')}</li>
                    <li>{renderLessonLink('csharp-3', 'csharp-3-2', 'Consultas LINQ y proyecciones')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-4', 'Módulo 4: Excepciones y depuración')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-4', 'csharp-4-1', 'Manejo de excepciones')}</li>
                    <li>{renderLessonLink('csharp-4', 'csharp-4-2', 'Depuración en visual studio')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-5', 'Módulo 5: Interfaces y delegados')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-5', 'csharp-5-1', 'Interfaces, records y patrones')}</li>
                    <li>{renderLessonLink('csharp-5', 'csharp-5-2', 'Delegados y eventos')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-6', 'Módulo 6: Tasks y async/Await')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-6', 'csharp-6-1', 'Programación asíncrona con Tasks')}</li>
                    <li>{renderLessonLink('csharp-6', 'csharp-6-2', 'Async/Await y buenas prácticas')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-7', 'Módulo 7: Entity framework')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-7', 'csharp-7-1', 'DbContext, entidades y migraciones')}</li>
                    <li>{renderLessonLink('csharp-7', 'csharp-7-2', 'Consultas, relaciones y rendimiento')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('csharp-8', 'Módulo 8: Proyecto .NET')}</h3>
                  <ul>
                    <li>{renderLessonLink('csharp-8', 'csharp-8-1', 'Arquitectura y capas')}</li>
                    <li>{renderLessonLink('csharp-8', 'csharp-8-2', 'Publicación y despliegue')}</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            ) : isCCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>{renderModuleTitle('c-1', 'Módulo 1: Introducción a C')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-1', 'c-1-1', 'Hola Mundo y compilación')}</li>
                    <li>{renderLessonLink('c-1', 'c-1-2', 'Entrada/salida básica')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-2', 'Módulo 2: Tipos y variables')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-2', 'c-2-1', 'Tipos primitivos y constantes')}</li>
                    <li>{renderLessonLink('c-2', 'c-2-2', 'Operadores y conversión')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-3', 'Módulo 3: Control de flujo')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-3', 'c-3-1', 'if/else y switch')}</li>
                    <li>{renderLessonLink('c-3', 'c-3-2', 'for, while, do-while')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-4', 'Módulo 4: Funciones')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-4', 'c-4-1', 'Declaración, ámbito y prototipos')}</li>
                    <li>{renderLessonLink('c-4', 'c-4-2', 'Parámetros por puntero y arrays')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-5', 'Módulo 5: Punteros')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-5', 'c-5-1', 'Dirección y desreferenciación')}</li>
                    <li>{renderLessonLink('c-5', 'c-5-2', 'Punteros y arrays/strings')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-6', 'Módulo 6: Memoria dinámica')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-6', 'c-6-1', 'malloc, calloc, realloc')}</li>
                    <li>{renderLessonLink('c-6', 'c-6-2', 'Gestión y fugas de memoria')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-7', 'Módulo 7: Estructuras de datos')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-7', 'c-7-1', 'struct y typedef')}</li>
                    <li>{renderLessonLink('c-7', 'c-7-2', 'Listas enlazadas básicas')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('c-8', 'Módulo 8: Proyecto final')}</h3>
                  <ul>
                    <li>{renderLessonLink('c-8', 'c-8-1', 'Diseño y plan de proyecto')}</li>
                    <li>{renderLessonLink('c-8', 'c-8-2', 'Compilación y entrega')}</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            ) : isSpringBootCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>{renderModuleTitle('spring-1', 'Módulo 1: Springboot Fundamentals')}</h3>
                  <ul>
                    <li>{renderLessonLink('spring-1', 'spring-1-1', 'Introducción a Springboot y configuración inicial')}</li>
                    <li>{renderLessonLink('spring-1', 'spring-1-2', 'Anotaciones principales y dependency injection')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('spring-2', 'Módulo 2: Spring Data JPA')}</h3>
                  <ul>
                    <li>{renderLessonLink('spring-2', 'spring-2-1', 'Configuración de JPA y entidades')}</li>
                    <li>{renderLessonLink('spring-2', 'spring-2-2', 'Repositorios y consultas personalizadas')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('spring-3', 'Módulo 3: Spring security')}</h3>
                  <ul>
                    <li>{renderLessonLink('spring-3', 'spring-3-1', 'Configuración básica de seguridad')}</li>
                    <li>{renderLessonLink('spring-3', 'spring-3-2', 'JWT y autenticación stateless')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('spring-4', 'Módulo 4: REST APIs avanzadas')}</h3>
                  <ul>
                    <li>{renderLessonLink('spring-4', 'spring-4-1', 'DTOs, validación y manejo de excepciones')}</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            ) : isReactAdvancedCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>{renderModuleTitle('react-1', 'Módulo 1: Hooks avanzados')}</h3>
                  <ul>
                    <li>{renderLessonLink('react-1', 'react-1-1', 'useReducer y gestión de estado complejo')}</li>
                    <li>{renderLessonLink('react-1', 'react-1-2', 'useMemo y useCallback para optimización')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('react-2', 'Módulo 2: Context API y estado elobal')}</h3>
                  <ul>
                    <li>{renderLessonLink('react-2', 'react-2-1', 'Crear y usar context')}</li>
                    <li>{renderLessonLink('react-2', 'react-2-2', 'Patrones avanzados con context')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('react-3', 'Módulo 3: Performance optimization')}</h3>
                  <ul>
                    <li>{renderLessonLink('react-3', 'react-3-1', 'React.memo y optimización de renders')}</li>
                  </ul>
                </div>

                <div className="module">
                  <h3>{renderModuleTitle('react-4', 'Módulo 4: Testing con Jest y RTL')}</h3>
                  <ul>
                    <li>{renderLessonLink('react-4', 'react-4-1', 'Configuración y primeros tests')}</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            ) : getAllModuleIds.length > 0 ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                {getAllModuleIds.map(moduleId => {
                  const module = moduleContent[moduleId];
                  if (!module) return null;
                  return (
                    <div key={moduleId} className="module">
                      <h3>{renderModuleTitle(moduleId, module.title)}</h3>
                      <ul>
                        {module.lessons.map(lesson => (
                          <li key={lesson.id}>
                            {renderLessonLink(moduleId, lesson.id, lesson.title)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="cpp-content">
                <h2>Lecciones</h2>
                {Array.isArray(course.lessons) && course.lessons.length > 0 ? (
                  <ol className="lesson-list">
                      {course.lessons.map((l, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link to={`/courses/${id}/module/general/lesson/lesson-${idx + 1}`} style={{ flex: 1 }}>
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>Este curso aún no tiene lecciones definidas.</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 12 }}>
                  <button className="btn-secondary" onClick={() => navigate('/courses')}>Volver a cursos</button>
                  {progressPct === 100 && !hasReview && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowReviewModal(true)}
                    >
                      Dejar reseña
                    </button>
                  )}
                  {progressPct === 100 && hasReview && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Reseña ya enviada
                    </button>
                  )}
                  {progressPct < 100 && (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      title="Completa el curso al 100% para dejar una reseña"
                    >
                      Dejar reseña (Bloqueado)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sección de Reseñas */}
      <div className="course-reviews-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1a202c', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MaterialIcon name="rate_review" color="#007AFF" size={28} />
            Reseñas de estudiantes
          </h2>
          {course && course.ratings_count > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {renderStars(course.rating)}
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                ({course.ratings_count} {course.ratings_count === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          )}
        </div>
        
        {loadingReviews ? (
          <div className="reviews-container" style={{ display: 'block' }}>
            <div style={{ padding: '40px', textAlign: 'center', color: '#718096', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              Cargando reseñas...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-container">
            <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
              <MaterialIcon name="rate_review" color="#ccc" size={48} />
              <p style={{ marginTop: '16px', fontSize: '1.1rem' }}>Aún no hay reseñas para este curso</p>
              <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#a0aec0' }}>Sé el primero en dejar una reseña</p>
            </div>
          </div>
        ) : (
          <div className="reviews-container">
            {reviews.map((review) => {
              const profilePicUrl = review.user?.profile_picture && review.user?.id 
                ? API_ENDPOINTS.USER_PROFILE_PICTURE(review.user.id)
                : null;
              const truncatedComment = review.comment && review.comment.length > 100 
                ? review.comment.substring(0, 100) + '...'
                : review.comment;
              
              return (
                <div key={review.id} className="review-item">
                  <div className="review-avatar">
                    {profilePicUrl ? (
                      <AuthImage 
                        src={profilePicUrl}
                        alt={review.user?.name || 'Usuario'}
                        className="review-avatar-img"
                        token={token}
                        fallback="/imagenes/iconoUsuario.png"
                      />
                    ) : (
                      <MaterialIcon name="account_circle" color="#ffffff" size={32} />
                    )}
                  </div>
                  <div className="review-user-info">
                    <h3>{review.user?.name || 'Usuario anónimo'}</h3>
                    <p>
                      <MaterialIcon name="schedule" color="#a0aec0" size={14} />
                      {new Date(review.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="review-rating-badge">
                    {renderStars(review.rating)}
                  </div>
                  {truncatedComment && (
                    <div className="review-comment-box">
                      <p style={{ margin: 0, color: '#4a5568', lineHeight: 1.6, fontSize: '0.9rem', textAlign: 'center' }}>
                        "{truncatedComment}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Reseña */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cuéntanos tu experiencia</h2>
            </div>
            <div className="modal-body">
              {!reviewSubmitted ? (
                <>
                  <p>Has completado el curso <strong>{course?.title}</strong>. ¿Qué te ha parecido?</p>
                  <div className="rating-input">
                    <p>Tu valoración:</p>
                    <div className="stars" style={{ display: 'flex', gap: '4px', fontSize: '2rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => {
                        const handleStarClick = (e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const isLeftHalf = clickX < rect.width / 2;
                          const newRating = isLeftHalf ? s - 0.5 : s;
                          setRating(newRating);
                        };
                        
                        const isFull = rating >= s;
                        const isHalf = rating >= s - 0.5 && rating < s;
                        
                        // SVG star path
                        const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
                        
                        return (
                          <span 
                            key={s} 
                            onClick={handleStarClick}
                            style={{ 
                              cursor: 'pointer', 
                              display: 'inline-block',
                              width: '2rem',
                              height: '2rem',
                              position: 'relative'
                            }}
                            title={`${s - 0.5} o ${s} estrellas`}
                          >
                            {isFull ? (
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFD700" style={{ display: 'block' }}>
                                <path d={starPath} />
                              </svg>
                            ) : isHalf ? (
                              <svg width="32" height="32" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                <defs>
                                  <mask id={`half-star-mask-${id}-${s}`}>
                                    <rect x="0" y="0" width="12" height="24" fill="white" />
                                    <rect x="12" y="0" width="12" height="24" fill="black" />
                                  </mask>
                                </defs>
                                <path d={starPath} fill="#ccc" />
                                <path d={starPath} fill="#FFD700" mask={`url(#half-star-mask-${id}-${s})`} />
                              </svg>
                            ) : (
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="#ccc" style={{ display: 'block' }}>
                                <path d={starPath} />
                              </svg>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="comment-input" style={{ marginTop: '20px' }}>
                    <textarea 
                      placeholder="Deja un comentario sobre tu experiencia (opcional, máximo 100 caracteres)..."
                      value={comment}
                      onChange={e => {
                        if (e.target.value.length <= 100) {
                          setComment(e.target.value);
                        }
                      }}
                      maxLength={100}
                      style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit', fontSize: 'inherit' }}
                      rows={5}
                    />
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#718096', marginTop: '8px' }}>
                      {comment.length}/100 caracteres
                    </div>
                  </div>
                </>
              ) : (
                <div className="review-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <MaterialIcon name="check_circle" color="#007AFF" size={24} />
                  <p style={{ margin: 0 }}>¡Gracias por tu reseña! Tu opinión nos ayuda a mejorar.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {!reviewSubmitted ? (
                <>
                  <button className="btn-secondary" onClick={() => setShowReviewModal(false)}>Cerrar</button>
                  <button className="btn-primary" onClick={handleSubmitReview}>Enviar Reseña</button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setShowReviewModal(false)}>Continuar</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón para subir arriba */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Subir al inicio"
        >
          <MaterialIcon name="arrow_upward" color="#ffffff" size={24} />
        </button>
      )}
    </>
  );
};

export default CourseView;


