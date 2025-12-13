/**
 * Validation Utilities for Frontend
 * 
 * Provides email and phone number validation and formatting functions
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * Validates phone number (must be exactly 10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits
  return /^\d{10}$/.test(digitsOnly);
};

/**
 * Formats phone number by adding +91 prefix
 * Validates that the number is exactly 10 digits before formatting
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number with +91 prefix (e.g., "+911234567890")
 * @throws {Error} - If phone number is invalid
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) {
    return '';
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Validate it's exactly 10 digits
  if (!/^\d{10}$/.test(digitsOnly)) {
    throw new Error('Phone number must be exactly 10 digits');
  }
  
  // Add +91 prefix
  return `+91${digitsOnly}`;
};

/**
 * Normalizes phone number for display (removes +91 prefix if present)
 * @param {string} phone - Phone number to normalize
 * @returns {string} - 10-digit phone number without prefix
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) {
    return '';
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If it starts with 91 and has 12 digits, remove the 91 prefix
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.substring(2);
  }
  
  // If it's 10 digits, return as is
  if (digitsOnly.length === 10) {
    return digitsOnly;
  }
  
  return digitsOnly;
};

/**
 * Formats phone number input - only allows digits and limits to 10 digits
 * @param {string} value - Input value
 * @returns {string} - Formatted value (only digits, max 10)
 */
export const formatPhoneInput = (value) => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  return digitsOnly.slice(0, 10);
};

