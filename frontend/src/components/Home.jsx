import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home(props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const carouselSlides = useMemo(() => {
    const guestSlides = [
      {
        title: "Encuentra tu trabajo ideal",
        subtitle: "Conectamos talento con oportunidades. JobBridge es la plataforma que une profesionales con las mejores empresas.",
        buttons: [
          { text: "Buscar empleos", link: "/jobs", primary: true },
          { text: "Crear perfil", link: "/register", primary: false }
        ]
      },
      {
        title: "Empleos personalizados",
        subtitle: "Encuentra ofertas que se adapten a tu perfil y experiencia profesional. Miles de oportunidades te esperan.",
        buttons: [
          { text: "Explorar empleos", link: "/jobs", primary: true },
          { text: "Ver más", link: "/about", primary: false }
        ]
      },
      {
        title: "Empresas verificadas",
        subtitle: "Trabaja con empresas confiables y reconocidas en el mercado. Conectamos profesionales con las mejores oportunidades.",
        buttons: [
          { text: "Ver empresas", link: "/companies", primary: true },
          { text: "Registrarse", link: "/register", primary: false }
        ]
      },
      {
        title: "Proceso rápido",
        subtitle: "Aplica a múltiples empleos con un solo clic y recibe respuestas rápidas. Tu próximo trabajo está a un clic de distancia.",
        buttons: [
          { text: "Empezar ahora", link: "/register", primary: true },
          { text: "Aprender más", link: "/courses", primary: false }
        ]
      }
    ];

    const userSlides = [
      {
        title: "Bienvenido de vuelta",
        subtitle: "Explora las mejores oportunidades laborales que se adaptan a tu perfil. Tu próximo trabajo te está esperando.",
        buttons: [
          { text: "Ver empleos", link: "/jobs", primary: true },
          { text: "Mi perfil", link: "/account", primary: false }
        ]
      },
      {
        title: "Empleos personalizados para ti",
        subtitle: "Encuentra ofertas que coinciden con tu experiencia y habilidades. Miles de oportunidades disponibles.",
        buttons: [
          { text: "Buscar empleos", link: "/jobs", primary: true },
          { text: "Ver cursos", link: "/courses", primary: false }
        ]
      },
      {
        title: "Mejora tus habilidades",
        subtitle: "Accede a cursos especializados y aumenta tus posibilidades de conseguir el trabajo de tus sueños.",
        buttons: [
          { text: "Explorar cursos", link: "/courses", primary: true },
          { text: "Ver empresas", link: "/companies", primary: false }
        ]
      },
      {
        title: "Aplica rápido y fácil",
        subtitle: "Aplica a múltiples empleos con un solo clic. Gestiona tus postulaciones desde tu perfil.",
        buttons: [
          { text: "Ver empleos", link: "/jobs", primary: true },
          { text: "Mi cuenta", link: "/account", primary: false }
        ]
      }
    ];

    const companySlides = [
      {
        title: "Gestiona tu empresa",
        subtitle: "Publica ofertas de trabajo y encuentra el talento que necesitas. Conecta con profesionales calificados.",
        buttons: [
          { text: "Publicar empleo", link: "/jobs", primary: true },
          { text: "Mi perfil", link: "/account", primary: false }
        ]
      },
      {
        title: "Encuentra el talento ideal",
        subtitle: "Accede a miles de profesionales que buscan nuevas oportunidades. Filtra por habilidades y experiencia.",
        buttons: [
          { text: "Ver candidatos", link: "/jobs", primary: true },
          { text: "Ver empresas", link: "/companies", primary: false }
        ]
      },
      {
        title: "Planes y beneficios",
        subtitle: "Por ahora el proyecto funciona con un único plan gratuito. El plan profesional se mostrará como \"próximamente\".",
        buttons: [
          { text: "Ver planes", link: "/pricing", primary: true },
          { text: "Mi cuenta", link: "/account", primary: false }
        ]
      },
      {
        title: "Optimiza tu contratación",
        subtitle: "Publica empleos, recibe aplicaciones y gestiona todo desde un solo lugar. Simplifica tu proceso de selección.",
        buttons: [
          { text: "Publicar empleo", link: "/jobs", primary: true },
          { text: "Ver estadísticas", link: "/account", primary: false }
        ]
      }
    ];

    if (!isAuthenticated() || !user) {
      return guestSlides;
    }
    
    if (user.role === 'company') {
      return companySlides;
    }
    
    return userSlides;
  }, [user, isAuthenticated]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, [carouselSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  return (
    <div className="home">
      <Header />

      {/* Hero Section with Animated Background */}
      <section className="hero">
        <div className="hero-animated-bg">
          <div className="bg-gradient-1"></div>
          <div className="bg-gradient-2"></div>
          <div className="bg-gradient-3"></div>
          <div className="bg-gradient-4"></div>
        </div>
        
        <div className="hero-carousel">
          <div className="carousel-container">
            {carouselSlides.map((slide, index) => (
              <div 
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="carousel-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <div className="hero-buttons">
                    {slide.buttons.map((btn, btnIndex) => (
                      <Link 
                        key={btnIndex}
                        to={btn.link} 
                        className={btn.primary ? "home-btn-primary" : "home-btn-secondary"}
                      >
                        {btn.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-controls">
            <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
              ←
            </button>
            <div className="carousel-dots">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
              →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>¿Por qué elegir JobBridge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '3rem' }}>target</span>
              </div>
              <h3>Empleos personalizados</h3>
              <p>Encuentra ofertas que se adapten a tu perfil y experiencia profesional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '3rem' }}>business</span>
              </div>
              <h3>Empresas verificadas</h3>
              <p>Trabaja con empresas confiables y reconocidas en el mercado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '3rem' }}>bolt</span>
              </div>
              <h3>Proceso rápido</h3>
              <p>Aplica a múltiples empleos con un solo clic y recibe respuestas rápidas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          {!isAuthenticated() || !user ? (
            <>
              <h2>¿Listo para dar el siguiente paso?</h2>
              <p>Únete a miles de profesionales que ya encontraron su trabajo ideal en JobBridge.</p>
              <Link to="/register" className="btn-primary">Empezar ahora</Link>
            </>
          ) : user.role === 'user' ? (
            <>
              <h2>¿Buscas nuevas oportunidades?</h2>
              <p>Explora los mejores empleos disponibles y encuentra tu próximo trabajo ideal.</p>
              <Link to="/jobs" className="btn-primary">Ver empleos</Link>
            </>
          ) : (
            <>
              <h2>¿Listo para encontrar talento?</h2>
              <p>Publica tus ofertas de trabajo y conecta con los mejores profesionales del mercado.</p>
              <Link to="/jobs" className="btn-primary">Publicar empleo</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home; 