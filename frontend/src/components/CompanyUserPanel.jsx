import React, { useState, useEffect } from 'react';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import AuthImage from './AuthImage';
import './CompanyUserPanel.css';

function CompanyUserPanel() {
  const { token, user } = useAuth();
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTech, setFilterTech] = useState('');
  const [filterExperience, setFilterExperience] = useState('todos');
  const [filterSkill, setFilterSkill] = useState('todos');
  const [selectedUserContact, setSelectedUserContact] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.COMPANY_OFFICIAL_USERS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const error = await response.json();
          addNotification(error.message || 'Error al cargar usuarios oficiales', 'error');
        }
      } catch (error) {
        console.error('Error fetching official users:', error);
        addNotification('Error de conexión', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.plan === 'professional') {
      fetchUsers();
    }
  }, [token, user, addNotification]);

  const filteredUsers = users.filter(u => {
    const matchesTech = !filterTech || 
      (u.technologies || []).some(t => t.toLowerCase().includes(filterTech.toLowerCase()));
    
    const matchesExp = filterExperience === 'todos' || u.experience_years === filterExperience;
    
    const matchesSkill = filterSkill === 'todos' || (u.skills || []).includes(filterSkill);

    return matchesTech && matchesExp && matchesSkill;
  });

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (user?.plan !== 'professional') {
    return (
      <div className="premium-lock">
        <h2>Panel de Usuarios Oficiales</h2>
        <p>Esta sección es exclusiva para empresas con <strong>Plan Profesional</strong>.</p>
        <p>Podrás ver a todos los talentos registrados y verificados de la plataforma.</p>
      </div>
    );
  }

  return (
    <div className="user-panel-container">
      <div className="panel-header">
        <h2>Talentos de JobBridge</h2>
        <p>Usuarios oficiales que han completado su perfil profesional.</p>
      </div>

      <div className="panel-filters">
        <div className="filter-row">
          <input 
            type="text" 
            placeholder="Buscar por tecnología..." 
            value={filterTech}
            onChange={(e) => setFilterTech(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterExperience} 
            onChange={(e) => setFilterExperience(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Toda la experiencia</option>
            <option value="Sin experiencia">Sin experiencia</option>
            <option value="Menos de 1 año">Menos de 1 año</option>
            <option value="1-2 años">1-2 años</option>
            <option value="3-5 años">3-5 años</option>
            <option value="Más de 5 años">Más de 5 años</option>
          </select>

          <select 
            value={filterSkill} 
            onChange={(e) => setFilterSkill(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todas las áreas</option>
            <option value="Desarrollo Frontend">Frontend</option>
            <option value="Desarrollo Backend">Backend</option>
            <option value="Desarrollo Full Stack">Full Stack</option>
            <option value="Desarrollo Mobile">Mobile</option>
            <option value="UI/UX Design">UI/UX</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Cargando talentos...</p>
      ) : (
        <div className="users-list-grid">
          {filteredUsers.length === 0 ? (
            <p className="no-users">No se encontraron usuarios que coincidan con la búsqueda.</p>
          ) : (
            filteredUsers.map(u => (
              <div key={u.id} className="user-official-card">
                <div className="user-card-header">
                  <AuthImage 
                    src={u.profile_picture ? API_ENDPOINTS.USER_PROFILE_PICTURE(u.id) : null} 
                    alt={u.name} 
                    className="user-avatar"
                    token={token}
                  />
                  <div className="user-basic-info">
                    <h3>{u.full_name || u.name}</h3>
                    <p className="user-education">{u.education_level}</p>
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="info-item">
                    <strong>Edad / Nacimiento:</strong>
                    <span>{calculateAge(u.birthday)} años ({u.birthday ? new Date(u.birthday).toLocaleDateString() : 'N/A'})</span>
                  </div>

                  <div className="info-item">
                    <strong>Nacionalidad:</strong>
                    <span>{u.nationality || 'No especificada'}</span>
                  </div>

                  <div className="info-item">
                    <strong>Experiencia:</strong>
                    <span>{u.experience_years}</span>
                  </div>
                  
                  <div className="info-item full-width">
                    <strong>Habilidades:</strong>
                    <div className="tags-container">
                      {u.skills?.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="info-item full-width">
                    <strong>Tecnologías:</strong>
                    <div className="tags-container">
                      {u.technologies?.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {u.languages && u.languages.length > 0 && (
                    <div className="info-item full-width">
                      <strong>Idiomas:</strong>
                      <div className="tags-container">
                        {u.languages.map((lang, i) => (
                          <span key={i} className="skill-tag" style={{ background: '#f0fdf4', color: '#166534' }}>
                            {lang.language} ({lang.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="user-card-footer">
                  <button 
                    className="btn-contact-user"
                    onClick={() => setSelectedUserContact(u.id === selectedUserContact ? null : u.id)}
                  >
                    {selectedUserContact === u.id ? 'Ocultar contacto' : 'Contactar'}
                  </button>
                </div>

                {selectedUserContact === u.id && (
                  <div className="contact-details-box">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{u.email}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{u.phone || 'No disponible'}</span>
                    </div>
                    <a href={`mailto:${u.email}`} className="btn-send-mail">Enviar Correo</a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyUserPanel;