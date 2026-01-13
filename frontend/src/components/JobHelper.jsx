import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './JobHelper.css';

const MaterialIcon = ({ name, color = '#007AFF', size = 24, className = '' }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={{ color, fontSize: size, verticalAlign: 'middle' }}
  >
    {name}
  </span>
);

const JobHelper = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '¡Hola! Soy JobHelper, tu asistente de JobBridge. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const previousUserIdRef = useRef(null);
  const isOpenRef = useRef(false);

  const handleToggle = () => {
    if (isOpen) {
      // Cerrar con animación
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
        isOpenRef.current = false;
      }, 300);
    } else {
      // Abrir
      setIsOpen(true);
      isOpenRef.current = true;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Actualizar la referencia cuando isOpen cambia
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Resetear el chat cuando el usuario cambia o se desloguea
  useEffect(() => {
    const currentUserId = user?.id || null;
    
    // Si el usuario cambió (incluyendo cuando se desloguea, que user será null)
    if (previousUserIdRef.current !== currentUserId) {
      // Resetear mensajes al mensaje inicial
      setMessages([
        {
          role: 'bot',
          content: '¡Hola! Soy JobHelper, tu asistente de JobBridge. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date()
        }
      ]);
      // Cerrar el chat si está abierto
      if (isOpenRef.current) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
          isOpenRef.current = false;
        }, 300);
      }
      // Actualizar la referencia del usuario anterior
      previousUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  // Generar respuestas inteligentes basadas en palabras clave
  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.match(/hola|hi|buenos días|buenas tardes|buenas noches|saludo/i)) {
      return {
        role: 'bot',
        content: '¡Hola! Encantado de ayudarte. Puedo ayudarte con:\n\n• Búsqueda de empleos personalizada\n• Tips para mejorar tu CV\n• Recomendaciones de cursos\n• Consejos para entrevistas\n• Guía de navegación\n\n¿Con qué quieres comenzar?',
        timestamp: new Date()
      };
    }

    if (message.match(/ayuda|help|asistencia|guía|manual/i)) {
      return {
        role: 'bot',
        content: 'Puedo ayudarte con:\n\n• Búsqueda de empleos: Buscar trabajos según tus habilidades y experiencia\n• Mejorar CV: Consejos para destacar tu perfil profesional\n• Entrevistas: Tips para impresionar a los reclutadores\n• Cursos: Recomendaciones de formación para tu perfil\n• Navegación: Guía para usar las funcionalidades de JobBridge\n\n¿Qué te gustaría saber?',
        timestamp: new Date()
      };
    }

    if (message.match(/empleo|trabajo|buscar trabajo|ofertas|vacantes|busco/i)) {
      return {
        role: 'bot',
        content: 'Para buscar empleos:\n\n1. Ve a la página de "Ofertas de Trabajo" (Jobs)\n2. Usa los filtros para encontrar tu trabajo ideal:\n   • Tipo de trabajo (Frontend, Backend, Full Stack, etc.)\n   • Experiencia requerida\n   • Ubicación\n\n3. Lee la descripción completa\n4. Inscríbete con tu CV actualizado\n\nTip: Crea un perfil completo para aumentar tus posibilidades.',
        timestamp: new Date()
      };
    }

    if (message.match(/cv|curriculum|resumen|carta de presentación|perfil profesional/i)) {
      return {
        role: 'bot',
        content: 'Tips para mejorar tu CV:\n\n• Formato: Mantén un diseño limpio y profesional\n• Secciones clave:\n   • Información de contacto\n   • Perfil profesional breve\n   • Experiencia laboral (más reciente primero)\n   • Educación\n   • Habilidades técnicas\n   • Idiomas\n\n• Destaca tus logros con números concretos\n• Personaliza tu CV según el trabajo\n• Actualiza tu CV regularmente\n\n¿Necesitas ayuda con alguna sección específica?',
        timestamp: new Date()
      };
    }

    if (message.match(/entrevista|entrevistar|reclutador|preparación|entrevista laboral/i)) {
      return {
        role: 'bot',
        content: 'Tips para entrevistas:\n\n• Preparación:\n   • Investiga la empresa\n   • Revisa tu CV\n   • Prepara preguntas inteligentes\n\n• Durante la entrevista:\n   • Llega puntual\n   • Muestra entusiasmo\n   • Da ejemplos concretos de tus logros\n   • Habla con claridad y confianza\n\n• Preguntas comunes:\n   • "Cuéntame sobre ti"\n   • "¿Por qué quieres este trabajo?"\n   • "¿Cuáles son tus fortalezas?"\n\n• Al final: Pregunta sobre el siguiente paso\n\n¡Mucha suerte!',
        timestamp: new Date()
      };
    }

    if (message.match(/curso|cursos|capacitación|formación|aprender|estudiar|formación profesional/i)) {
      return {
        role: 'bot',
        content: 'Sobre los cursos:\n\nJobBridge ofrece cursos gratuitos para todos los usuarios.\n\nTambién vas a ver algunos cursos marcados como “Premium (Próximamente)”: esos contenidos aún no están disponibles.\n\nRecomendaciones:\n   • Identifica tus áreas de mejora\n   • Elige cursos relevantes para tu perfil\n   • Añade certificados a tu perfil\n   • ¡Actualiza tus habilidades constantemente!\n\n¿Qué tecnología te interesa aprender?',
        timestamp: new Date()
      };
    }

    if (message.match(/navegación|navegar|usar|funcionalidad|cómo uso|dónde/i)) {
      return {
        role: 'bot',
        content: 'Guía de navegación JobBridge:\n\nPáginas principales:\n   • Home: Página de inicio con información general\n   • Jobs: Explora ofertas de trabajo\n   • Companies: Conoce las empresas\n   • About: Sobre JobBridge\n   • Contact: Contacta con nosotros\n   • Pricing: Planes y precios\n\nSi eres candidato:\n   • Crea tu perfil con tu CV\n   • Busca empleos y aplícate\n   • Completa cursos para mejorar\n\nSi eres empresa:\n   • Publica ofertas (hasta 2 gratis)\n   • Gestiona postulaciones\n   • Conecta con talento\n\n¿Qué funcionalidad te interesa?',
        timestamp: new Date()
      };
    }

    if (message.match(/premium|vip|plan|suscripción|precio|pagado/i)) {
      return {
        role: 'bot',
        content: 'Planes en JobBridge:\n\nPor ahora, el proyecto funciona únicamente con el **Plan gratuito**.\n\nEl “Plan profesional” está planificado, pero **todavía no está disponible**.\n\nSi querés, te puedo contar qué incluye hoy el plan gratuito (usuarios o empresas).',
        timestamp: new Date()
      };
    }

    if (message.match(/programación|desarrollar|código|react|javascript|python|java|html|css|tecnología/i)) {
      return {
        role: 'bot',
        content: 'Sobre tecnología en JobBridge:\n\nPerfiles más demandados:\n   • Frontend (React, JavaScript, HTML/CSS)\n   • Backend (Node.js, Python, Java)\n   • Full Stack (Ambos)\n   • Mobile (React Native, Flutter)\n   • DevOps\n\nRecomendación de cursos:\n   • Si eres junior: Fundamentos básicos\n   • Si eres mid-level: Profundiza en tu stack\n   • Si eres senior: Liderazgo y arquitectura\n\nTip: Mantente actualizado con las últimas tecnologías del mercado\n\n¿Qué stack usas?',
        timestamp: new Date()
      };
    }

    if (message.match(/gracias|thank you|bye|adios|hasta luego|chao/i)) {
      return {
        role: 'bot',
        content: '¡De nada!\n\nSi necesitas algo más, no dudes en preguntarme. ¡Estoy aquí para ayudarte en tu búsqueda de empleo!\n\n¡Mucha suerte en JobBridge!',
        timestamp: new Date()
      };
    }

    return {
      role: 'bot',
      content: 'No estoy seguro de entender esa pregunta.\n\nPuedo ayudarte con:\n• Búsqueda de empleos\n• Mejorar tu CV\n• Tips para entrevistas\n• Recomendaciones de cursos\n• Navegación en la plataforma\n\n¿En qué más puedo ayudarte?',
      timestamp: new Date()
    };
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const quickReplies = [
    '¿Cómo busco empleos?',
    'Tips para entrevistas',
    'Recomendaciones de cursos',
    'Ayuda con mi CV'
  ];

  const handleQuickReply = (reply) => {
    setInput(reply);
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`job-helper-toggle ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="JobHelper Chat"
      >
        {isOpen ? (
          <MaterialIcon name="close" color="white" size={28} />
        ) : (
          <MaterialIcon name="chat" color="white" size={28} />
        )}
      </button>

      {/* Chat window */}
      {(isOpen || isAnimating) && (
        <div className={`job-helper-container ${isAnimating ? 'closing' : 'opening'}`}>
          <div className="job-helper-header">
            <div className="job-helper-title">
              <MaterialIcon name="smart_toy" color="white" size={32} className="job-helper-icon" />
              <div>
                <h3>JobHelper</h3>
                <p>Tu asistente de JobBridge</p>
              </div>
            </div>
          </div>

          <div className="job-helper-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`job-helper-message ${msg.role}`}>
                <div className="job-helper-message-content">
                  {msg.role === 'bot' ? (
                    <span className="job-helper-bot-icon">
                      <MaterialIcon name="smart_toy" color="#667eea" size={20} />
                    </span>
                  ) : (
                    <span className="job-helper-user-icon">
                      <MaterialIcon name="person" color="white" size={20} />
                    </span>
                  )}
                  <div className="job-helper-message-text">{msg.content}</div>
                </div>
                <span className="job-helper-timestamp">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="job-helper-quick-replies">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                className="job-helper-quick-reply"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <form className="job-helper-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="job-helper-input"
            />
            <button type="submit" className="job-helper-send">
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default JobHelper;
