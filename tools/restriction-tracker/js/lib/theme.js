/**
 * Theme management for light/dark/night modes
 */
const ThemeManager = {
  STORAGE_KEY: 'usmc-tools-theme',
  THEMES: ['dark', 'light', 'night'],  // Dark is now the default

  /**
   * Initialize theme from storage or system preference
   */
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.THEMES.includes(saved)) {
      this.setTheme(saved);
    } else {
      // Default to dark mode
      this.setTheme('dark');
    }
  },

  /**
   * Set the current theme
   * @param {string} theme - Theme name (dark, light, night)
   */
  setTheme(theme) {
    if (!this.THEMES.includes(theme)) {
      theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Update theme-color meta tag
    const themeColors = {
      dark: '#5C1A1A',
      light: '#8B0000',
      night: '#0A0A0A'
    };
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColors[theme] || '#5C1A1A');
    }
  },

  /**
   * Toggle to next theme in cycle
   */
  toggle() {
    const current = this.getCurrent();
    const currentIndex = this.THEMES.indexOf(current);
    const nextIndex = (currentIndex + 1) % this.THEMES.length;
    this.setTheme(this.THEMES[nextIndex]);
  },

  /**
   * Get current theme
   * @returns {string} - Current theme name
   */
  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  /**
   * Get theme display name
   * @param {string} theme - Theme identifier
   * @returns {string} - Display name
   */
  getDisplayName(theme) {
    const names = {
      dark: 'Dark',
      light: 'Light',
      night: 'Night (Tactical)'
    };
    return names[theme] || 'Dark';
  }
};

// Make available globally
window.ThemeManager = ThemeManager;
