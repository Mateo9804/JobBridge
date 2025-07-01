// API Configuration
const API_BASE_URL = 'http://localhost/jobbrige/backend/public/api';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  JOBS: `${API_BASE_URL}/jobs`,
  COMPANY_JOBS: `${API_BASE_URL}/company/jobs`,
  APPLICATIONS: `${API_BASE_URL}/applications`,
  TEST: `${API_BASE_URL}/test`,
  PROFILE_GET: `${API_BASE_URL}/profile`,
  PROFILE_UPDATE: `${API_BASE_URL}/profile`,
};

export default API_BASE_URL; 