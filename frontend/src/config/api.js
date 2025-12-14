const API_BASE_URL = 'http://localhost/jobbrige/backend/public/api';

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
  COURSES: `${API_BASE_URL}/courses`,
  COURSE_ENROLL: id => `${API_BASE_URL}/courses/${id}/enroll`,
  USER_COURSES: `${API_BASE_URL}/user/courses`,
  ENROLLMENT_PROGRESS: id => `${API_BASE_URL}/enrollments/${id}/progress`,
  COMPLETE_LESSON: id => `${API_BASE_URL}/enrollments/${id}/complete-lesson`,
};

export default API_BASE_URL; 