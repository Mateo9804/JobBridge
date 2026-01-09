'use strict';

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena con primera letra en mayúscula
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena con cada palabra capitalizada
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * Trunca una cadena a una longitud máxima
 * @param {string} str - Cadena a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (por defecto '...')
 * @returns {string} Cadena truncada
 */
export const truncate = (str, maxLength, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Elimina espacios en blanco al inicio y final de una cadena
 * @param {string} str - Cadena a limpiar
 * @returns {string} Cadena sin espacios al inicio y final
 */
export const trim = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Normaliza una cadena eliminando acentos y caracteres especiales
 * @param {string} str - Cadena a normalizar
 * @returns {string} Cadena normalizada
 */
export const normalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Convierte una cadena a slug (URL-friendly)
 * @param {string} str - Cadena a convertir
 * @returns {string} Slug generado
 */
export const slugify = (str) => {
  if (!str || typeof str !== 'string') return '';
  return normalize(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extrae el texto de un HTML (elimina etiquetas)
 * @param {string} html - Cadena HTML
 * @returns {string} Texto sin etiquetas HTML
 */
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Escapa caracteres especiales HTML
 * @param {string} str - Cadena a escapar
 * @returns {string} Cadena escapada
 */
export const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Reemplaza todas las ocurrencias de una cadena
 * @param {string} str - Cadena original
 * @param {string} search - Cadena a buscar
 * @param {string} replace - Cadena de reemplazo
 * @returns {string} Cadena con reemplazos
 */
export const replaceAll = (str, search, replace) => {
  if (!str || typeof str !== 'string') return '';
  return str.split(search).join(replace);
};

