import React, { useState, useEffect } from 'react';
import { useAuth, useNotification } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './UserProfileForm.css';

const EDUCATION_LEVELS = [
  'Educación Secundaria Obligatoria (ESO)',
  'Bachillerato',
  'Formación Profesional Grado Medio',
  'Formación Profesional Grado Superior',
  'Grado Universitario',
  'Máster / Postgrado',
  'Doctorado'
];

const SKILLS_LIST = [
  'Desarrollo Frontend',
  'Desarrollo Backend',
  'Desarrollo Full Stack',
  'Desarrollo Mobile',
  'Arquitectura de Software',
  'UI/UX Design',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'Ciberseguridad'
];

const TECH_BY_SKILL = {
  'Desarrollo Frontend': ['React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS'],
  'Desarrollo Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Ruby', 'Express', 'Django', 'Spring Boot', 'Laravel', 'ASP.NET', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
  'Desarrollo Full Stack': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Next.js', 'Express', 'Laravel'],
  'Desarrollo Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Dart'],
  'Arquitectura de Software': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git'],
  'UI/UX Design': ['HTML/CSS', 'Figma', 'Adobe XD'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Jenkins', 'Terraform'],
  'Data Science': ['Python', 'R', 'Pandas', 'NumPy', 'SQL', 'MongoDB'],
  'Machine Learning': ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn'],
  'Ciberseguridad': ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Security+']
};

const EXPERIENCE_YEARS = [
  'Sin experiencia',
  'Menos de 1 año',
  '1-2 años',
  '3-5 años',
  'Más de 5 años',
  'Más de 10 años'
];

const NATIONALITIES = [
  'España', 'Argentina', 'México', 'Colombia', 'Chile', 'Perú', 'Uruguay', 'Venezuela', 
  'Ecuador', 'Bolivia', 'Paraguay', 'Costa Rica', 'Panamá', 'Guatemala', 'Honduras', 
  'El Salvador', 'Nicaragua', 'Puerto Rico', 'Estados Unidos', 'Portugal', 'Francia', 
  'Italia', 'Alemania', 'Reino Unido', 'Otro'
];

const PHONE_PREFIXES = [
  { code: '+34', abbr: 'Esp' },
  { code: '+54', abbr: 'Arg' },
  { code: '+52', abbr: 'Mex' },
  { code: '+57', abbr: 'Col' },
  { code: '+56', abbr: 'Chi' },
  { code: '+51', abbr: 'Per' },
  { code: '+598', abbr: 'Uru' },
  { code: '+58', abbr: 'Ven' },
  { code: '+593', abbr: 'Ecu' },
  { code: '+591', abbr: 'Bol' },
  { code: '+595', abbr: 'Par' },
  { code: '+506', abbr: 'CR' },
  { code: '+507', abbr: 'Pan' },
  { code: '+502', abbr: 'Gua' },
  { code: '+504', abbr: 'Hon' },
  { code: '+503', abbr: 'Sal' },
  { code: '+505', abbr: 'Nic' },
  { code: '+1', abbr: 'USA' },
  { code: '+351', abbr: 'Por' },
  { code: '+33', abbr: 'Fra' },
  { code: '+39', abbr: 'Ita' },
  { code: '+49', abbr: 'Ale' },
  { code: '+44', abbr: 'UK' }
];

