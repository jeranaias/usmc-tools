/**
 * PFT/CFT Proctor - Utility Functions
 * Common helpers used across modules
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const Utils = {
  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 150) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum time between calls in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Format time from minutes and seconds
   * @param {number} min - Minutes
   * @param {number} sec - Seconds
   * @returns {string} Formatted time MM:SS
   */
  formatTime(min, sec) {
    return `${min || 0}:${String(sec || 0).padStart(2, '0')}`;
  },

  /**
   * Parse time string to seconds
   * @param {string} timeStr - Time in MM:SS format
   * @returns {number} Total seconds
   */
  parseTimeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    const min = parseInt(parts[0]) || 0;
    const sec = parseInt(parts[1]) || 0;
    return (min * 60) + sec;
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Show status message
   * @param {string} type - 'success', 'error', 'info'
   * @param {string} message - Message to show
   * @param {number} duration - Duration in ms
   */
  showStatus(type, message, duration = 3000) {
    // Remove existing status
    const existing = document.querySelector('.status-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `status-toast status-toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Safe getElementById with null check
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  $(id) {
    return document.getElementById(id);
  },

  /**
   * Set element text content safely
   * @param {string} id - Element ID
   * @param {string} text - Text content
   */
  setText(id, text) {
    const el = this.$(id);
    if (el) el.textContent = text;
  },

  /**
   * Get input value safely
   * @param {string} id - Element ID
   * @param {*} defaultValue - Default if empty
   * @returns {string|number}
   */
  getValue(id, defaultValue = '') {
    const el = this.$(id);
    return el ? (el.value || defaultValue) : defaultValue;
  },

  /**
   * Get numeric input value
   * @param {string} id - Element ID
   * @param {number} defaultValue - Default if empty/NaN
   * @returns {number}
   */
  getNumber(id, defaultValue = 0) {
    const el = this.$(id);
    if (!el) return defaultValue;
    const val = parseInt(el.value);
    return isNaN(val) ? defaultValue : val;
  },

  /**
   * Set input value safely
   * @param {string} id - Element ID
   * @param {*} value - Value to set
   */
  setValue(id, value) {
    const el = this.$(id);
    if (el) el.value = value;
  },

  /**
   * Toggle class on element
   * @param {string} id - Element ID
   * @param {string} className - Class to toggle
   * @param {boolean} force - Force add/remove
   */
  toggleClass(id, className, force) {
    const el = this.$(id);
    if (el) el.classList.toggle(className, force);
  },

  /**
   * Add class to element
   * @param {string} id - Element ID
   * @param {string} className - Class to add
   */
  addClass(id, className) {
    const el = this.$(id);
    if (el) el.classList.add(className);
  },

  /**
   * Remove class from element
   * @param {string} id - Element ID
   * @param {string} className - Class to remove
   */
  removeClass(id, className) {
    const el = this.$(id);
    if (el) el.classList.remove(className);
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
