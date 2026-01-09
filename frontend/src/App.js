'use strict';

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Register from './components/Register';
import Login from './components/Login';
import JobApplication from './components/JobApplication';
import Companies from './components/Companies';
import About from './components/About';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import Account from './components/Account';
import Header from './components/Header';
import AuthImage from './components/AuthImage';
import { API_ENDPOINTS } from './config/api';
import './App.css';
import CompanyProfile from './components/CompanyProfile';
import EditCompanyProfile from './components/EditCompanyProfile';
import JobHelper from './components/JobHelper';
import Courses from './components/Courses';
import CourseView from './components/CourseView';
import LessonContent from './components/LessonContent';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import UserProfileForm from './components/UserProfileForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      <JobHelper />
      <div className="main-content">
        {/* Formulario de onboarding para usuarios que no han completado su perfil */}
        {user && user.role === 'user' && !user.is_profile_complete && (
          <UserProfileForm />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<JobApplication />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<AccountView />} />
          <Route path="/account/edit" element={<Account />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/company/edit" element={<EditCompanyProfile />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseView />} />
          <Route path="/courses/:courseId/module/:moduleId" element={<LessonContent />} />
          <Route path="/courses/:courseId/module/:moduleId/lesson/:lessonId" element={<LessonContent />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function AccountView() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCvData, setHasCvData] = useState(false);

  const getProfilePicUrl = (profilePicture) => {
    if (!profilePicture) return '/imagenes/iconoUsuario.png';
    // Usar endpoint de la API para servir la imagen
    return `${API_ENDPOINTS.PROFILE_PICTURE}?t=${Date.now()}`;
  };
  
  const handleCvDownload = async (e) => {
    e.preventDefault();
    if (!profile) return;
    
    try {
      const controller = new AbortController();
      const res = await fetch(API_ENDPOINTS.PROFILE_CV_DOWNLOAD, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = `CV_${profile.name || 'usuario'}.pdf`;
        
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (fileNameMatch) {
            fileName = fileNameMatch[1];
          }
        } else if (profile.cv) {
          fileName = profile.cv.split('/').pop() || fileName;
        }
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Error al descargar el CV');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        alert('Error al descargar el CV');
      }
    }
  };

  // Redirigir al inicio si el usuario se desloguea
  useEffect(() => {
    if (!user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!isMounted) return;
        
        if (res.status === 401) {
          if (logout) logout();
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProfile(data);
          }
        }
        
        const cvRes = await fetch(API_ENDPOINTS.PROFILE_CV_DATA_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cvRes.ok && isMounted) {
          setHasCvData(true);
        }
      } catch (e) {
        if (isMounted) {
          console.error('Error loading profile:', e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  if (loading) return (<><Header /><div className="account-page"><p>Cargando...</p></div></>);
  if (!profile) return (<><Header /><div className="account-page"><p>No se pudo cargar el perfil.</p></div></>);

  const isCompany = profile.role === 'company';
  const getEmploymentStatusText = () => {
    return profile.is_working ? 'Estoy trabajando' : 'No estoy trabajando';
  };

  return (
    <>
      <Header />
      <div className="account-page view-mode">
        <h2>Mi perfil</h2>
        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            <AuthImage
              src={getProfilePicUrl(profile.profile_picture)}
              alt={isCompany ? "Logo de la empresa" : "Foto de perfil"}
              className="profile-pic"
              token={token}
            />
          </div>
        </div>
        <div className="account-info-section">
          {isCompany ? (
            // Vista para empresa
            <>
              <div className="account-info-row">
                <label>Nombre de la cuenta:</label>
                <span>{profile.name || 'No especificado'}</span>
              </div>
              <div className="account-info-row">
                <label>Nombre de la empresa:</label>
                <span>{profile.company_name || 'No especificado'}</span>
              </div>
              <div className="account-info-row">
                <label>Email:</label>
                <span>{profile.email || 'No especificado'}</span>
              </div>
              <div className="account-info-row">
                <label>Descripción:</label>
                <span style={{ whiteSpace: 'pre-wrap' }}>{profile.description || 'Sin descripción'}</span>
              </div>
              {profile.website && (
                <div className="account-info-row">
                  <label>Sitio web:</label>
                  <span>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF' }}>
                      {profile.website}
                    </a>
                  </span>
                </div>
              )}
              {profile.location && (
                <div className="account-info-row">
                  <label>Ubicación:</label>
                  <span>{profile.location}</span>
                </div>
              )}
            </>
          ) : (
            // Vista para usuario normal
            <>
              <div className="account-info-row">
                <label>Nombre:</label>
                <span>{profile.name || 'No especificado'}</span>
              </div>
              <div className="account-info-row">
                <label>Email:</label>
                <span>{profile.email || 'No especificado'}</span>
              </div>
              <div className="account-info-row">
                <label>Estado laboral:</label>
                <span>{getEmploymentStatusText()}</span>
              </div>
              <div className="account-info-row">
                <label>Descripción:</label>
                <span style={{ whiteSpace: 'pre-wrap' }}>{profile.description || 'Sin descripción'}</span>
              </div>
              {(profile.cv || hasCvData) && (
                <div className="account-info-row">
                  <label>CV:</label>
                  <button
                    onClick={handleCvDownload}
                    className="upload-cv-btn"
                    type="button"
                  >
                    Descargar CV
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;