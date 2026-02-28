/**
 * Theme Manager
 * Handles light, dark, and night (tactical) mode switching
 */

const ThemeManager = {
  STORAGE_KEY: 'osmeac-theme',
  themes: ['light', 'dark', 'night'],
  themeIcons: {
    light: '\u2600', // Sun
    dark: '\u263D',  // Moon
    night: '\u2605'  // Star (tactical)
  },

  /**
   * Initialize theme from storage or system preference
   */
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.themes.includes(saved)) {
      this.setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
    this.updateIcon();
  },

  /**
   * Set the current theme
   * @param {string} theme - Theme name (light, dark, night)
   */
  setTheme(theme) {
    if (this.themes.includes(theme)) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateIcon();
    }
  },

  /**
   * Get the current theme
   * @returns {string} - Current theme name
   */
  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  /**
   * Toggle to next theme in cycle
   */
  toggle() {
    const current = this.getCurrent();
    const currentIndex = this.themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
  },

  /**
   * Alias for toggle
   */
  cycle() {
    this.toggle();
  },

  /**
   * Update the theme toggle button icon
   */
  updateIcon() {
    const iconElement = document.querySelector('.theme-icon');
    if (iconElement) {
      const current = this.getCurrent();
      iconElement.textContent = this.themeIcons[current];

      // Update aria-label for accessibility
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        const nextTheme = this.themes[(this.themes.indexOf(current) + 1) % this.themes.length];
        btn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        btn.setAttribute('title', `Current: ${current} mode. Click to switch to ${nextTheme}`);
      }
    }
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();

  // Theme toggle click handler
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    ThemeManager.toggle();
  });
});
