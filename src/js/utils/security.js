/**
 * Security Utility Module for Input Sanitization and XSS Prevention
 */

/**
 * Escapes HTML special characters in strings before rendering in DOM.
 * @param {string} str - Raw input string
 * @returns {string} Sanitized string safe for HTML interpolation
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escapes HTML attributes to prevent attribute injection vulnerabilities.
 * @param {string} str - Attribute value
 * @returns {string} Sanitized attribute value
 */
export function escapeAttr(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
