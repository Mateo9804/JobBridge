'use strict';

/**
 * Valida si un valor es un número válido
 * @param {*} value - Valor a validar
 * @returns {boolean} true si es un número válido
 */
export const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Convierte un valor a número
 * @param {*} value - Valor a convertir
 * @param {number} defaultValue - Valor por defecto si la conversión falla
 * @returns {number} Número convertido
 */
export const toNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Convierte un valor a entero
 * @param {*} value - Valor a convertir
 * @param {number} defaultValue - Valor por defecto si la conversión falla
 * @returns {number} Entero convertido
 */
export const toInteger = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Redondea un número a un número específico de decimales
 * @param {number} value - Número a redondear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {number} Número redondeado
 */
export const round = (value, decimals = 2) => {
  if (!isNumeric(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(parseFloat(value) * factor) / factor;
};

/**
 * Calcula el porcentaje de un valor sobre un total
 * @param {number} value - Valor
 * @param {number} total - Total
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {number} Porcentaje calculado
 */
export const percentage = (value, total, decimals = 2) => {
  if (!isNumeric(value) || !isNumeric(total) || total === 0) return 0;
  return round((parseFloat(value) / parseFloat(total)) * 100, decimals);
};

/**
 * Limita un número entre un mínimo y un máximo
 * @param {number} value - Valor a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor limitado
 */
export const clamp = (value, min, max) => {
  if (!isNumeric(value)) return min;
  const num = parseFloat(value);
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

/**
 * Valida si un número está en un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en el rango
 */
export const isInRange = (value, min, max) => {
  if (!isNumeric(value)) return false;
  const num = parseFloat(value);
  return num >= min && num <= max;
};

/**
 * Genera un número aleatorio entre min y max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @returns {number} Edad calculada
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

