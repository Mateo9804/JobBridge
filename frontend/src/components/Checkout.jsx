import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Pricing.css';
import './Checkout.css';

const PLAN_LOOKUP = {
  'user-pro': {
    name: 'Plan profesional (Usuario)',
    price: 9.99,
    features: [
      'Postulaciones ilimitadas',
      'Acceso a funcionalidades avanzadas',
      'Filtros avanzados de búsqueda',
      'Reportes de aplicación',
      'Perfil destacado'
    ]
  },
  'company-pro': {
    name: 'Plan profesional (Empresa)',
    price: 14.99,
    features: [
      'Ofertas ilimitadas',
      'Ofertas destacadas',
      'Filtros avanzados de candidatos',
      'Reportes detallados',
      'Soporte prioritario'
    ]
  },
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useAuth();
  const planKey = location.state?.plan || 'user-pro';
  const planData = PLAN_LOOKUP[planKey] || PLAN_LOOKUP['user-pro'];
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingEmail: user?.email || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success'

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/pricing');
    }
    window.scrollTo({ top: 0 });
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted.substring(0, 19) }));
      return;
    }
    
    // Formatear fecha de expiración (MM/YY)
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length >= 2) {
        formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted.substring(0, 5) }));
      return;
    }
    
    // CVV solo números, máximo 3 dígitos
    if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').substring(0, 3) }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate || expiryDate.length !== 5) {
      return false;
    }
    
    const [month, year] = expiryDate.split('/');
    
    // Validar formato
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }
    
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt('20' + year, 10);
    
    // Validar que sean números válidos
    if (isNaN(expiryMonth) || isNaN(expiryYear)) {
      return false;
    }
    
    // Validar que el mes esté entre 1 y 12
    if (expiryMonth < 1 || expiryMonth > 12) {
      return false;
    }
    
    // Obtener la fecha actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() devuelve 0-11
    
    // Validar que la fecha no esté en el pasado
    if (expiryYear < currentYear) {
      return false;
    }
    
    if (expiryYear === currentYear && expiryMonth < currentMonth) {
      return false;
    }
    
    return true;
  };

  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      setError('Por favor ingresa un número de tarjeta válido');
      return false;
    }
    if (!formData.cardName || formData.cardName.length < 3) {
      setError('Por favor ingresa el nombre del titular');
      return false;
    }
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      setError('Por favor ingresa una fecha de expiración válida (MM/YY)');
      return false;
    }
    if (!validateExpiryDate(formData.expiryDate)) {
      setError('La fecha de expiración no puede estar en el pasado. Por favor ingresa una fecha válida (MM/YY)');
      return false;
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      setError('Por favor ingresa un CVV válido');
      return false;
    }
    if (!formData.billingEmail || !formData.billingEmail.includes('@')) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      // Simular procesamiento de pago (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar plan en el backend
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PROFILE_UPDATE_PLAN, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: 'professional' })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el plan');
      }

      const updatedUser = await response.json();
      
      // Actualizar usuario en el contexto
      if (setUser) {
        setUser(updatedUser.user || updatedUser);
      }
      localStorage.setItem('user', JSON.stringify(updatedUser.user || updatedUser));

      setPaymentStep('success');
      setSuccess(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/pricing');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Error al procesar el pago. Por favor, intenta de nuevo.');
      setPaymentStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <Header />
        <div className="checkout-page" style={{padding:20, background:'#f8f9fa', flex:1}}>
          <div className="summary-panel" style={{background: '#fff', borderRadius: 12, boxShadow: '0 0 4px #ccc', padding: 40, maxWidth: 600, margin: '0 auto', textAlign: 'center'}}>
            <div className="processing-spinner" style={{marginBottom: 20}}>
              <div className="spinner"></div>
            </div>
            <h2 style={{marginTop: 0}}>Procesando pago...</h2>
            <p style={{color: '#666'}}>Por favor espera mientras procesamos tu pago</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <Header />
        <div className="checkout-page" style={{padding:20, background:'#f8f9fa', flex:1}}>
          <div className="summary-panel" style={{background: '#fff', borderRadius: 12, boxShadow: '0 0 4px #ccc', padding: 40, maxWidth: 600, margin: '0 auto', textAlign: 'center'}}>
            <div style={{fontSize: '64px', color: '#4CAF50', marginBottom: 20}}>✓</div>
            <h2 style={{marginTop: 0, color: '#4CAF50'}}>¡Pago exitoso!</h2>
            <p style={{color: '#666', marginBottom: 30}}>
              Tu plan profesional ha sido activado correctamente. 
              Ahora puedes disfrutar de todas las funcionalidades premium.
            </p>
            <p style={{color: '#999', fontSize: '14px'}}>Redirigiendo a la página de planes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header />
      <div className="checkout-page" style={{padding:20, background:'#f8f9fa', flex:1}}>
        <div className="checkout-container">
          {/* Resumen del plan */}
          <div className="checkout-summary">
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              title="Volver"
              className="checkout-close-btn"
            >
              ×
            </button>

            <h2>Resumen del plan</h2>
            <div className="plan-summary-card">
              <h3>{planData.name}</h3>
              <div className="plan-price-large">
                <span className="price-amount">€{planData.price.toFixed(2)}</span>
                <span className="price-period">/mes</span>
              </div>
              
              <div className="plan-features-summary">
                <h4>Incluye:</h4>
                <ul>
                  {planData.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Formulario de pago */}
          <div className="checkout-form-container">
            <h2>Información de pago</h2>

            {error && (
              <div className="checkout-error">
                <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle', marginRight: '8px'}}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} className="payment-form">
              <div className="form-group">
                <label>Número de tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre del titular</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de expiración</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email de facturación</label>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="payment-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>€{planData.price.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>IVA (21%):</span>
                  <span>€{(planData.price * 0.21).toFixed(2)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total:</span>
                  <span>€{(planData.price * 1.21).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="payment-submit-btn"
                disabled={loading}
              >
                {loading ? 'Procesando...' : `Pagar €${(planData.price * 1.21).toFixed(2)}`}
              </button>

              <p className="payment-security-note">
                <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle', marginRight: '4px'}}>lock</span>
                Tu información está protegida.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
