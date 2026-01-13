import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Toast from './Toast';
import './CVBuilder.css';

function CVBuilder({ onClose, onSave }) {
  const { token, user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState('');

  const [workExperience, setWorkExperience] = useState([{
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  // Educación
  const [education, setEducation] = useState([{
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  // Habilidades
  const [skills, setSkills] = useState(['']);

  // Idiomas
  const [languages, setLanguages] = useState([{
    language: '',
    level: ''
  }]);

  // Certificaciones
  const [certifications, setCertifications] = useState([{
    name: '',
    issuer: '',
    date: '',
    expiryDate: ''
  }]);

  // Referencias
  const [references, setReferences] = useState([{
    name: '',
    position: '',
    company: '',
    email: '',
    phone: ''
  }]);

  // Idiomas comunes
  const COMMON_LANGUAGES = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Chino', 'Japonés', 'Ruso', 'Árabe'
  ];

  // Habilidades predefinidas (misma lista que en onboarding)
  const PREDEFINED_SKILLS = [
    'Desarrollo frontend', 'Desarrollo backend', 'Desarrollo full stack',
    'Desarrollo mobile', 'Arquitectura de software', 'UI/UX design',
    'DevOps', 'Data science', 'Machine learning', 'Ciberseguridad'
  ];

  // Tecnologías predefinidas (combinadas de TECH_BY_SKILL)
  const PREDEFINED_TECHS = [
    'React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS',
    'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Ruby', 'Express', 'Django', 
    'Spring Boot', 'Laravel', 'ASP.NET', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Dart', 'Docker', 'Kubernetes', 
    'AWS', 'Azure', 'GCP', 'Git', 'Figma', 'Adobe XD', 'Jenkins', 'Terraform', 
    'R', 'Pandas', 'NumPy', 'SQL', 'PyTorch', 'TensorFlow', 'Scikit-learn',
    'Kali Linux', 'Wireshark', 'Metasploit', 'Nmap'
  ].sort();

  // Títulos/Grados comunes
  const COMMON_DEGREES = [
    'Educación secundaria obligatoria', 'Bachillerato', 'Ciclo formativo grado medio',
    'Ciclo Formativo grado superior', 'Grado universitario', 'Máster', 'Doctorado',
    'Ingeniería', 'Licenciatura', 'Diplomatura', 'Certificado de profesionalidad'
  ];

  // Certificaciones comunes
  const COMMON_CERTIFICATIONS = [
    'Google data analytics', 'AWS certified solutions architect', 'Microsoft certified: azure fundamentals',
    'CompTIA security+', 'Cisco certified network associate (CCNA)', 'Certified ethical hacker (CEH)',
    'Meta front-end developer', 'IBM data science professional', 'PMP - project management professional',
    'Scrum master certified (PSM)', 'Oracle certified professional Java SE', 'Salesforce certified administrator'
  ].sort();

  // Cargar datos existentes
  useEffect(() => {
    const loadCvData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_CV_DATA_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Datos del perfil (onboarding) para pre-rellenar
        const profileFullName = user?.full_name || user?.name || '';
        const profilePhone = user?.phone || '';
        const profileBirthDate = user?.birthday ? user.birthday.split('T')[0] : '';
        const profileNationality = user?.nationality || '';
        const profileSkills = [...(user?.skills || []), ...(user?.technologies || [])];

        if (res.ok) {
          const data = await res.json();
          setFullName(data.full_name || profileFullName);
          setEmail(data.email || user?.email || '');
          setPhone(data.phone || profilePhone);
          setAddress(data.address || '');
          setBirthDate(data.birth_date ? data.birth_date.split('T')[0] : profileBirthDate);
          setNationality(data.nationality || profileNationality);
          setProfessionalSummary(data.professional_summary || '');
          setWorkExperience(data.work_experience && data.work_experience.length > 0 ? data.work_experience : [{
            company: '', position: '', startDate: '', endDate: '', current: false, description: ''
          }]);
          setEducation(data.education && data.education.length > 0 ? data.education : [{
            institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: ''
          }]);
          
          // Combinar skills del CV con las del perfil, evitando duplicados
          const cvSkills = (data.skills || []).filter(s => s && s.trim() !== '');
          const combinedSkills = Array.from(new Set([...profileSkills, ...cvSkills]));
          setSkills(combinedSkills);
          
          setLanguages(data.languages && data.languages.length > 0 ? data.languages : [{ language: '', level: '' }]);
          setCertifications(data.certifications && data.certifications.length > 0 ? data.certifications : [{ name: '', issuer: '', date: '', expiryDate: '' }]);
          setReferences(data.references && data.references.length > 0 ? data.references : [{ name: '', position: '', company: '', email: '', phone: '' }]);
          
        } else {
          setFullName(profileFullName);
          setEmail(user?.email || '');
          setPhone(profilePhone);
          setBirthDate(profileBirthDate);
          setNationality(profileNationality);
          setSkills(profileSkills.filter(s => s && s.trim() !== ''));
        }
      } catch (e) {
        setEmail(user?.email || '');
      }
      setLoading(false);
    };
    loadCvData();
  }, [token, user]);

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, {
      company: '', position: '', startDate: '', endDate: '', current: false, description: ''
    }]);
  };

  const removeWorkExperience = (index) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWorkExperience = (index, field, value) => {
    const updated = [...workExperience];
    updated[index][field] = value;
    setWorkExperience(updated);
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: ''
    }]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  // Funciones de habilidades comentadas por no uso actual
  // const addSkill = () => {
  //   setSkills([...skills, '']);
  // };

  // const removeSkill = (index) => {
  //   setSkills(skills.filter((_, i) => i !== index));
  // };

  // const updateSkill = (index, value) => {
  //   const updated = [...skills];
  //   updated[index] = value;
  //   setSkills(updated);
  // };

  const addLanguage = () => {
    setLanguages([...languages, { language: '', level: '' }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '', expiryDate: '' }]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addReference = () => {
    setReferences([...references, { name: '', position: '', company: '', email: '', phone: '' }]);
  };

  const removeReference = (index) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const updateReference = (index, field, value) => {
    const updated = [...references];
    updated[index][field] = value;
    setReferences(updated);
  };

  const today = new Date().toISOString().split('T')[0];
  // Para experiencia laboral, permitir cualquier fecha pasada hasta hoy
  const maxWorkStartDate = today;
  // Para educación y certificaciones, también permitir fechas pasadas
  const maxEducationStartDate = today;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formatDateForDB = (dateStr) => {
      if (!dateStr) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];
      } catch (e) {
        return null;
      }
    };

    const cvData = {
      full_name: fullName,
      email: email,
      phone: phone,
      address: address,
      birth_date: formatDateForDB(birthDate),
      nationality: nationality,
      professional_summary: professionalSummary,
      work_experience: workExperience.map(exp => ({
        ...exp,
        startDate: formatDateForDB(exp.startDate),
        endDate: formatDateForDB(exp.endDate)
      })).filter(exp => exp.company || exp.position),
      education: education.map(edu => ({
        ...edu,
        startDate: formatDateForDB(edu.startDate),
        endDate: formatDateForDB(edu.endDate)
      })).filter(edu => edu.institution || edu.degree),
      skills: skills.filter(skill => skill && skill.trim() !== ''),
      languages: languages.filter(lang => lang.language),
      certifications: certifications.map(cert => ({
        ...cert,
        date: formatDateForDB(cert.date),
        expiryDate: formatDateForDB(cert.expiryDate)
      })).filter(cert => cert.name),
      references: references.filter(ref => ref.name),
    };

    try {
      const res = await fetch(API_ENDPOINTS.PROFILE_CV_DATA_SAVE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvData)
      });

      if (res.ok) {
        const data = await res.json();
        setToastMessage('CV guardado exitosamente');
        setShowToast(true);
        
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        if (onSave) onSave(data.user);
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setToastMessage(errorData.message || 'Error al guardar el CV');
        setShowToast(true);
      }
    } catch (e) {
      setToastMessage('Error de red');
      setShowToast(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="cv-builder-overlay">
        <div className="cv-builder-modal">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-builder-overlay" onClick={onClose}>
      <div className="cv-builder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-builder-header">
          <h2>Crear/Editar CV</h2>
          <button className="cv-builder-close" onClick={onClose}>×</button>
        </div>

        <form className="cv-builder-form" onSubmit={handleSave}>
          {/* Información Personal */}
          <section className="cv-section">
            <h3>Información personal</h3>
            <div className="cv-form-grid">
              <div className="cv-form-group">
                <label>Nombre completo (Bloqueado)</label>
                <input
                  type="text"
                  value={fullName}
                  readOnly
                  className="input-locked"
                />
              </div>
              <div className="cv-form-group">
                <label>Email (Bloqueado)</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="input-locked"
                />
              </div>
              <div className="cv-form-group">
                <label>Teléfono (Bloqueado)</label>
                <input
                  type="tel"
                  value={phone}
                  readOnly
                  className="input-locked"
                />
              </div>
              <div className="cv-form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="cv-form-group">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  readOnly
                  className="input-locked"
                />
              </div>
              <div className="cv-form-group">
                <label>Nacionalidad</label>
                <input
                  type="text"
                  value={nationality}
                  readOnly
                  className="input-locked"
                />
              </div>
            </div>
            <div className="cv-form-group cv-summary-wrapper">
              <label>Resumen profesional *</label>
              <div className="textarea-relative">
                <textarea
                  value={professionalSummary}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setProfessionalSummary(e.target.value);
                    }
                  }}
                  rows={4}
                  placeholder="Describe tu experiencia y objetivos profesionales..."
                  required
                />
                <span className={`char-counter ${professionalSummary.length >= 285 ? 'warning' : ''}`}>
                  {professionalSummary.length}/300
                </span>
              </div>
            </div>
          </section>

          {/* Experiencia Laboral */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Experiencia laboral</h3>
              <button type="button" onClick={addWorkExperience} className="cv-add-btn">+ Agregar</button>
            </div>
            {workExperience.map((exp, index) => (
              <div key={index} className="cv-item-card">
                <div className="cv-item-header">
                  <h4>Experiencia {index + 1}</h4>
                  {workExperience.length > 1 && (
                    <button type="button" onClick={() => removeWorkExperience(index)} className="cv-remove-btn">Eliminar</button>
                  )}
                </div>
                <div className="cv-form-grid">
                  <div className="cv-form-group">
                    <label>Empresa *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Posición *</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de inicio</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      max={maxWorkStartDate}
                      onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de fin</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      max={today}
                      onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                      />
                      Trabajo actual
                    </label>
                  </div>
                </div>
                <div className="cv-form-group">
                  <label>Descripción</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                    rows={3}
                    placeholder="Describe tus responsabilidades y logros..."
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Educación */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Educación</h3>
              <button type="button" onClick={addEducation} className="cv-add-btn">+ Agregar</button>
            </div>
            {education.map((edu, index) => (
              <div key={index} className="cv-item-card">
                <div className="cv-item-header">
                  <h4>Educación {index + 1}</h4>
                  {education.length > 1 && (
                    <button type="button" onClick={() => removeEducation(index)} className="cv-remove-btn">Eliminar</button>
                  )}
                </div>
                <div className="cv-form-grid">
                  <div className="cv-form-group">
                    <label>Institución *</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Título/Grado *</label>
                    <select
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="cv-degree-select"
                    >
                      <option value="">Selecciona tu título</option>
                      {COMMON_DEGREES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de inicio</label>
                    <input
                      type="date"
                      value={edu.startDate}
                      max={maxEducationStartDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      value={edu.endDate}
                      max={today}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      disabled={edu.current}
                    />
                  </div>
                  <div className="cv-form-group full-width">
                    <label>
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                      />
                      Estudiando actualmente
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Habilidades */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Habilidades</h3>
            </div>
            
            <div className="cv-skills-modern-wrapper">
              <div className="cv-skills-tags-grid">
                {skills.filter(s => s && s.trim() !== '').map((skill, index) => (
                  <div key={index} className="cv-skill-pill">
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      className="cv-pill-remove" 
                      onClick={() => setSkills(skills.filter(s => s !== skill))}
                      title="Eliminar habilidad"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="cv-skill-selector-row">
                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !skills.includes(val)) {
                      setSkills([...skills.filter(s => s && s.trim() !== ''), val]);
                    }
                  }}
                  className="cv-skill-select-modern"
                >
                  <option value="">+ Añadir habilidad o tecnología...</option>
                  <optgroup label="Áreas de Especialización">
                    {PREDEFINED_SKILLS
                      .filter(s => !skills.includes(s))
                      .map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))
                    }
                  </optgroup>
                  <optgroup label="Tecnologías">
                    {PREDEFINED_TECHS
                      .filter(t => !skills.includes(t))
                      .map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))
                    }
                  </optgroup>
                </select>
              </div>
            </div>
          </section>

          {/* Idiomas */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Idiomas</h3>
              <button type="button" onClick={addLanguage} className="cv-add-btn">+ Agregar</button>
            </div>
            {languages.map((lang, index) => (
              <div key={index} className="cv-form-grid cv-lang-row">
                <div className="cv-form-group">
                  <select
                    value={lang.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                  >
                    <option value="">Selecciona idioma</option>
                    {COMMON_LANGUAGES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="cv-form-group">
                  <select
                    value={lang.level}
                    onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                  >
                    <option value="">Nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                </div>
                {languages.length > 1 && (
                  <div className="cv-form-group cv-lang-remove">
                    <button type="button" onClick={() => removeLanguage(index)} className="cv-remove-btn">Eliminar</button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Certificaciones */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Certificaciones</h3>
              <button type="button" onClick={addCertification} className="cv-add-btn">+ Agregar</button>
            </div>
            {certifications.map((cert, index) => (
              <div key={index} className="cv-item-card">
                <div className="cv-item-header">
                  <h4>Certificación {index + 1}</h4>
                  {certifications.length > 1 && (
                    <button type="button" onClick={() => removeCertification(index)} className="cv-remove-btn">Eliminar</button>
                  )}
                </div>
                <div className="cv-form-grid">
                  <div className="cv-form-group full-width">
                    <label>Nombre de la certificación</label>
                    <select
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      className="cv-cert-select"
                    >
                      <option value="">Selecciona una certificación</option>
                      {COMMON_CERTIFICATIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Otro">Otra (no listada)</option>
                    </select>
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de emisión</label>
                    <input
                      type="date"
                      value={cert.date}
                      max={today}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de expiración</label>
                    <input
                      type="date"
                      value={cert.expiryDate}
                      max={today}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Referencias */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Referencias</h3>
              <button type="button" onClick={addReference} className="cv-add-btn">+ Agregar</button>
            </div>
            {references.map((ref, index) => (
              <div key={index} className="cv-item-card">
                <div className="cv-item-header">
                  <h4>Referencia {index + 1}</h4>
                  {references.length > 1 && (
                    <button type="button" onClick={() => removeReference(index)} className="cv-remove-btn">Eliminar</button>
                  )}
                </div>
                <div className="cv-form-grid">
                  <div className="cv-form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Posición</label>
                    <input
                      type="text"
                      value={ref.position}
                      onChange={(e) => updateReference(index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Empresa</label>
                    <input
                      type="text"
                      value={ref.company}
                      onChange={(e) => updateReference(index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateReference(index, 'email', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={ref.phone}
                      onChange={(e) => updateReference(index, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="cv-builder-actions">
            <button type="button" onClick={onClose} className="cv-cancel-btn">Cancelar</button>
            <button type="submit" className="cv-save-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar CV'}
            </button>
          </div>
        </form>

        <Toast
          message={toastMessage}
          isOpen={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}

export default CVBuilder;

