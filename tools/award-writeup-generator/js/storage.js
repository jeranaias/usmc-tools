/**
 * Award Write-Up Generator - Storage Utilities
 * LocalStorage helpers for saving drafts and preferences
 */

const Storage = {
  PREFIX: 'usmc-award-',

  // Save data to localStorage
  save(key, data) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  // Load data from localStorage
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  // Clear all items with prefix
  clearAll() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.PREFIX))
        .forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  },

  // Save current form state as draft
  saveDraft(formData) {
    const draft = {
      ...formData,
      savedAt: new Date().toISOString()
    };
    return this.save('draft', draft);
  },

  // Load draft
  loadDraft() {
    return this.load('draft', null);
  },

  // Clear draft
  clearDraft() {
    return this.remove('draft');
  },

  // Save theme preference
  saveTheme(theme) {
    return this.save('theme', theme);
  },

  // Load theme preference
  loadTheme() {
    return this.load('theme', 'light');
  },

  // Check if draft exists and is recent (within 24 hours)
  hasDraft() {
    const draft = this.loadDraft();
    if (!draft || !draft.savedAt) return false;

    const savedTime = new Date(draft.savedAt).getTime();
    const now = new Date().getTime();
    const hoursOld = (now - savedTime) / (1000 * 60 * 60);

    return hoursOld < 24;
  }
};


// Theme Toggle - Consistent across all USMC Tools
const THEMES = ['dark', 'light', 'night'];
const THEME_ICONS = {
  dark: '🌙',
  light: '☀️',
  night: '⭐'
};

class ThemeToggle {
  constructor() {
    this.currentIndex = 0;
    this.init();
  }

  init() {
    // Load saved theme, default to dark
    const saved = localStorage.getItem('usmc-tools-theme') || 'dark';
    this.currentIndex = THEMES.indexOf(saved);
    if (this.currentIndex === -1) this.currentIndex = 0;
    this.apply();
  }

  toggle() {
    this.currentIndex = (this.currentIndex + 1) % THEMES.length;
    this.apply();
    localStorage.setItem('usmc-tools-theme', THEMES[this.currentIndex]);
  }

  apply() {
    const theme = THEMES[this.currentIndex];
    document.documentElement.setAttribute('data-theme', theme);

    // Update button icon if exists
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.innerHTML = THEME_ICONS[theme];
  }

  getCurrentTheme() {
    return THEMES[this.currentIndex];
  }
}

// Initialize on load
const themeToggle = new ThemeToggle();

// Export for button onclick
window.toggleTheme = () => themeToggle.toggle();

// Legacy support for ThemeManager calls
const ThemeManager = {
  init() { /* handled by ThemeToggle constructor */ },
  toggle() { themeToggle.toggle(); }
};
