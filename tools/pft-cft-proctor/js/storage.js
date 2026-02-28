/**
 * LocalStorage Helper Functions
 */

const Storage = {
  PREFIX: 'pft-cft-proctor-',

  /**
   * Save data to localStorage
   */
  save(key, data) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   */
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  /**
   * Clear all app data or items with specific prefix
   */
  clear(prefix = '') {
    try {
      const fullPrefix = this.PREFIX + prefix;
      Object.keys(localStorage)
        .filter(k => k.startsWith(fullPrefix))
        .forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  },

  /**
   * Get all keys with app prefix
   */
  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.PREFIX))
      .map(k => k.replace(this.PREFIX, ''));
  }
};

/**
 * Session Storage for proctor mode
 */
const SessionStorage = {
  KEY: 'proctor-session',

  /**
   * Get current session
   */
  getSession() {
    return Storage.load(this.KEY, {
      marines: [],
      testType: 'pft',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
  },

  /**
   * Save session
   */
  saveSession(session) {
    return Storage.save(this.KEY, session);
  },

  /**
   * Add Marine to session
   */
  addMarine(marine) {
    const session = this.getSession();
    marine.id = Date.now().toString();
    marine.addedAt = new Date().toISOString();
    session.marines.push(marine);
    return this.saveSession(session);
  },

  /**
   * Remove Marine from session
   */
  removeMarine(marineId) {
    const session = this.getSession();
    session.marines = session.marines.filter(m => m.id !== marineId);
    return this.saveSession(session);
  },

  /**
   * Update Marine in session
   */
  updateMarine(marineId, updates) {
    const session = this.getSession();
    const index = session.marines.findIndex(m => m.id === marineId);
    if (index !== -1) {
      session.marines[index] = { ...session.marines[index], ...updates };
      return this.saveSession(session);
    }
    return false;
  },

  /**
   * Clear current session
   */
  clearSession() {
    return Storage.remove(this.KEY);
  },

  /**
   * Update session metadata
   */
  updateSessionInfo(updates) {
    const session = this.getSession();
    Object.assign(session, updates);
    return this.saveSession(session);
  }
};

/**
 * Draft Storage for saving in-progress entries
 */
const DraftStorage = {
  DRAFT_KEY: 'draft',

  /**
   * Save draft
   */
  saveDraft(tabName, data) {
    return Storage.save(`${this.DRAFT_KEY}-${tabName}`, data);
  },

  /**
   * Load draft
   */
  loadDraft(tabName) {
    return Storage.load(`${this.DRAFT_KEY}-${tabName}`, null);
  },

  /**
   * Clear draft
   */
  clearDraft(tabName) {
    return Storage.remove(`${this.DRAFT_KEY}-${tabName}`);
  },

  /**
   * Clear all drafts
   */
  clearAllDrafts() {
    return Storage.clear(this.DRAFT_KEY);
  }
};

/**
 * Theme Manager
 */
const ThemeManager = {
  STORAGE_KEY: 'theme',
  THEMES: ['light', 'dark', 'night'],

  /**
   * Initialize theme from storage or system preference
   */
  init() {
    const saved = Storage.load(this.STORAGE_KEY, null);
    if (saved && this.THEMES.includes(saved)) {
      this.setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  },

  /**
   * Set theme
   */
  setTheme(theme) {
    if (!this.THEMES.includes(theme)) {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    Storage.save(this.STORAGE_KEY, theme);

    // Update theme toggle button text if it exists
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const icons = { light: 'Light', dark: 'Dark', night: 'Night' };
      btn.textContent = icons[theme];
    }
  },

  /**
   * Toggle to next theme
   */
  toggle() {
    const current = this.getCurrent();
    const nextIndex = (this.THEMES.indexOf(current) + 1) % this.THEMES.length;
    this.setTheme(this.THEMES[nextIndex]);
  },

  /**
   * Get current theme
   */
  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Storage, SessionStorage, DraftStorage, ThemeManager };
}
