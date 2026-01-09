import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, STORAGE_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

function JobApplicationsList({ jobId }) {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_ENDPOINTS.JOBS}/${jobId}/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudieron cargar las postulaciones');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (jobId && token) fetchApplications();
  }, [jobId, token]);

  if (loading) return <div>Cargando postulaciones...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!applications.length) return <div>No hay postulaciones para este trabajo.</div>;

  return (
    <div className="applications-list">
      <h3>Postulaciones Recibidas</h3>
      <ul>
        {applications.map(app => (
          <li key={app.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div><strong>Postulante:</strong> {app.user?.name || 'Sin nombre'}</div>
            <div><strong>Email:</strong> {app.user?.email || 'Sin email'}</div>
            <div><strong>Carta de Presentación:</strong> {app.cover_letter}</div>
            <div><strong>Experiencia:</strong> {app.experience}</div>
            {app.resume === 'WEB_CV' ? (
              <div><span style={{ background: '#764ba2', padding: '2px 8px', borderRadius: '4px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>CV Web</span></div>
            ) : (
              app.resume && <div><a href={`${STORAGE_BASE_URL}/${app.resume}`} target="_blank" rel="noopener noreferrer">Ver CV</a></div>
            )}
            <div><strong>Fecha:</strong> {new Date(app.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobApplicationsList; 