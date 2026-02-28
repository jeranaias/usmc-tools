/**
 * Theme Manager
 * Handles dark/light/night mode switching
 * Dark mode is the default (OSMEAC style)
 */
const ThemeManager = {
  STORAGE_KEY: 'usmc-tools-theme',
  themes: ['dark', 'light', 'night'],
  themeIcons: {
    dark: '&#9790;',   // moon
    light: '&#9728;',  // sun
    night: '&#9733;'   // star
  },

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.themes.includes(saved)) {
      this.setTheme(saved);
    } else {
      // Default to dark mode
      this.setTheme('dark');
    }
    this.updateAllToggleButtons();
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateAllToggleButtons();
  },

  // Alias for toggle - cycles through themes
  cycle() {
    const current = this.getCurrent();
    const nextIndex = (this.themes.indexOf(current) + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
  },

  toggle() {
    this.cycle();
  },

  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  updateAllToggleButtons() {
    const current = this.getCurrent();
    const icon = this.themeIcons[current];

    // Update all theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = icon;
      btn.title = `Current: ${current} mode (click to switch)`;
    });

    // Also update legacy id-based toggle
    const toggle = document.getElementById('themeIcon');
    if (toggle) {
      toggle.innerHTML = icon;
    }
  }
};
