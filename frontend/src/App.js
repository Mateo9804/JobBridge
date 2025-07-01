import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { API_ENDPOINTS } from './config/api';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
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
            <Route path="/account" element={<AccountView />} />
            <Route path="/account/edit" element={<Account />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function AccountView() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          if (logout) logout();
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {}
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (loading) return (<><Header /><div className="account-page"><p>Cargando...</p></div></>);
  if (!profile) return (<><Header /><div className="account-page"><p>No se pudo cargar el perfil.</p></div></>);

  return (
    <>
      <Header />
      <div className="account-page">
        <h2>Mi Perfil</h2>
        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            <img
              src={profile.profile_picture ? `/storage/${profile.profile_picture}` : '/imagenes/iconoUsuario.png'}
              alt="Foto de perfil"
              className="profile-pic"
            />
          </div>
        </div>
        <div className="account-info-section">
          <div className="account-info-row">
            <label>Nombre:</label>
            <span>{profile.name}</span>
          </div>
          <div className="account-info-row">
            <label>Descripción:</label>
            <span>{profile.description || 'Sin descripción'}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyAccount() { return <></>; }

export default App;
