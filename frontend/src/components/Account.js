import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Header from './Header';
import './Account.css';
import { useNavigate } from 'react-router-dom';

function Account() {
  const { user, setUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();
  const cvInputRef = useRef();

  // Cargar datos reales al montar
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          if (logout) logout();
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setName(data.name || '');
          setDescription(data.description || '');
          setPreviewPic(data.profile_picture ? `/storage/${data.profile_picture}` : null);
          setCvFile(data.cv ? { name: data.cv.split('/').pop() } : null);
          if (setUser) setUser(data);
        }
      } catch (e) {}
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
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
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (setUser) setUser(data);
        setPreviewPic(data.profile_picture ? `/storage/${data.profile_picture}` : null);
        setCvFile(data.cv ? { name: data.cv.split('/').pop() } : null);
        alert('Perfil actualizado');
      } else {
        alert('Error al guardar');
      }
    } catch (e) {
      alert('Error de red');
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
              <img
                src={previewPic || '/imagenes/iconoUsuario.png'}
                alt="Foto de perfil"
                className="profile-pic"
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
                style={{ minHeight: 0 }}
              />
            </div>
            <div className="account-info-row">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="account-info-row">
              <label>CV:</label>
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
              {cvFile && <span className="cv-file-name">{cvFile.name}</span>}
            </div>
            <div className="account-info-row">
              <label>Descripción:</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                className="description-textarea"
                rows={4}
              />
            </div>
          </div>
          <button type="submit" className="save-account-btn" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </form>
      </div>
    </>
  );
}

export default Account; 