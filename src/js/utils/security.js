/**
 * Security Utility Module for Input Sanitization and XSS Prevention
 */

/**
 * Escapes HTML special characters in strings before rendering in DOM.
 * @param {any} str - Raw input value
 * @returns {string} Sanitized string safe for HTML interpolation
 */
export function sanitizeHTML(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;');
}

/**
 * Escapes HTML attributes to prevent attribute injection vulnerabilities.
 * @param {any} str - Attribute value
 * @returns {string} Sanitized attribute value
 */
export function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`/g, '&#96;');
}

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

/**
 * Validates and sanitizes a URL before use in href or src attributes.
 * Prevents javascript:, data:text/html, and vbscript: execution vectors.
 * @param {string} url - Target URL
 * @param {string} fallback - Fallback URL if invalid
 * @returns {string} Safe sanitized URL
 */
export function sanitizeUrl(url, fallback = DEFAULT_FALLBACK_IMAGE) {
  if (!url || typeof url !== 'string' || url === '#' || url === 'about:blank') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Allow relative URLs starting with / or #
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    // Prevent protocol-relative URLs (//evil.com) unless expected
    if (trimmed.startsWith('//')) return fallback;
    return escapeAttr(trimmed);
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    const allowedProtocols = ['http:', 'https:', 'tel:', 'mailto:'];
    if (allowedProtocols.includes(parsed.protocol)) {
      return escapeAttr(trimmed);
    }
    // Allow safe data URIs for images only
    if (parsed.protocol === 'data:' && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed)) {
      return trimmed; // valid image data URI
    }
  } catch (e) {
    // Relative path or parse error
    if (/^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) {
      return escapeAttr(trimmed);
    }
  }
  return fallback;
}

/**
 * Sanitizes phone numbers for safe use in tel: links and WhatsApp URLs.
 * @param {string} phone - Raw phone number
 * @returns {string} Clean numeric phone string with optional leading +
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^\d+]/g, '');
}
