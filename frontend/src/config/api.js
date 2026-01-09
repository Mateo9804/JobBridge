// Configurable vía `.env` (Create React App):
// REACT_APP_API_BASE_URL debe terminar en `/api`
//
// Opciones según el entorno:
// - Docker: http://localhost:8000/api
// - XAMPP/Apache (puerto 80): http://localhost/jobbrige/backend/public/api
// - XAMPP/Apache (puerto 8080): http://localhost:8080/jobbrige/backend/public/api
// - Laravel artisan serve: http://127.0.0.1:8000/api
//
// Para configurar, ejecuta en frontend/:
//   node setup-env.js xampp    (para XAMPP puerto 80)
//   node setup-env.js xampp8080 (para XAMPP puerto 8080)
//   node setup-env.js docker   (para Docker)
//   node setup-env.js artisan  (para artisan serve)
//
// O crea manualmente frontend/.env con:
//   REACT_APP_API_BASE_URL=http://localhost:8080/jobbrige/backend/public/api
const DEFAULT_API_BASE_URL = 'http://localhost:8080/jobbrige/backend/public/api';

const normalizeBaseUrl = (url) => String(url || '').replace(/\/+$/, '');

export const API_BASE_URL = normalizeBaseUrl(
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL
);

// Base pública del backend (sin el sufijo /api). Útil para assets en /storage.
export const API_PUBLIC_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
export const STORAGE_BASE_URL = `${API_PUBLIC_BASE_URL}/storage`;

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  JOBS: `${API_BASE_URL}/jobs`,
  COMPANY_JOBS: `${API_BASE_URL}/company/jobs`,
  APPLICATIONS: `${API_BASE_URL}/applications`,
  USER_APPLICATIONS: `${API_BASE_URL}/user/applications`,
  TEST: `${API_BASE_URL}/test`,
  PROFILE_GET: `${API_BASE_URL}/profile`,
  PROFILE_UPDATE: `${API_BASE_URL}/profile`,
  PROFILE_UPDATE_PLAN: `${API_BASE_URL}/profile/update-plan`,
  PROFILE_CV_DOWNLOAD: `${API_BASE_URL}/profile/cv`,
  PROFILE_PICTURE: `${API_BASE_URL}/profile/picture`,
  PROFILE_CV_DATA_GET: `${API_BASE_URL}/profile/cv-data`,
  PROFILE_CV_DATA_SAVE: `${API_BASE_URL}/profile/cv-data`,
  PROFILE_CV_DATA_GENERATE_PDF: `${API_BASE_URL}/profile/cv-data/generate-pdf`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATION_MARK_READ: id => `${API_BASE_URL}/notifications/${id}/read`,
  NOTIFICATION_MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  NOTIFICATION_DELETE: id => `${API_BASE_URL}/notifications/${id}`,
  COMPANY_APPLICATIONS: `${API_BASE_URL}/company/applications`,
  COMPANY_PROFILE: id => `${API_BASE_URL}/company/${id}/profile`,
  COURSES: `${API_BASE_URL}/courses`,
  COURSE_ENROLL: id => `${API_BASE_URL}/courses/${id}/enroll`,
  USER_COURSES: `${API_BASE_URL}/user/courses`,
  ENROLLMENT_PROGRESS: id => `${API_BASE_URL}/enrollments/${id}/progress`,
  COMPLETE_LESSON: id => `${API_BASE_URL}/enrollments/${id}/complete-lesson`,
  COURSE_REVIEW: id => `${API_BASE_URL}/courses/${id}/review`,
  COURSE_REVIEWS: id => `${API_BASE_URL}/courses/${id}/reviews`,
  PROFILE_COMPLETE: `${API_BASE_URL}/profile/complete`,
  COMPANY_OFFICIAL_USERS: `${API_BASE_URL}/company/official-users`,
  USER_PROFILE_PICTURE: id => `${API_BASE_URL}/user/${id}/profile-picture`,
  APPLICATION_STATUS_UPDATE: id => `${API_BASE_URL}/applications/${id}/status`,
  APPLICATION_DELETE: id => `${API_BASE_URL}/applications/${id}`,
  APPLICATION_NOTIFY_CV_VIEW: id => `${API_BASE_URL}/applications/${id}/notify-cv-view`,
  APPLICATION_CV_DOWNLOAD: id => `${API_BASE_URL}/applications/${id}/download-cv`,
  JOB_TOGGLE_FAVORITE: id => `${API_BASE_URL}/jobs/${id}/favorite`,
  USER_FAVORITES: `${API_BASE_URL}/user/favorites`,
};

export default API_BASE_URL;