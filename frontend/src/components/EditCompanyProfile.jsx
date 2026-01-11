import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import Header from './Header';
import { API_ENDPOINTS, STORAGE_BASE_URL } from '../config/api';

const DEFAULT_LOGO = '/imagenes/iconoUsuario.png';

function EditCompanyProfile() {
  const { token, user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    logo: '',
    description: '',
    website: '',
    location: '',
  });
  const [logoPreview, setLogoPreview] = useState(DEFAULT_LOGO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Lista de provincias comentada por no uso actual
  // const provincias = [
  //   'Madrid',
  //   'Barcelona',
  //   'Valencia',
  //   'Sevilla',
  //   'Bilbao',
  //   'Málaga',
  //   'Zaragoza',
  //   'Alicante'
  // ];

  // Redirigir al inicio si el usuario se desloguea
  useEffect(() => {
    if (!user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || '',
            company_name: data.company_name || '',
            logo: '',
            description: data.description || '',
            website: data.website || '',
            location: data.location || '',
          });
          setLogoPreview(
            data.profile_picture_url || data.logo_url || DEFAULT_LOGO
          );
        }
      } catch (e) {}
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      if (form.name !== undefined && form.name !== null && form.name !== '') formData.append('name', form.name);
      if (form.company_name !== undefined && form.company_name !== null && form.company_name !== '') formData.append('company_name', form.company_name);
      if (form.description !== undefined && form.description !== null && form.description !== '') formData.append('description', form.description);
      if (form.website !== undefined && form.website !== null && form.website !== '') formData.append('website', form.website);
      if (form.location && form.location !== '') formData.append('location', form.location);
      if (form.logo && form.logo instanceof File) {
        formData.append('profile_picture', form.logo);
      }
      const res = await fetch(API_ENDPOINTS.PROFILE_UPDATE, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Perfil actualizado correctamente');
        setTimeout(() => setSuccess(''), 2500);
      } else {
        const data = await res.json();
        setError(data.message || 'Error al actualizar el perfil');
      }
    } catch (e) {
      setError('Error de conexión');
    }
    setSaving(false);
  };

  if (loading) return (<><Header /><div className="account-page"><div className="account-container"><p>Cargando...</p></div></div></>);

  return (
    <>
      <Header />
      <div className="account-page company-edit">
        <div className="account-container company-edit-card">
          <h2>Editar perfil de empresa</h2>
          <form className="account-form company-form" onSubmit={handleSubmit}>
            <div className="company-avatar">
              <img
                src={logoPreview}
                alt="Logo de la empresa"
                className="profile-picture"
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_LOGO; }}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden-file-input"
                ref={fileInputRef}
                onChange={handleLogoChange}
              />
              <button type="button" className="edit-pic-btn" onClick={() => fileInputRef.current.click()}>
                Cambiar logo
              </button>
            </div>

            <div className="company-grid">
              <div className="form-group">
                <label>Nombre de la cuenta</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nombre de la empresa</label>
                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} />
              </div>
              <div className="form-group wide">
                <label>Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
              </div>
              <div className="form-group">
                <label>Sitio web</label>
                <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://tusitio.com" />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="account-actions company-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditCompanyProfile; 