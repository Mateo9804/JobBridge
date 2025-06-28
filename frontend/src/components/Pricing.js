import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import './Pricing.css';

function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userType, setUserType] = useState('user'); // 'user' or 'company'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const companyPlans = [
    {
      id: 'company-basic',
      name: 'Plan Básico',
      price: 'Gratis',
      period: 'Siempre',
      features: [
        'Hasta 2 ofertas de trabajo',
        'Acceso básico a candidatos',
        'Soporte por email',
        'Panel de administración básico'
      ],
      limitations: [
        'Sin ofertas destacadas',
        'Sin acceso a filtros avanzados',
        'Sin reportes detallados'
      ],
      popular: false
    },
    {
      id: 'company-pro',
      name: 'Plan Profesional',
      price: '$2.99',
      period: 'por mes',
      features: [
        'Ofertas ilimitadas',
        'Ofertas destacadas (5 por mes)',
        'Filtros avanzados de candidatos',
        'Reportes detallados',
        'Soporte prioritario',
        'Panel de administración avanzado',
        'Análisis de candidatos',
        'Notificaciones en tiempo real'
      ],
      limitations: [],
      popular: true
    }
  ];

  const userPlans = [
    {
      id: 'user-basic',
      name: 'Plan Básico',
      price: 'Gratis',
      period: 'Siempre',
      features: [
        'Postularse a 2 ofertas por mes',
        'Perfil básico',
        'Búsqueda de empleos',
        'Notificaciones básicas'
      ],
      limitations: [
        'Sin acceso a ofertas premium',
        'Sin filtros avanzados',
        'Sin reportes de aplicación'
      ],
      popular: false
    },
    {
      id: 'user-pro',
      name: 'Plan Profesional',
      price: '$2.99',
      period: 'por mes',
      features: [
        'Postulaciones ilimitadas',
        'Acceso a ofertas premium',
        'Filtros avanzados de búsqueda',
        'Reportes de aplicación',
        'Perfil destacado',
        'Notificaciones prioritarias',
        'Mensajería directa con empresas',
        'Currículum personalizado'
      ],
      limitations: [],
      popular: true
    }
  ];

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setSelectedPlan(null);
    setSuccess('');
    setError('');
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setSuccess('');
    setError('');
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Por favor selecciona un plan');
      return;
    }

    if (!isAuthenticated()) {
      setError('Debes iniciar sesión para suscribirte');
      return;
    }

    setLoading(true);
    setError('');

    // Simular proceso de pago
    setTimeout(() => {
      setLoading(false);
      setSuccess('¡Suscripción exitosa! Tu plan ha sido activado.');
      setSelectedPlan(null);
      
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    }, 3000);
  };

  const plans = userType === 'company' ? companyPlans : userPlans;

  return (
    <div className="pricing-page">
      <Header />
      <div className="pricing-container">
        <div className="pricing-hero">
          <h1>Planes y Precios</h1>
          <p className="hero-subtitle">
            Elige el plan perfecto para tu {userType === 'company' ? 'empresa' : 'carrera profesional'}
          </p>
        </div>

        <div className="pricing-content">
          {/* Toggle para cambiar entre planes */}
          <div className="plan-toggle">
            <div 
              className={`toggle-option ${userType === 'user' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('user')}
            >
              <span>👤 Planes para Usuarios</span>
            </div>
            <div 
              className={`toggle-option ${userType === 'company' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('company')}
            >
              <span>🏢 Planes para Empresas</span>
            </div>
          </div>

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
                  className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Botón de Suscripción */}
          {selectedPlan && (
            <div className="subscription-section">
              <div className="selected-plan-info">
                <h3>Plan Seleccionado: {plans.find(p => p.id === selectedPlan)?.name}</h3>
                <p>Precio: {plans.find(p => p.id === selectedPlan)?.price} {plans.find(p => p.id === selectedPlan)?.period}</p>
              </div>
              
              <button 
                className="subscribe-btn"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Suscribirse Ahora'}
              </button>
            </div>
          )}

          {/* Información Adicional */}
          <div className="pricing-info">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">🔒</div>
                <h4>Pago Seguro</h4>
                <p>Todos los pagos están protegidos con encriptación SSL de 256 bits</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">🔄</div>
                <h4>Cancelación Gratuita</h4>
                <p>Puedes cancelar tu suscripción en cualquier momento sin penalización</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">💳</div>
                <h4>Múltiples Métodos</h4>
                <p>Aceptamos tarjetas de crédito, débito y transferencias bancarias</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📞</div>
                <h4>Soporte 24/7</h4>
                <p>Nuestro equipo está disponible para ayudarte en cualquier momento</p>
              </div>
            </div>
          </div>

          {/* FAQ de Precios */}
          <div className="pricing-faq">
            <h2>Preguntas Frecuentes sobre Precios</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>¿Puedo cambiar de plan en cualquier momento?</h4>
                <p>Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán en el próximo ciclo de facturación.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Hay un período de prueba gratuito?</h4>
                <p>Sí, ofrecemos un período de prueba gratuito de 7 días para todos nuestros planes pagos.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Qué métodos de pago aceptan?</h4>
                <p>Aceptamos todas las tarjetas de crédito y débito principales, PayPal y transferencias bancarias.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Puedo cancelar mi suscripción?</h4>
                <p>Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Los precios incluyen IVA?</h4>
                <p>Sí, todos los precios mostrados incluyen el IVA correspondiente según la legislación española.</p>
              </div>
              
              <div className="faq-item">
                <h4>¿Ofrecen descuentos para empresas grandes?</h4>
                <p>Sí, ofrecemos descuentos especiales para empresas con más de 50 empleados. Contáctanos para más información.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing; 