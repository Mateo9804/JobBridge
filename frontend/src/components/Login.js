import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión');
        console.error('Error en login:', response.status, data);
        return;
      }
      
      // Si el login es exitoso, guardar datos en el contexto
      login(data.user, data.access_token);
      
      // Redirigir a la página de empleos
      navigate('/jobs');
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <h2>Iniciar Sesión en JobBridge</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="login-footer">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Login; 