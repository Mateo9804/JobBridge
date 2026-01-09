'use strict';

/**
 * Formatea una fecha a formato DD/MM/YYYY
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada en formato DD/MM/YYYY
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha a formato YYYY-MM-DD para inputs de tipo date
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada en formato YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${year}-${month}-${day}`;
};

/**
 * Formatea un número de teléfono español (XXX XX XX XX)
 * @param {string} phone - Número de teléfono sin formato
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Eliminar todos los caracteres no numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Limitar a 9 dígitos
  const limited = numbers.slice(0, 9);
  
  // Formatear como XXX XX XX XX
  let formatted = '';
  if (limited.length > 0) {
    formatted += limited.slice(0, 3);
    if (limited.length > 3) {
      formatted += ' ' + limited.slice(3, 5);
    }
    if (limited.length > 5) {
      formatted += ' ' + limited.slice(5, 7);
    }
    if (limited.length > 7) {
      formatted += ' ' + limited.slice(7, 9);
    }
  }
  
  return formatted;
};

/**
 * Formatea un número de tarjeta de crédito (XXXX XXXX XXXX XXXX)
 * @param {string} cardNumber - Número de tarjeta sin formato
 * @returns {string} Número de tarjeta formateado
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const numbers = cardNumber.replace(/\s/g, '');
  const groups = numbers.match(/.{1,4}/g);
  
  return groups ? groups.join(' ') : numbers;
};

/**
 * Formatea una fecha de expiración (MM/YY)
 * @param {string} expiry - Fecha de expiración sin formato
 * @returns {string} Fecha de expiración formateada
 */
export const formatExpiryDate = (expiry) => {
  if (!expiry) return '';
  
  const numbers = expiry.replace(/\D/g, '');
  if (numbers.length >= 2) {
    return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
  }
  
  return numbers;
};

/**
 * Formatea un número con separadores de miles
 * @param {number|string} number - Número a formatear
 * @param {string} locale - Locale para formateo (por defecto 'es-ES')
 * @returns {string} Número formateado
 */
export const formatNumber = (number, locale = 'es-ES') => {
  if (number === null || number === undefined || number === '') return '';
  
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return '';
  
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formatea un salario con símbolo de euro
 * @param {number|string} salary - Salario a formatear
 * @returns {string} Salario formateado
 */
export const formatSalary = (salary) => {
  if (!salary) return '';
  
  const num = typeof salary === 'string' ? parseFloat(salary) : salary;
  if (isNaN(num)) return '';
  
  return `${formatNumber(num)} €`;
};

/**
 * Formatea un rango de salario
 * @param {number|string} min - Salario mínimo
 * @param {number|string} max - Salario máximo
 * @returns {string} Rango de salario formateado
 */
export const formatSalaryRange = (min, max) => {
  if (!min && !max) return '';
  if (min && max) {
    return `${formatSalary(min)} - ${formatSalary(max)}`;
  }
  if (min) {
    return `Desde ${formatSalary(min)}`;
  }
  if (max) {
    return `Hasta ${formatSalary(max)}`;
  }
  return '';
};

