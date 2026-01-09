import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth, useNotification } from '../context/AuthContext';
import './CompanyApplicationsPanel.css';

function CompanyApplicationsPanel({ onApplicationStatusChange }) {
  const { token } = useAuth();
  const { fetchNotifications } = useNotification();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [order, setOrder] = useState('job_asc');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState(null); // { appId, status, applicantName, jobTitle }
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null); // { appId, applicantName, jobTitle }

  const fetchApplications = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    if (token) fetchApplications();
  }, [token, fetchApplications]);

  const handleUpdateStatus = async () => {
    if (!confirmData) return;
    const { appId, status } = confirmData;
    
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.APPLICATION_STATUS_UPDATE(appId), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const data = await res.json();
        fetchApplications(); // Recargar datos
        fetchNotifications(); // Recargar notificaciones si es necesario
        // Recargar trabajos para actualizar las vacantes
        if (onApplicationStatusChange) {
          onApplicationStatusChange(true); // Recarga silenciosa
        }
        setShowConfirmModal(false);
        setConfirmData(null);
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (appId, status, applicantName, jobTitle) => {
    setConfirmData({ appId, status, applicantName, jobTitle });
    setShowConfirmModal(true);
  };

  const handleDownloadCv = async (appId) => {
    try {
      const res = await fetch(API_ENDPOINTS.APPLICATION_CV_DOWNLOAD(appId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Intentar obtener el nombre del archivo del header content-disposition
        const contentDisposition = res.headers.get('content-disposition');
        let fileName = 'CV_Descargado.pdf';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) fileName = match[1];
        }
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error al descargar el CV');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const openDeleteModal = (appId, applicantName, jobTitle) => {
    setDeleteData({ appId, applicantName, jobTitle });
    setShowDeleteModal(true);
  };

  const handleDeleteApplication = async () => {
    if (!deleteData) return;

    try {
      const res = await fetch(API_ENDPOINTS.APPLICATION_DELETE(deleteData.appId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchApplications(); // Recargar datos
        fetchNotifications(); // Recargar notificaciones
        // Recargar trabajos para actualizar las vacantes si se eliminó una aceptada
        if (onApplicationStatusChange) {
          onApplicationStatusChange(true); // Recarga silenciosa
        }
        setShowDeleteModal(false);
        setDeleteData(null);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error al eliminar la solicitud');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

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

  return (
    <div className="company-applications-panel" style={{ background: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="applications-container">
        <h2>Solicitudes Recibidas</h2>
        
        {/* Filtros arriba alargados */}
        <div className="applications-filters-horizontal">
          <div className="filter-group full-search">
            <label>Buscar oferta:</label>
            <input
              type="text"
              placeholder="Buscar por postulante, email o trabajo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input-jobs"
            />
          </div>
          <div className="filter-group">
            <label>Orden:</label>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="job_asc">Trabajo ascendente</option>
              <option value="job_desc">Trabajo descendente</option>
              <option value="date_desc">Fecha más reciente</option>
              <option value="date_asc">Fecha más antigua</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Trabajo:</label>
            <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
              <option value="">Todos los trabajos</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <main className="applications-main">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando postulaciones...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : !applications.length ? (
            <div className="no-applications">
              <p>No hay postulaciones recibidas en tus trabajos.</p>
            </div>
          ) : content.type === 'grouped' ? (
            content.data.length === 0 ? (
              <div className="no-results">No hay postulaciones que coincidan con los filtros.</div>
            ) : (
              content.data.map((group, idx) => (
                <div key={group.job_id} className="job-applications-group">
                  <ul>
                    {group.applications.map(app => (
                      <li key={app.application_id} className={`application-card status-${app.status}`}>
                        <div className="application-card-header">
                          <div className="application-job-title">{group.job_title}</div>
                          <div className={`status-badge badge-${app.status}`}>
                            {app.status === 'pending' ? 'Pendiente' : app.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                          </div>
                        </div>
                        <div className="application-details">
                          <div className="application-info-row">
                            <label>Postulante:</label>
                            <span>{app.applicant_name || 'Sin nombre'}</span>
                          </div>
                          <div className="application-info-row">
                            <label>Email:</label>
                            <span>{app.applicant_email || 'Sin email'}</span>
                          </div>
                          <div className="application-info-row">
                            <label>Carta de Presentación:</label>
                            <span style={{ whiteSpace: 'pre-wrap' }}>{app.cover_letter || 'Sin carta de presentación'}</span>
                          </div>
                          <div className="application-info-row">
                            <label>Experiencia:</label>
                            <span style={{ whiteSpace: 'pre-wrap' }}>{app.experience || 'Sin experiencia especificada'}</span>
                          </div>
                          <div className="application-info-row">
                            <label>Fecha:</label>
                            <span>{new Date(app.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="application-actions">
                          {app.resume && (
                            <button 
                              className="btn-action btn-download" 
                              onClick={() => handleDownloadCv(app.application_id)}
                            >
                              {app.resume === 'WEB_CV' ? 'Ver CV Web' : 'Descargar CV'}
                            </button>
                          )}
                          
                          {app.status === 'pending' && (
                            <>
                              <button 
                                className="btn-action btn-accept"
                                onClick={() => openConfirmModal(app.application_id, 'accepted', app.applicant_name, group.job_title)}
                              >
                                Aceptar
                              </button>
                              <button 
                                className="btn-action btn-reject"
                                onClick={() => openConfirmModal(app.application_id, 'rejected', app.applicant_name, group.job_title)}
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          
                          {(app.status === 'accepted' || app.status === 'rejected') && (
                            <button 
                              className="btn-action btn-delete"
                              onClick={() => openDeleteModal(app.application_id, app.applicant_name, group.job_title)}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )
          ) : content.data.length === 0 ? (
            <div className="no-results">No hay postulaciones que coincidan con los filtros.</div>
          ) : (
            <ul>
              {content.data.map(app => (
                <li key={app.application_id} className={`application-card status-${app.status}`}>
                  <div className="application-card-header">
                    <div className="application-job-title">{app.job_title}</div>
                    <div className={`status-badge badge-${app.status}`}>
                      {app.status === 'pending' ? 'Pendiente' : app.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                    </div>
                  </div>
                  <div className="application-details">
                    <div className="application-info-row">
                      <label>Postulante:</label>
                      <span>{app.applicant_name || 'Sin nombre'}</span>
                    </div>
                    <div className="application-info-row">
                      <label>Email:</label>
                      <span>{app.applicant_email || 'Sin email'}</span>
                    </div>
                    <div className="application-info-row">
                      <label>Carta de Presentación:</label>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{app.cover_letter || 'Sin carta de presentación'}</span>
                    </div>
                    <div className="application-info-row">
                      <label>Experiencia:</label>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{app.experience || 'Sin experiencia especificada'}</span>
                    </div>
                    <div className="application-info-row">
                      <label>Fecha:</label>
                      <span>{new Date(app.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="application-actions">
                    {app.resume && (
                      <button 
                        className="btn-action btn-download" 
                        onClick={() => handleDownloadCv(app.application_id)}
                      >
                        {app.resume === 'WEB_CV' ? 'Ver CV Web' : 'Descargar CV'}
                      </button>
                    )}
                    
                    {app.status === 'pending' && (
                      <>
                        <button 
                          className="btn-action btn-accept"
                          onClick={() => openConfirmModal(app.application_id, 'accepted', app.applicant_name, app.job_title)}
                        >
                          Aceptar
                        </button>
                        <button 
                          className="btn-action btn-reject"
                          onClick={() => openConfirmModal(app.application_id, 'rejected', app.applicant_name, app.job_title)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    
                    {(app.status === 'accepted' || app.status === 'rejected') && (
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => openDeleteModal(app.application_id, app.applicant_name, app.job_title)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )
          }
        </main>
      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && deleteData && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header header-delete">
              <h2>Eliminar Solicitud</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que quieres eliminar la solicitud de <strong>{deleteData.applicantName}</strong> para el puesto de <strong>{deleteData.jobTitle}</strong>?</p>
              <p className="modal-warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button 
                className="btn-action btn-delete"
                onClick={handleDeleteApplication}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && confirmData && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className={`modal-header ${confirmData.status === 'accepted' ? 'header-accept' : 'header-reject'}`}>
              <h2>{confirmData.status === 'accepted' ? 'Aceptar Candidato' : 'Rechazar Candidato'}</h2>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que quieres <strong>{confirmData.status === 'accepted' ? 'aceptar' : 'rechazar'}</strong> a <strong>{confirmData.confirmData || confirmData.applicantName}</strong> para el puesto de <strong>{confirmData.jobTitle}</strong>?</p>
              {confirmData.status === 'accepted' && (
                <p className="modal-warning">Esta acción marcará la vacante como ocupada y enviará una notificación de éxito al usuario.</p>
              )}
              {confirmData.status === 'rejected' && (
                <p className="modal-warning">Se enviará una notificación de agradecimiento al usuario informándole que no ha sido seleccionado.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              <button 
                className={`btn-action ${confirmData.status === 'accepted' ? 'btn-accept' : 'btn-reject'}`}
                onClick={handleUpdateStatus}
                disabled={loading}
              >
                {loading ? 'Procesando...' : (confirmData.status === 'accepted' ? 'Confirmar Aceptación' : 'Confirmar Rechazo')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyApplicationsPanel; 