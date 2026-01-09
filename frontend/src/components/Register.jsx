import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { API_ENDPOINTS } from '../config/api';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: '',
    company_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.role) {
      setError('Por favor, selecciona si eres Usuario o Empresa.');
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      
      navigate('/login');
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Header />
      <div className="register-container">
        <h2>Registro en JobBridge</h2>
        <form onSubmit={handleSubmit}>
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
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
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
        {error && (
          <div className="error-message">
            {error}
            {error.includes('Ya existe una cuenta') && (
              <div className="error-suggestion">
                <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
              </div>
            )}
          </div>
        )}
        <p className="register-footer">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Register; 