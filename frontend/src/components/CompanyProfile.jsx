import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Account.css';
import { API_ENDPOINTS } from '../config/api';

const DEFAULT_LOGO = '/imagenes/iconoUsuario.png';

function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.COMPANY_PROFILE(id));
        if (!res.ok) throw new Error('No se pudo cargar el perfil de la empresa');
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <div className="account-page"><div className="account-container"><p>Cargando...</p></div></div>;
  if (error) return <div className="account-page"><div className="account-container"><p className="error-message">{error}</p></div></div>;
  if (!company) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="profile-header">
          <div className="profile-picture-wrapper">
            <img
              src={company.logo_url || DEFAULT_LOGO}
              alt="Logo de la empresa"
              className="profile-picture"
              onError={e => { e.target.onerror = null; e.target.src = DEFAULT_LOGO; }}
            />
          </div>
          <div className="profile-info">
            <h1>{company.company_name}</h1>
            <p className="profile-description">{company.description}</p>
            <div className="profile-details">
              {company.website && (
                <p><strong>Sitio web:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
              )}
              {company.location && (
                <p><strong>Ubicación:</strong> {company.location}</p>
              )}
              {company.industry && (
                <p><strong>Industria:</strong> {company.industry}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile; 