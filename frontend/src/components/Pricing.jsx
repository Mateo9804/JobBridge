import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import './Pricing.css';
import { useNavigate } from 'react-router-dom';
function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userType, setUserType] = useState(user?.role || 'user');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const companyPlans = [
    {
      id: 'company-basic',
      name: 'Plan básico',
      price: 'Gratis',
      period: 'Siempre',
      features: [
        'Hasta 2 ofertas de trabajo',
        'Acceso básico a candidatos',
        'Soporte por email',
        'Panel de administración básico'
      ],
      limitations: [
        'Sin ofertas destacadas (próximamente)',
        'Sin filtros avanzados (próximamente)',
        'Sin reportes detallados (próximamente)'
      ],
      popular: false
    },
    {
      id: 'company-pro',
      name: 'Plan profesional',
      price: '14.99€',
      period: '/mes',
      features: [
        'Ofertas ilimitadas',
        'Ofertas destacadas',
        'Filtros avanzados de candidatos',
        'Reportes detallados',
        'Soporte prioritario'
      ],
      limitations: [],
      popular: true
    }
  ];

  const userPlans = [
    {
      id: 'user-basic',
      name: 'Plan básico',
      price: 'Gratis',
      period: 'Siempre',
      features: [
        'Postularse a 2 ofertas por mes',
        'Perfil básico',
        'Búsqueda de empleos',
        'Notificaciones básicas'
      ],
      limitations: [
        'Sin acceso a ofertas avanzadas (próximamente)',
        'Sin filtros avanzados (próximamente)',
        'Sin reportes de aplicación (próximamente)'
      ],
      popular: false
    },
    {
      id: 'user-pro',
      name: 'Plan profesional',
      price: '9.99€',
      period: '/mes',
      features: [
        'Postulaciones ilimitadas',
        'Acceso a funcionalidades avanzadas',
        'Filtros avanzados de búsqueda',
        'Reportes de aplicación',
        'Perfil destacado'
      ],
      limitations: [],
      popular: true
    }
  ];

  const handleUserTypeChange = (type) => {
    if (!isAuthenticated()) {
      setUserType(type);
      setSelectedPlan(null);
      setSuccess('');
      setError('');
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setSuccess('');
    setError('');
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      setError('Por favor selecciona un plan');
      return;
    }

    const isPro = selectedPlan.includes('-pro');
    
    // Si ya tiene plan profesional y selecciona el plan profesional
    if (isPro && user?.plan === 'professional') {
      setSuccess('Ya tienes el Plan Profesional activo. ¡Disfruta de todas las funcionalidades!');
      setTimeout(() => setSuccess(''), 3500);
      return;
    }
    
    if (isPro) {
      if (!isAuthenticated()) {
        setError('Debes iniciar sesión para suscribirte al Plan Profesional');
        setTimeout(() => setError(''), 3000);
        return;
      }
      navigate('/checkout', { state: { plan: selectedPlan } });
      return;
    }

    setSuccess('El Plan gratuito ya está activo. No hay que hacer nada.');
    setTimeout(() => setSuccess(''), 3500);
  };

  let effectiveUserType = user?.role || userType;
  const plans = effectiveUserType === 'company' ? companyPlans : userPlans;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="pricing-page">
      <Header />
      <div className="pricing-container">
        <div className="pricing-hero">
          <h1>Planes y precios</h1>
          <p className="hero-subtitle">
            Elige el plan perfecto para tu {effectiveUserType === 'company' ? 'empresa' : 'carrera profesional'}
          </p>
        </div>

        <div className="pricing-content">
          {!isAuthenticated() && (
            <div className="plan-toggle">
              <div 
                className={`toggle-option ${userType === 'user' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('user')}
              >
                <span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px', color: '#007AFF' }}>person</span>
                  Planes para Usuarios
                </span>
              </div>
              <div 
                className={`toggle-option ${userType === 'company' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('company')}
              >
                <span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px', color: '#007AFF' }}>business</span>
                  Planes para Empresas
                </span>
              </div>
            </div>
          )}

          {success && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠</div>
              <p>{error}</p>
            </div>
          )}

          {/* Grid de Planes */}
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="popular-badge">Más Popular</div>
                )}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>

                <div className="plan-features">
                  <h4>Incluye:</h4>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="plan-limitations">
                    <h4>Limitaciones:</h4>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index}>
                          <span className="limitation-icon">✗</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button 
                  className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''} ${plan.id.includes('-pro') && user?.plan === 'professional' ? 'active-plan' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {plan.id.includes('-pro') && user?.plan === 'professional' 
                    ? 'Plan Activo' 
                    : selectedPlan === plan.id 
                    ? 'Seleccionado' 
                    : 'Seleccionar Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Botón de Suscripción y formulario de pago */}
          {selectedPlan && (
            <div className="subscription-section">
              <div className="selected-plan-info">
                <h3>Plan seleccionado: {plans.find(p => p.id === selectedPlan)?.name}</h3>
                <p>Precio: {plans.find(p => p.id === selectedPlan)?.price} {plans.find(p => p.id === selectedPlan)?.period}</p>
              </div>

              <button
                className="subscribe-btn"
                onClick={handleContinue}
              >
                {selectedPlan.includes('-pro') ? 'Ver Plan Profesional' : 'Continuar con Plan Gratuito'}
              </button>
            </div>
          )}

          {/* Información Adicional */}
          <div className="pricing-info">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>verified</span>
                </div>
                <h4>Plan gratuito</h4>
                <p>El proyecto funciona con un único plan gratuito.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>hourglass_top</span>
                </div>
                <h4>Plan profesional</h4>
                <p>Todavía no está disponible. Se mostrará aquí cuando esté listo.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>support_agent</span>
                </div>
                <h4>Soporte</h4>
                <p>Si necesitás ayuda, contactanos desde la sección de Contacto.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>account_balance_wallet</span>
                </div>
                <h4>Transparencia</h4>
                <p>No se realiza ningún pago ni cobro desde la plataforma.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>security</span>
                </div>
                <h4>Seguridad</h4>
                <p>Tus datos están protegidos con los más altos estándares de seguridad.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <span className="material-symbols-outlined" style={{ color: '#007AFF', fontSize: '32px' }}>update</span>
                </div>
                <h4>Actualizaciones constantes</h4>
                <p>Mejoramos continuamente la plataforma con nuevas funcionalidades.</p>
              </div>
            </div>
          </div>

          {/* FAQ de Precios */}
          <div className="pricing-faq">
            <h2>Preguntas frecuentes sobre precios</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>¿Hay más de un plan?</h4>
                <p>No. Por ahora el proyecto ofrece únicamente el Plan gratuito.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Cuándo estará disponible el Plan profesional?</h4>
                <p>Todavía no está disponible. Se habilitará en una futura versión.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Se realizan pagos dentro de la plataforma?</h4>
                <p>No. No hay procesamiento de pagos ni cobros.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Mi cuenta puede perder acceso por no pagar?</h4>
                <p>No. Al ser un plan gratuito, no hay suscripciones ni vencimientos por pago.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing; 