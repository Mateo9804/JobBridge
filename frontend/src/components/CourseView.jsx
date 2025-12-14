import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './CourseView.css';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPct, setProgressPct] = useState(0);

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

  const enrollment = useMemo(() => {
    return myEnrollments.find((en) => String(en.course_id) === String(id));
  }, [myEnrollments, id]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!enrollment) return;
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

  const lessonIdForIndex = (idx) => `lesson-${idx + 1}`;

  const markLessonCompleted = async (idx) => {
    if (!enrollment) return;
    const token = localStorage.getItem('token');
    const lessonId = lessonIdForIndex(idx);
    if (completedLessons.has(lessonId)) return;
    try {
      const res = await fetch(API_ENDPOINTS.COMPLETE_LESSON(enrollment.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson_id: lessonId, time_spent: 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        if (typeof data.progress === 'number') setProgressPct(data.progress);
      } else {
        setMessage(data.error || 'No se pudo marcar la lección');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      setMessage('Error de red al completar la lección');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleGoToCourses = () => navigate('/courses');

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
            {isCppCourse ? (
              <div className="cpp-content">

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/modulo-1`}>
                      Módulo 1: Fundamentos de C++
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-1/lesson/leccion-1-1`}>
                        Configuración del entorno (compiladores, CMake, IDEs)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-1/lesson/leccion-1-2`}>
                        Sintaxis básica y tipos
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-1/lesson/leccion-1-3`}>
                        Control de flujo y funciones
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/modulo-2`}>
                      Módulo 2: POO en C++
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-2/lesson/leccion-2-1`}>
                        Clases, objetos, constructores y destructores
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-2/lesson/leccion-2-2`}>
                        Encapsulamiento, herencia, polimorfismo
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-2/lesson/leccion-2-3`}>
                        RAII y gestión de recursos
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/modulo-3`}>
                      Módulo 3: STL y templates
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-3/lesson/leccion-3-1`}>
                        Contenedores (vector, map, unordered_map, etc.)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-3/lesson/leccion-3-2`}>
                        Iteradores, algoritmos y rangos
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-3/lesson/leccion-3-3`}>
                        Plantillas, deducción de tipos y `constexpr`
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/modulo-4`}>
                      Módulo 4: C++ moderno
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-4/lesson/leccion-4-1`}>
                        Smart pointers (`unique_ptr`, `shared_ptr`, `weak_ptr`)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-4/lesson/leccion-4-2`}>
                        Lambdas, `auto`, `decltype`
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/modulo-4/lesson/leccion-4-3`}>
                        Buenas prácticas y patrones
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
                </div>
              </div>
            ) : isCSharpCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-1`}>
                      Módulo 1: Introducción a C#
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-1/lesson/csharp-1-1`}>
                        Sintaxis básica y tipos
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-1/lesson/csharp-1-2`}>
                        Estructuras de control y métodos
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-2`}>
                      Módulo 2: POO en C#
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-2/lesson/csharp-2-1`}>
                        Clases, propiedades y constructores
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-2/lesson/csharp-2-2`}>
                        Herencia e interfaces
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-3`}>
                      Módulo 3: Colecciones y LINQ
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-3/lesson/csharp-3-1`}>
                        List, Dictionary y IEnumerable
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-3/lesson/csharp-3-2`}>
                        Consultas LINQ y proyecciones
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-4`}>
                      Módulo 4: Excepciones y depuración
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-4/lesson/csharp-4-1`}>
                        Manejo de excepciones
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-4/lesson/csharp-4-2`}>
                        Depuración en visual studio
                      </Link>
                      </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-5`}>
                      Módulo 5: Interfaces y delegados
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-5/lesson/csharp-5-1`}>
                        Interfaces, records y patrones
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-5/lesson/csharp-5-2`}>
                        Delegados y eventos
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-6`}>
                      Módulo 6: Tasks y async/Await
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-6/lesson/csharp-6-1`}>
                        Programación asíncrona con Tasks
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-6/lesson/csharp-6-2`}>
                        Async/Await y buenas prácticas
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-7`}>
                      Módulo 7: Entity framework
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-7/lesson/csharp-7-1`}>
                        DbContext, entidades y migraciones
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-7/lesson/csharp-7-2`}>
                        Consultas, relaciones y rendimiento
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/csharp-8`}>
                      Módulo 8: Proyecto .NET
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-8/lesson/csharp-8-1`}>
                        Arquitectura y capas
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/csharp-8/lesson/csharp-8-2`}>
                        Publicación y despliegue
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
                </div>
              </div>
            ) : isCCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-1`}>
                      Módulo 1: Introducción a C
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-1/lesson/c-1-1`}>
                        Hola Mundo y compilación
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-1/lesson/c-1-2`}>
                        Entrada/salida básica
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-2`}>
                      Módulo 2: Tipos y variables
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-2/lesson/c-2-1`}>
                        Tipos primitivos y constantes
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-2/lesson/c-2-2`}>
                        Operadores y conversión
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-3`}>
                      Módulo 3: Control de flujo
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-3/lesson/c-3-1`}>
                        if/else y switch
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-3/lesson/c-3-2`}>
                        for, while, do-while
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-4`}>
                      Módulo 4: Funciones
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-4/lesson/c-4-1`}>
                        Declaración, ámbito y prototipos
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-4/lesson/c-4-2`}>
                        Parámetros por puntero y arrays
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-5`}>
                      Módulo 5: Punteros
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-5/lesson/c-5-1`}>
                        Dirección y desreferenciación
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-5/lesson/c-5-2`}>
                        Punteros y arrays/strings
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-6`}>
                      Módulo 6: Memoria dinámica
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-6/lesson/c-6-1`}>
                        malloc, calloc, realloc
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-6/lesson/c-6-2`}>
                        Gestión y fugas de memoria
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-7`}>
                      Módulo 7: Estructuras de datos
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-7/lesson/c-7-1`}>
                        struct y typedef
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-7/lesson/c-7-2`}>
                        Listas enlazadas básicas
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/c-8`}>
                      Módulo 8: Proyecto final
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/c-8/lesson/c-8-1`}>
                        Diseño y plan de proyecto
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/c-8/lesson/c-8-2`}>
                        Compilación y entrega
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
                </div>
              </div>
            ) : isSpringBootCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/spring-1`}>
                      Módulo 1: Springboot Fundamentals
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/spring-1/lesson/spring-1-1`}>
                        Introducción a Springboot y configuración inicial
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/spring-1/lesson/spring-1-2`}>
                        Anotaciones principales y dependency injection
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/spring-2`}>
                      Módulo 2: Spring Data JPA
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/spring-2/lesson/spring-2-1`}>
                        Configuración de JPA y entidades
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/spring-2/lesson/spring-2-2`}>
                        Repositorios y consultas personalizadas
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/spring-3`}>
                      Módulo 3: Spring security
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/spring-3/lesson/spring-3-1`}>
                        Configuración básica de seguridad
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/spring-3/lesson/spring-3-2`}>
                        JWT y autenticación stateless
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/spring-4`}>
                      Módulo 4: REST APIs avanzadas
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/spring-4/lesson/spring-4-1`}>
                        DTOs, validación y manejo de excepciones
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
                </div>
              </div>
            ) : isReactAdvancedCourse ? (
              <div className="cpp-content">
                <h2>Lecciones por módulo</h2>
                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/react-1`}>
                      Módulo 1: Hooks avanzados
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/react-1/lesson/react-1-1`}>
                        useReducer y gestión de estado complejo
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/react-1/lesson/react-1-2`}>
                        useMemo y useCallback para optimización
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/react-2`}>
                      Módulo 2: Context API y estado elobal
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/react-2/lesson/react-2-1`}>
                        Crear y usar context
                      </Link>
                    </li>
                    <li>
                      <Link to={`/courses/${id}/module/react-2/lesson/react-2-2`}>
                        Patrones avanzados con context
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/react-3`}>
                      Módulo 3: Performance optimization
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/react-3/lesson/react-3-1`}>
                        React.memo y optimización de renders
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="module">
                  <h3>
                    <Link to={`/courses/${id}/module/react-4`}>
                      Módulo 4: Testing con Jest y RTL
                    </Link>
                  </h3>
                  <ul>
                    <li>
                      <Link to={`/courses/${id}/module/react-4/lesson/react-4-1`}>
                        Configuración y primeros tests
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
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
                <div className="cta">
                  <button onClick={() => navigate('/courses')}>Volver a cursos</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CourseView;


