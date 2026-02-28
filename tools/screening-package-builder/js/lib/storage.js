/**
 * Storage Utility
 * LocalStorage wrapper with error handling
 */
const Storage = {
  STORAGE_PREFIX: 'usmc-spb-',

  save(key, data) {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  },

  clear(prefix) {
    if (prefix) {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.STORAGE_PREFIX + prefix))
        .forEach(k => localStorage.removeItem(k));
    } else {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.STORAGE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }
  },

  getAllPackages() {
    const packages = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX + 'package-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          packages.push(data);
        } catch (e) {
          console.error('Error parsing package:', key);
        }
      }
    }
    return packages.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  },

  generatePackageId() {
    return 'package-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
};
