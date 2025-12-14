import React, { useEffect, useState, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';

function CompanyApplicationsPanel() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [order, setOrder] = useState('job_asc'); 

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_ENDPOINTS.COMPANY_APPLICATIONS, {
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
    if (token) fetchApplications();
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Obtener trabajos únicos
  const jobs = useMemo(() => {
    const map = {};
    applications.forEach(app => {
      if (!map[app.job_id]) map[app.job_id] = app.job_title;
    });
    let arr = Object.entries(map).map(([id, title]) => ({ id, title }));
    arr.sort((a, b) => a.title.localeCompare(b.title));
    return arr;
  }, [applications]);

  // Filtrar y buscar
  const filtered = useMemo(() => {
    let filteredApps = applications;
    if (jobFilter) filteredApps = filteredApps.filter(app => String(app.job_id) === String(jobFilter));
    if (search) {
      const s = search.toLowerCase();
      filteredApps = filteredApps.filter(app =>
        (app.applicant_name && app.applicant_name.toLowerCase().includes(s)) ||
        (app.applicant_email && app.applicant_email.toLowerCase().includes(s)) ||
        (app.job_title && app.job_title.toLowerCase().includes(s))
      );
    }
    return filteredApps;
  }, [applications, jobFilter, search]);

  // Ordenar y agrupar según el selector
  const content = useMemo(() => {
    if (order === 'job_asc' || order === 'job_desc') {
      const acc = {};
      filtered.forEach(app => {
        if (!acc[app.job_id]) acc[app.job_id] = { job_title: app.job_title, applications: [] };
        acc[app.job_id].applications.push(app);
      });
      let groupsArr = Object.entries(acc).map(([job_id, group]) => ({ job_id, ...group }));
      groupsArr.sort((a, b) => {
        if (order === 'job_asc') return a.job_title.localeCompare(b.job_title);
        return b.job_title.localeCompare(a.job_title);
      });
      groupsArr.forEach(group => {
        group.applications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
      return { type: 'grouped', data: groupsArr };
    } else {
      let sorted = filtered.slice().sort((a, b) => {
        if (order === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
        return new Date(a.created_at) - new Date(b.created_at);
      });
      return { type: 'flat', data: sorted };
    }
  }, [filtered, order]);

  if (loading) return <div>Cargando postulaciones...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!applications.length) return <div>No hay postulaciones recibidas en tus trabajos.</div>;

  return (
    <div className="company-applications-panel" style={{ background: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="applications-container">
        {/* Layout tipo marketplace */}
        <div className="applications-layout">
          {/* Columna izquierda: filtros */}
          <aside className="applications-filters">
            <div className="filter-block">
              <div className="filter-title">Filtrar</div>
              <div className="filter-field">
                <label>Orden</label>
                <select value={order} onChange={e => setOrder(e.target.value)}>
                  <option value="job_asc">Trabajo ascendente</option>
                  <option value="job_desc">Trabajo descendente</option>
                  <option value="date_desc">Fecha más reciente</option>
                  <option value="date_asc">Fecha más antigua</option>
                </select>
              </div>
              <div className="filter-field">
                <label>Trabajo</label>
                <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
                  <option value="">Todos los trabajos</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
            </div>
          </aside>
          {/* Columna derecha: resultados */}
          <main className="applications-main">
            {/* Buscador centrado sobre el título */}
            <div className="applications-search">
              <input
                type="text"
                placeholder="Buscar por postulante, email o trabajo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <h2>Solicitudes Recibidas</h2>
            {content.type === 'grouped' ? (
              content.data.length === 0 ? (
                <div className="no-results">No hay postulaciones que coincidan con los filtros.</div>
              ) : (
                content.data.map((group, idx) => (
                  <div key={group.job_id} className="job-applications-group">
                    <ul>
                      {group.applications.map(app => (
                        <li key={app.application_id} className="application-card">
                          <div className="application-job-title">{group.job_title}</div>
                          <div className="application-field"><strong>Postulante:</strong> {app.applicant_name || 'Sin nombre'}</div>
                          <div className="application-field"><strong>Email:</strong> {app.applicant_email || 'Sin email'}</div>
                          <div className="application-field"><strong>Carta de Presentación:</strong> <span className="application-text">{app.cover_letter}</span></div>
                          <div className="application-field"><strong>Experiencia:</strong> <span className="application-text">{app.experience}</span></div>
                          <div className="application-field"><strong>Estado:</strong> {app.status}</div>
                          <div className="application-field"><strong>Fecha:</strong> {new Date(app.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )
            ) : (
              content.data.length === 0 ? (
                <div className="no-results">No hay postulaciones que coincidan con los filtros.</div>
              ) : (
                <ul>
                  {content.data.map(app => (
                    <li key={app.application_id} className="application-card">
                      <div className="application-job-title">{app.job_title}</div>
                      <div className="application-field"><strong>Postulante:</strong> {app.applicant_name || 'Sin nombre'}</div>
                      <div className="application-field"><strong>Email:</strong> {app.applicant_email || 'Sin email'}</div>
                      <div className="application-field"><strong>Carta de Presentación:</strong> <span className="application-text">{app.cover_letter}</span></div>
                      <div className="application-field"><strong>Experiencia:</strong> <span className="application-text">{app.experience}</span></div>
                      <div className="application-field"><strong>Estado:</strong> {app.status}</div>
                      <div className="application-field"><strong>Fecha:</strong> {new Date(app.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CompanyApplicationsPanel; 