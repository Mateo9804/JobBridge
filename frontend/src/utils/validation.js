'use strict';

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida si un teléfono tiene formato válido (9 dígitos)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si el teléfono es válido
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 9;
};

/**
 * Valida si una fecha de expiración de tarjeta es válida (MM/YY)
 * @param {string} expiry - Fecha de expiración a validar
 * @returns {boolean} true si la fecha es válida y no está en el pasado
 */
export const isValidExpiryDate = (expiry) => {
  if (!expiry || typeof expiry !== 'string') return false;
  
  const numbers = expiry.replace(/\D/g, '');
  if (numbers.length !== 4) return false;
  
  const month = parseInt(numbers.slice(0, 2), 10);
  const year = parseInt('20' + numbers.slice(2, 4), 10);
  
  if (month < 1 || month > 12) return false;
  
  const expiryDate = new Date(year, month, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return expiryDate >= today;
};

/**
 * Valida si un número de tarjeta de crédito tiene formato válido (Luhn algorithm)
 * @param {string} cardNumber - Número de tarjeta a validar
 * @returns {boolean} true si el número de tarjeta es válido
 */
export const isValidCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  const numbers = cardNumber.replace(/\s/g, '');
  if (numbers.length < 13 || numbers.length > 19) return false;
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = numbers.length - 1; i >= 0; i--) {
    let digit = parseInt(numbers[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Valida si un CVV tiene formato válido (3 o 4 dígitos)
 * @param {string} cvv - CVV a validar
 * @returns {boolean} true si el CVV es válido
 */
export const isValidCVV = (cvv) => {
  if (!cvv || typeof cvv !== 'string') return false;
  const numbers = cvv.replace(/\D/g, '');
  return numbers.length === 3 || numbers.length === 4;
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima (por defecto 4)
 * @returns {boolean} true si la contraseña es válida
 */
export const isValidPassword = (password, minLength = 4) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= minLength;
};

/**
 * Valida si una cadena no está vacía
 * @param {string} str - Cadena a validar
 * @returns {boolean} true si la cadena no está vacía
 */
export const isNotEmpty = (str) => {
  return str !== null && str !== undefined && String(str).trim().length > 0;
};

/**
 * Valida si una cadena tiene una longitud mínima
 * @param {string} str - Cadena a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} true si la cadena cumple con la longitud mínima
 */
export const hasMinLength = (str, minLength) => {
  if (!str || typeof str !== 'string') return false;
  return str.trim().length >= minLength;
};

/**
 * Valida si una cadena tiene una longitud máxima
 * @param {string} str - Cadena a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si la cadena cumple con la longitud máxima
 */
export const hasMaxLength = (str, maxLength) => {
  if (!str || typeof str !== 'string') return true;
  return str.trim().length <= maxLength;
};

/**
 * Valida si una fecha es válida
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} true si la fecha es válida
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Valida si una edad está en un rango válido
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @param {number} minAge - Edad mínima (por defecto 16)
 * @param {number} maxAge - Edad máxima (por defecto 90)
 * @returns {boolean} true si la edad está en el rango válido
 */
export const isValidAge = (birthDate, minAge = 16, maxAge = 90) => {
  if (!birthDate) return false;
  
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return false;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

