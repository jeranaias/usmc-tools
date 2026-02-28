/**
 * Storage utility for LocalStorage operations
 * Handles JSON serialization/deserialization and error handling
 */
const Storage = {
  STORAGE_KEY: 'restriction-tracker-data',

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} data - Data to store
   * @returns {boolean} - Success status
   */
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Parsed data or default value
   */
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear localStorage data with optional prefix filter
   * @param {string} prefix - Optional prefix to filter keys
   */
  clear(prefix) {
    if (prefix) {
      Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .forEach(k => localStorage.removeItem(k));
    } else {
      localStorage.clear();
    }
  },

  /**
   * Get app data with default structure
   * @returns {Object} - App data object
   */
  getAppData() {
    return this.load(this.STORAGE_KEY, {
      restrictees: [],
      musterRecords: [],
      settings: {
        defaultMusterTimes: ['0600', '1200', '1800', '2200'],
        unitName: '',
        defaultRecorder: ''
      },
      lastUpdated: new Date().toISOString()
    });
  },

  /**
   * Save app data
   * @param {Object} data - App data object
   * @returns {boolean} - Success status
   */
  saveAppData(data) {
    data.lastUpdated = new Date().toISOString();
    return this.save(this.STORAGE_KEY, data);
  },

  /**
   * Generate UUID for new records
   * @returns {string} - UUID string
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

// Make available globally
window.Storage = Storage;
