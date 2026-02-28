/**
 * LocalStorage Utilities for Draft Management
 */

const Storage = {
  DRAFT_PREFIX: 'proscons_draft_',
  THEME_KEY: 'usmc-tools-theme',

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to save
   * @returns {boolean} Success status
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
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Retrieved data or default
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
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear items with prefix
   * @param {string} prefix - Key prefix to match
   */
  clearWithPrefix(prefix) {
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => localStorage.removeItem(k));
  },

  /**
   * Save a draft
   * @param {string} name - Draft name/title
   * @param {Object} data - Draft data
   * @returns {string} Draft ID
   */
  saveDraft(name, data) {
    const id = this.DRAFT_PREFIX + Date.now();
    const draft = {
      id,
      name,
      date: new Date().toISOString(),
      proStatement: data.proStatement || '',
      conStatement: data.conStatement || '',
      proMark: data.proMark || '4.0',
      conMark: data.conMark || '4.0',
      performanceLevel: data.performanceLevel || '4.0',
      mosType: data.mosType || 'general'
    };

    this.save(id, draft);
    return id;
  },

  /**
   * Load a draft by ID
   * @param {string} id - Draft ID
   * @returns {Object|null} Draft data or null
   */
  loadDraft(id) {
    return this.load(id, null);
  },

  /**
   * Delete a draft
   * @param {string} id - Draft ID
   */
  deleteDraft(id) {
    this.remove(id);
  },

  /**
   * Get all saved drafts
   * @returns {Array} Array of draft objects
   */
  getAllDrafts() {
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.DRAFT_PREFIX)) {
        const draft = this.load(key);
        if (draft) {
          drafts.push(draft);
        }
      }
    }
    // Sort by date, newest first
    return drafts.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Get draft count
   * @returns {number} Number of saved drafts
   */
  getDraftCount() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.DRAFT_PREFIX))
      .length;
  },

  /**
   * Format date for display
   * @param {string} isoDate - ISO date string
   * @returns {string} Formatted date string
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
};

// Make available globally
window.Storage = Storage;