function UserProfileForm({ onComplete }) {
  const { token, setUser, user, logout } = useAuth();
  const { addNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone_prefix: '+34',
    phone_number: '',
    nationality: '',
    birthday: '',
    education_level: '',
    skills: [],
    technologies: [],
    experience_years: ''
  });

  // Actualizar tecnologías disponibles según habilidades seleccionadas
  useEffect(() => {
    let techs = new Set();
    formData.skills.forEach(skill => {
      if (TECH_BY_SKILL[skill]) {
        TECH_BY_SKILL[skill].forEach(t => techs.add(t));
      }
    });
    
    const newTechList = Array.from(techs).sort();
    setAvailableTechs(newTechList);

    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => techs.has(t))
    }));
  }, [formData.skills]);

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length > 9) value = value.slice(0, 9);
    
    // Formatear como XXX XX XX XX
    let formatted = '';
    if (value.length > 0) {
      formatted += value.slice(0, 3);
      if (value.length > 3) {
        formatted += ' ' + value.slice(3, 5);
      }
      if (value.length > 5) {
        formatted += ' ' + value.slice(5, 7);
      }
      if (value.length > 7) {
        formatted += ' ' + value.slice(7, 9);
      }
    }
    
    setFormData({ ...formData, phone_number: formatted });
  };

  const nextStep = () => {
    if (step === 1) {
      const rawPhone = formData.phone_number.replace(/\s/g, '');
      if (!formData.first_name || !formData.last_name || !rawPhone || !formData.nationality || !formData.birthday) {
        addNotification('Por favor, completa todos los datos personales.', 'warning');
        return;
      }
      if (rawPhone.length < 9) {
        addNotification('El teléfono debe tener 9 números.', 'warning');
        return;
      }

      // Validar edad
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16) {
        addNotification('Debes tener al menos 16 años.', 'error');
        return;
      }
      if (age > 90) {
        addNotification('La edad máxima permitida es de 90 años.', 'error');
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.education_level || formData.skills.length === 0 || formData.technologies.length === 0 || !formData.experience_years) {
      addNotification('Por favor, rellena todos los campos profesionales.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Unir prefijo y número para enviar al backend
      const finalData = {
        ...formData,
        phone: `${formData.phone_prefix} ${formData.phone_number}`,
        full_name: `${formData.first_name} ${formData.last_name}`
      };

      const response = await fetch(API_ENDPOINTS.PROFILE_COMPLETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      const data = await response.json();

      if (response.ok) {
        addNotification(data.message, 'success');
        setUser(data.user);
        if (onComplete) onComplete();
      } else {
        addNotification(data.message || 'Error al completar el perfil', 'error');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      addNotification('Error de conexión al servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <div className="onboarding-card">
          <button className="onboarding-logout-btn" onClick={logout} title="Cerrar sesión">
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
          <div className="onboarding-header">
            <div className="onboarding-badge">Paso {step} de 2</div>
            <h2>{step === 1 ? 'Información Personal' : 'Perfil Profesional'}</h2>
            <p>
              {step === 1 
                ? 'Comencemos con tus datos básicos para tu futuro CV.' 
                : 'Ahora cuéntanos sobre tu experiencia y habilidades técnicas.'}
            </p>
          </div>

          <div className="onboarding-content">
            {step === 1 ? (
              <div className="onboarding-form">
                <div className="onboarding-grid">
                  <div className="onboarding-column">
                    <div className="onboarding-section">
                      <label>Nombre de la cuenta</label>
                      <input 
                        type="text" 
                        className="modern-input disabled"
                        value={user?.name || ''}
                        disabled
                      />
                    </div>
                    <div className="onboarding-section">
                      <label>Email</label>
                      <input 
                        type="email" 
                        className="modern-input disabled"
                        value={formData.email}
                        disabled
                      />
                    </div>
                    <div className="onboarding-section">
                      <label>Nacionalidad *</label>
                      <select 
                        className="modern-select"
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      >
                        <option value="">Selecciona tu país</option>
                        {NATIONALITIES.map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="onboarding-section">
                      <label>Fecha de Nacimiento *</label>
                      <input 
                        type="date" 
                        className="modern-input"
                        value={formData.birthday}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split('T')[0]}
                        onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                      />
                      <small className="input-hint">Entre 16 y 90 años</small>
                    </div>
                  </div>
                  <div className="onboarding-column">
                    <div className="onboarding-section">
                      <label>Nombre *</label>
                      <input 
                        type="text" 
                        className="modern-input"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="onboarding-section">
                      <label>Apellido *</label>
                      <input 
                        type="text" 
                        className="modern-input"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        placeholder="Tu apellido"
                      />
                    </div>
                    <div className="onboarding-section">
                      <label>Teléfono de contacto *</label>
                      <div className="phone-input-group">
                        <select 
                          className="modern-select prefix-select"
                          value={formData.phone_prefix}
                          onChange={(e) => setFormData({...formData, phone_prefix: e.target.value})}
                        >
                          {PHONE_PREFIXES.map(p => (
                            <option key={p.code} value={p.code}>{p.code} ({p.abbr})</option>
                          ))}
                        </select>
                        <input 
                          type="tel" 
                          className="modern-input phone-number-input"
                          value={formData.phone_number}
                          onChange={handlePhoneChange}
                          placeholder="123 45 67 89"
                        />
                      </div>
                      <small className="input-hint">{formData.phone_number.replace(/\s/g, '').length}/9 dígitos</small>
                    </div>
                  </div>
                </div>
                <div className="onboarding-footer">
                  <button onClick={nextStep} className="btn-modern-submit">Siguiente Paso</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="onboarding-form">
                <div className="onboarding-grid">
                  <div className="onboarding-column">
                    <div className="onboarding-section">
                      <label>Nivel de Estudios *</label>
                      <select 
                        value={formData.education_level}
                        onChange={(e) => setFormData({...formData, education_level: e.target.value})}
                        required
                        className="modern-select"
                      >
                        <option value="">Selecciona tus estudios</option>
                        {EDUCATION_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    <div className="onboarding-section">
                      <label>Experiencia Laboral *</label>
                      <select 
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        required
                        className="modern-select"
                      >
                        <option value="">Años de experiencia</option>
                        {EXPERIENCE_YEARS.map(years => (
                          <option key={years} value={years}>{years}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="onboarding-column">
                    <div className="onboarding-section">
                      <label>Áreas de Especialización *</label>
                      <div className="modern-options-grid">
                        {SKILLS_LIST.map(skill => (
                          <label key={skill} className={`modern-checkbox ${formData.skills.includes(skill) ? 'active' : ''}`}>
                            <input 
                              type="checkbox" 
                              hidden
                              checked={formData.skills.includes(skill)}
                              onChange={() => handleCheckboxChange('skills', skill)}
                            />
                            <span>{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="onboarding-section full-width">
                  <label>Tecnologías Específicas *</label>
                  {formData.skills.length === 0 ? (
                    <div className="tech-placeholder">
                      Selecciona primero tus áreas de especialización para ver las tecnologías.
                    </div>
                  ) : (
                    <div className="modern-options-grid tech-grid">
                      {availableTechs.map(tech => (
                        <label key={tech} className={`modern-checkbox tech-item ${formData.technologies.includes(tech) ? 'active' : ''}`}>
                          <input 
                            type="checkbox" 
                            hidden
                            checked={formData.technologies.includes(tech)}
                            onChange={() => handleCheckboxChange('technologies', tech)}
                          />
                          <span>{tech}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="onboarding-footer multi-btn">
                  <button type="button" onClick={prevStep} className="btn-modern-secondary">Volver</button>
                  <button 
                    type="submit" 
                    className="btn-modern-submit"
                    disabled={loading}
                  >
                    {loading ? <span className="spinner"></span> : 'Completar mi Perfil'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileForm;