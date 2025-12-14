import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Toast from './Toast';
import './CVBuilder.css';

function CVBuilder({ onClose, onSave }) {
  const { token, user } = useAuth();
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

  // Cargar datos existentes
  useEffect(() => {
    const loadCvData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.PROFILE_CV_DATA_GET, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFullName(data.full_name || '');
          setEmail(data.email || user?.email || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setBirthDate(data.birth_date || '');
          setNationality(data.nationality || '');
          setProfessionalSummary(data.professional_summary || '');
          setWorkExperience(data.work_experience && data.work_experience.length > 0 ? data.work_experience : [{
            company: '', position: '', startDate: '', endDate: '', current: false, description: ''
          }]);
          setEducation(data.education && data.education.length > 0 ? data.education : [{
            institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: ''
          }]);
          setSkills(data.skills && data.skills.length > 0 ? data.skills : ['']);
          setLanguages(data.languages && data.languages.length > 0 ? data.languages : [{ language: '', level: '' }]);
          setCertifications(data.certifications && data.certifications.length > 0 ? data.certifications : [{
            name: '', issuer: '', date: '', expiryDate: ''
          }]);
          setReferences(data.references && data.references.length > 0 ? data.references : [{
            name: '', position: '', company: '', email: '', phone: ''
          }]);
        } else {
          setEmail(user?.email || '');
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

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const cvData = {
      full_name: fullName,
      email: email,
      phone: phone,
      address: address,
      birth_date: birthDate || null,
      nationality: nationality,
      professional_summary: professionalSummary,
      work_experience: workExperience.filter(exp => exp.company || exp.position),
      education: education.filter(edu => edu.institution || edu.degree),
      skills: skills.filter(skill => skill.trim() !== ''),
      languages: languages.filter(lang => lang.language),
      certifications: certifications.filter(cert => cert.name),
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
        setToastMessage('CV guardado exitosamente');
        setShowToast(true);
        if (onSave) onSave();
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setToastMessage('Error al guardar el CV');
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
            <h3>Información Personal</h3>
            <div className="cv-form-grid">
              <div className="cv-form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="cv-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="cv-form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
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
                <label>Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div className="cv-form-group">
                <label>Nacionalidad *</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="cv-form-group">
              <label>Resumen Profesional *</label>
              <textarea
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                rows={4}
                placeholder="Describe tu experiencia y objetivos profesionales..."
                required
              />
            </div>
          </section>

          {/* Experiencia Laboral */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Experiencia Laboral</h3>
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
                    <label>Fecha de Inicio</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      value={exp.endDate}
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
                      Trabajo Actual
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
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Campo de Estudio</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Inicio</label>
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      disabled={edu.current}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                      />
                      Estudiando Actualmente
                    </label>
                  </div>
                </div>
                <div className="cv-form-group">
                  <label>Descripción</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Habilidades */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Habilidades</h3>
              <button type="button" onClick={addSkill} className="cv-add-btn">+ Agregar</button>
            </div>
            {skills.map((skill, index) => (
              <div key={index} className="cv-skill-item">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Ej: JavaScript, Python, Diseño Gráfico..."
                />
                {skills.length > 1 && (
                  <button type="button" onClick={() => removeSkill(index)} className="cv-remove-btn">×</button>
                )}
              </div>
            ))}
          </section>

          {/* Idiomas */}
          <section className="cv-section">
            <div className="cv-section-header">
              <h3>Idiomas</h3>
              <button type="button" onClick={addLanguage} className="cv-add-btn">+ Agregar</button>
            </div>
            {languages.map((lang, index) => (
              <div key={index} className="cv-form-grid">
                <div className="cv-form-group">
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    placeholder="Idioma"
                  />
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
                  <div className="cv-form-group">
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
                  <div className="cv-form-group">
                    <label>Nombre de la Certificación</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Emisor</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Emisión</label>
                    <input
                      type="date"
                      value={cert.date}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label>Fecha de Expiración</label>
                    <input
                      type="date"
                      value={cert.expiryDate}
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

