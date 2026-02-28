/**
 * PFT/CFT Proctor - Main Application
 * NAVMC 11622 Performance Worksheet Generator
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

/**
 * Theme management - 3-way toggle (dark/light/night)
 */
const THEMES = ['dark', 'light', 'night'];
const THEME_ICONS = {
  dark: '&#9790;',   // Moon (crescent)
  light: '&#9788;',  // Sun
  night: '&#9733;'   // Star
};

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEMES.length;
  setTheme(THEMES[nextIndex]);
}

function setTheme(theme) {
  // Validate theme
  if (!THEMES.includes(theme)) {
    theme = 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('usmc-tools-theme', theme);
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  // Use native DOM to avoid dependency on Utils during early initialization
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.innerHTML = THEME_ICONS[theme] || THEME_ICONS.dark;
  }

  // Update button title for accessibility
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    btn.title = `Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode (click for ${nextTheme})`;
  }
}

function initTheme() {
  // Check both old and new localStorage keys for migration
  const savedTheme = localStorage.getItem('usmc-tools-theme') || localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(theme);
}

/**
 * Keyboard shortcuts
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && !e.shiftKey && !e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'd':
          // Ctrl+D - Download PDF
          e.preventDefault();
          PreviewManager.downloadPDF();
          Utils.showStatus('info', 'Downloading PDF (Ctrl+D)');
          break;
        case 'p':
          // Ctrl+P - Print PDF
          e.preventDefault();
          PreviewManager.printPDF();
          break;
        case 's':
          // Ctrl+S - Export session
          e.preventDefault();
          SessionManager.exportSession();
          Utils.showStatus('success', 'Session exported (Ctrl+S)');
          break;
        case 'l':
          // Ctrl+L - Toggle live preview
          e.preventDefault();
          PreviewManager.toggle();
          break;
      }
    }

    // Escape - close modals/preview
    if (e.key === 'Escape') {
      PreviewManager.closeModal();
      PreviewManager.closePane();
    }
  });
}

/**
 * Offline indicator
 */
function updateOfflineIndicator(status, text) {
  const indicator = document.getElementById('offline-indicator');
  if (!indicator) return;

  indicator.classList.remove('ready', 'offline');
  indicator.classList.add(status);

  const textEl = indicator.querySelector('.indicator-text');
  if (textEl) textEl.textContent = text;
}

function initOfflineIndicator() {
  window.addEventListener('online', () => {
    updateOfflineIndicator('ready', 'Back online');
    setTimeout(() => updateOfflineIndicator('ready', 'Ready offline'), 2000);
  });

  window.addEventListener('offline', () => {
    updateOfflineIndicator('offline', 'Offline mode');
  });

  if (!navigator.onLine) {
    updateOfflineIndicator('offline', 'Offline mode');
  }
}

/**
 * Service Worker registration
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          updateOfflineIndicator('ready', 'Ready offline');
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
          updateOfflineIndicator('offline', 'Online only');
        });
    });
  } else {
    updateOfflineIndicator('offline', 'Online only');
  }
}

/**
 * PWA Install prompt handling
 */
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default browser prompt
  e.preventDefault();
  // Store the event for later use
  deferredInstallPrompt = e;
  // Show our install button
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';
  }
});

function installPWA() {
  if (!deferredInstallPrompt) {
    Utils.showStatus('info', 'Use browser menu to install');
    return;
  }

  // Show the browser install prompt
  deferredInstallPrompt.prompt();

  // Wait for user response
  deferredInstallPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      Utils.showStatus('success', 'App installed!');
    }
    // Clear the deferred prompt
    deferredInstallPrompt = null;
    // Hide our button
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  });
}

/**
 * Test type selection (PFT vs CFT)
 */
let currentTestType = 'pft';

function selectTestType(type) {
  currentTestType = type;

  // Update tab states
  const pftTab = document.getElementById('select-pft');
  const cftTab = document.getElementById('select-cft');

  if (pftTab) pftTab.classList.toggle('test-tab--active', type === 'pft');
  if (cftTab) cftTab.classList.toggle('test-tab--active', type === 'cft');

  // Show/hide relevant sections
  const pftSection = document.getElementById('pft-section');
  const cftSection = document.getElementById('cft-section');

  if (pftSection) pftSection.style.display = type === 'pft' ? 'block' : 'none';
  if (cftSection) cftSection.style.display = type === 'cft' ? 'block' : 'none';

  // Save preference
  localStorage.setItem('testType', type);
}

/**
 * Global API for onclick handlers
 * (These bridge HTML onclick to module methods)
 */
const App = {
  // Theme
  toggleTheme,

  // PWA
  installPWA,

  // Test type
  selectTestType,

  // Form handlers
  toggleSection: (id) => FormHandler.toggleSection(id),
  adjustCount: (type, delta) => FormHandler.adjustCount(type, delta),
  addMarineToWorksheet: () => FormHandler.addMarineToWorksheet(),
  clearForm: () => FormHandler.clearForm(),

  // Scoring
  setUpperEvent: (type) => ScoringCalculator.setUpperEvent(type),
  setCardioEvent: (type) => ScoringCalculator.setCardioEvent(type),
  calculateScores: () => ScoringCalculator.triggerPFTUpdate(),
  calculateCFTScores: () => ScoringCalculator.triggerCFTUpdate(),

  // Session
  clearAllMarines: () => SessionManager.clearAll(),
  exportSession: () => SessionManager.exportSession(),
  loadExample: () => SessionManager.loadExampleRoster(),

  // Preview
  togglePreview: () => PreviewManager.toggle(),
  generateNAVMC: () => PreviewManager.downloadPDF(),
  previewNAVMC: () => PreviewManager.openMobilePreview(),
  closePreview: () => PreviewManager.closeModal()
};

/**
 * Initialize the application
 */
async function initApp() {
  console.log('PFT/CFT Proctor v2.0 initializing...');

  // Initialize theme immediately (prevents flash)
  initTheme();

  // Restore test type preference
  const savedTestType = localStorage.getItem('testType') || 'pft';
  selectTestType(savedTestType);

  // Initialize core modules
  FormHandler.init();
  ScoringCalculator.init();
  SessionManager.init();

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();

  // Defer non-critical initialization
  requestAnimationFrame(() => {
    PreviewManager.init();
    initOfflineIndicator();
  });

  // Register service worker last
  registerServiceWorker();

  console.log('PFT/CFT Proctor v2.0 ready!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
