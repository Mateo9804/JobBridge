import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' o 'register'
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: '',
    company_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: '', company_name: '' });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión');
        console.error('Error en login:', response.status, data);
        return;
      }
      
      login(data.user, data.access_token);
      
      onClose();
      
      setForm({ name: '', email: '', password: '', role: '', company_name: '' });
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.role) {
      setError('Por favor, selecciona si eres Usuario o Empresa.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    
    try {
      // Enviar solo los campos necesarios, sin confirmPassword
      const { confirmPassword, ...registerData } = form;
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error_type === 'email_exists') {
          setError(data.message);
        } else if (data.errors && data.errors.email) {
          setError(data.errors.email[0]);
        } else if (data.errors && data.errors.role) {
          setError(data.errors.role[0]);
        } else {
          setError(data.message || 'Error al registrarse');
        }
        console.error('Error en registro:', response.status, data);
        return;
      }
      
      setMode('login');
      setError('');
      setForm({ name: '', email: form.email, password: '', confirmPassword: '', role: '', company_name: '' });
      setShowPassword(false);
      setShowConfirmPassword(false);
      setError('¡Registro exitoso! Por favor, inicia sesión.');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '', role: '', company_name: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <button className="auth-modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Iniciar sesión en JobBridge' : 'Registro en JobBridge'}</h2>
          <div className="auth-modal-tabs">
            <button 
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Iniciar sesión
            </button>
            <button 
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Registrarse
            </button>
          </div>
        </div>

        <div className="auth-modal-body">
          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repetir contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="form-group">
                <label htmlFor="role">Tipo de cuenta *</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="user">Usuario</option>
                  <option value="company">Empresa</option>
                </select>
              </div>
              
              {form.role === 'company' && (
                <input
                  type="text"
                  name="company_name"
                  placeholder="Nombre de la empresa"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              )}
              
              <button type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
          )}
          
          {error && (
            <div className={`auth-error-message ${error.includes('exitoso') ? 'success' : ''}`}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
