import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Header from './Header';
import Toast from './Toast';
import AuthImage from './AuthImage';
import CVBuilder from './CVBuilder';
import './Account.css';
import { useNavigate } from 'react-router-dom';

function Account() {
  const { user, setUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showCvBuilder, setShowCvBuilder] = useState(false);
  const fileInputRef = useRef();
  const cvInputRef = useRef();


  const profilePicUrl = useMemo(() => {
    // Si hay una preview local (data: URL), usarla
    if (previewPic && previewPic.startsWith('data:')) {
      return previewPic;
    }
    // Si hay una preview establecida (URL del servidor), usarla
    if (previewPic && !previewPic.startsWith('data:')) {
      return previewPic;
    }
    // Si el usuario tiene profile_picture_url, usarla directamente
    if (user?.profile_picture_url) {
      return user.profile_picture_url;
    }
    // Fallback a imagen por defecto
    return '/imagenes/iconoUsuario.png';
  }, [previewPic, user?.profile_picture_url]);

  useEffect(() => {
    // Solo establecer previewPic si no hay una ya establecida y no estamos guardando
    // Usar profile_picture_url si está disponible
    if (user?.profile_picture_url && !previewPic && !loading && !saving) {
      setPreviewPic(user.profile_picture_url);
    }
    // Si previewPic está null pero tenemos profile_picture_url, establecerlo
    if (!previewPic && user?.profile_picture_url && !loading && !saving) {
      setPreviewPic(user.profile_picture_url);
    }
  }, [user?.profile_picture_url, loading, previewPic, saving]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          if (logout) logout();
          setToastMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          setShowToast(true);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setName(data.name || '');
          setDescription(data.description || '');
          setIsWorking(data.is_working || false);
          // Usar profile_picture_url si está disponible
          if (data.profile_picture_url) {
            setPreviewPic(data.profile_picture_url);
          } else {
            setPreviewPic(null);
          }
          setCvFile(data.cv ? { name: data.cv.split('/').pop() } : null);
          if (setUser) setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (e) {}
      setLoading(false);
    };
    fetchProfile();
  }, [token, logout, navigate, setUser]);

  useEffect(() => {
    if (user && user.role === 'company') {
      navigate('/company/edit', { replace: true });
      return;
    }
  }, [user, navigate]);

  // Redirigir al inicio si el usuario se desloguea
  useEffect(() => {
    if (!user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_working', isWorking);
    if (profilePic) formData.append('profile_picture', profilePic);
    if (cvFile && cvFile instanceof File) formData.append('cv', cvFile);
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE_UPDATE, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.status === 401) {
        if (logout) logout();
        setToastMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setShowToast(true);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        
        setName(data.name || '');
        setDescription(data.description || '');
        setIsWorking(data.is_working || false);
        
        setProfilePic(null);
        
        // Actualizar el usuario
        if (setUser) setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Actualizar preview con la URL del servidor
        if (data.profile_picture_url) {
          setPreviewPic(data.profile_picture_url);
        } else {
          setPreviewPic(null);
        }
        
        setCvFile(data.cv ? { name: data.cv.split('/').pop() } : null);
        
        setToastMessage('Perfil actualizado');
        setShowToast(true);
      } else {
        setToastMessage('Error al guardar');
        setShowToast(true);
      }
    } catch (e) {
      setToastMessage('Error de red');
      setShowToast(true);
    }
    setSaving(false);
  };

  if (loading) return (<><Header /><div className="account-page"><p>Cargando...</p></div></>);

  return (
    <>
      <Header />
      <div className="account-page">
        <h2>Editar Perfil</h2>
        <form className="account-form" onSubmit={handleSave}>
          <div className="profile-pic-section">
            <div className="profile-pic-wrapper">
              <AuthImage
                src={profilePicUrl}
                alt="Foto de perfil"
                className="profile-pic"
                token={token}
              />
              <button type="button" onClick={() => fileInputRef.current.click()} className="edit-pic-btn">
                Cambiar foto
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
          <div className="account-info-section">
            <div className="account-info-row">
              <label>Nombre:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="description-textarea"
                style={{ minHeight: 0, padding: '10px 14px' }}
              />
            </div>
            <div className="account-info-row">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="account-info-row">
              <label>Estado laboral:</label>
              <select
                value={isWorking ? 'working' : 'not_working'}
                onChange={e => setIsWorking(e.target.value === 'working')}
                className="description-textarea"
                style={{ minHeight: 0, padding: '10px 14px' }}
              >
                <option value="not_working">No estoy trabajando</option>
                <option value="working">Estoy trabajando</option>
              </select>
            </div>
            <div className="account-info-row">
              <label>CV:</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowCvBuilder(true)} className="upload-cv-btn" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none' }}>
                  Crear CV
                </button>
                <button type="button" onClick={() => cvInputRef.current.click()} className="upload-cv-btn">
                  {cvFile ? 'Cambiar CV' : 'Subir CV'}
                </button>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  ref={cvInputRef}
                  onChange={handleCvChange}
                />
              </div>
            </div>
            <div className="account-info-row">
              <label>Descripción:</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                className="description-textarea"
                style={{ padding: '10px 14px' }}
                rows={4}
              />
            </div>
          </div>
          <button type="submit" className="save-account-btn" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </form>
      </div>
      <Toast 
        message={toastMessage} 
        isOpen={showToast} 
        onClose={() => setShowToast(false)} 
      />
      {showCvBuilder && (
        <CVBuilder
          onClose={() => setShowCvBuilder(false)}
          onSave={(updatedUser) => {
            setToastMessage('CV guardado exitosamente');
            setShowToast(true);
            if (updatedUser) {
              setUser(updatedUser);
            }
          }}
        />
      )}
    </>
  );
}

export default Account; 