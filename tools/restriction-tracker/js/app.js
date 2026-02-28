/**
 * Main application for Restriction Tracker
 * Initializes and coordinates all modules
 * Version 1.4.0
 */

/**
 * PWA Install prompt handling
 */
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';
  }
});

function installPWA() {
  if (!deferredInstallPrompt) {
    alert('To install: Use your browser menu and select "Add to Home Screen" or "Install App"');
    return;
  }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choiceResult) => {
    deferredInstallPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  });
}

const App = {
  VERSION: '1.6.0',
  installPWA,
  FIRST_RUN_KEY: 'restriction-tracker-welcomed',

  // Current state
  currentView: 'roster',
  currentRestrictee: null,
  currentMusterTime: null,
  editingId: null,
  customMusterTimes: [],

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    ThemeManager.init();

    // Set up event listeners
    this.bindEvents();
    this.bindKeyboardShortcuts();

    // Check for first run
    if (!localStorage.getItem(this.FIRST_RUN_KEY)) {
      this.showWelcomeModal();
    }

    // Load initial view
    this.renderRoster();

    // Set default date for report
    document.getElementById('report-date').value = DateUtils.today();

    // Load settings
    this.loadSettings();

    // Update roster periodically for muster status
    setInterval(() => this.updateRosterStatus(), 60000);

    // Online/offline detection
    this.setupOfflineDetection();

    // Scroll detection for header shadow
    this.setupScrollDetection();

    console.log(`Restriction Tracker v${this.VERSION} initialized`);
  },

  /**
   * Setup scroll detection for header shadow
   */
  setupScrollDetection() {
    const header = document.querySelector('.header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // PWA install button
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    if (pwaInstallBtn) {
      pwaInstallBtn.addEventListener('click', () => this.installPWA());
    }

    // Header buttons
    document.getElementById('settings-btn')?.addEventListener('click', () => this.showSettingsModal());
    document.getElementById('theme-btn').addEventListener('click', () => ThemeManager.toggle());

    // Top tab navigation
    document.querySelectorAll('.top-tabs__tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Add person buttons
    document.getElementById('add-person-btn').addEventListener('click', () => this.showFormView());
    document.getElementById('add-first-btn').addEventListener('click', () => this.showFormView());

    // Completed section toggle
    document.getElementById('completed-toggle').addEventListener('click', () => this.toggleCompletedSection());

    // Form view
    document.getElementById('form-cancel-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('form-save-btn').addEventListener('click', () => this.savePerson());
    document.getElementById('person-startdate').addEventListener('change', () => this.updateEndDate());
    document.getElementById('person-days').addEventListener('change', () => this.updateEndDate());
    document.getElementById('add-custom-time-btn').addEventListener('click', () => this.addCustomMusterTime());

    // Sign-in view
    document.getElementById('signin-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('signin-present').addEventListener('click', () => this.recordMuster('present'));
    document.getElementById('signin-late').addEventListener('click', () => this.recordMuster('late'));
    document.getElementById('signin-missed').addEventListener('click', () => this.recordMuster('missed'));
    document.getElementById('signin-excused').addEventListener('click', () => this.recordMuster('excused'));

    // Detail view
    document.getElementById('detail-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('detail-export-btn').addEventListener('click', () => this.exportIndividualReport());
    document.getElementById('detail-edit-btn').addEventListener('click', () => this.editCurrentRestrictee());
    document.getElementById('detail-end-btn').addEventListener('click', () => this.endRestriction());

    // Report view
    document.getElementById('report-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('report-export-btn').addEventListener('click', () => this.exportDailyReport());
    document.getElementById('report-date').addEventListener('change', () => this.renderReport());

    // Settings modal
    document.getElementById('settings-close-btn').addEventListener('click', () => this.hideSettingsModal());
    document.getElementById('settings-save-btn').addEventListener('click', () => this.saveSettings());
    document.getElementById('view-report-btn').addEventListener('click', () => {
      this.hideSettingsModal();
      this.showReportView();
    });
    document.getElementById('clear-data-btn').addEventListener('click', () => this.confirmClearData());

    // Data management buttons
    document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
    document.getElementById('import-data-btn').addEventListener('click', () => {
      document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', (e) => this.importData(e));
    document.getElementById('load-demo-btn').addEventListener('click', () => {
      this.loadDemoData();
      this.hideSettingsModal();
    });

    // Theme radio buttons in settings
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        ThemeManager.setTheme(e.target.value);
      });
    });

    // Confirm modal
    document.getElementById('confirm-cancel-btn').addEventListener('click', () => this.hideConfirmModal());
    document.getElementById('confirm-ok-btn').addEventListener('click', () => this.handleConfirm());

    // Help modal
    document.getElementById('help-close-btn').addEventListener('click', () => this.hideHelpModal());
    document.getElementById('help-ok-btn').addEventListener('click', () => this.hideHelpModal());

    // Welcome modal
    const welcomeStartBtn = document.getElementById('welcome-start-btn');
    const welcomeDemoBtn = document.getElementById('welcome-demo-btn');

    if (welcomeStartBtn) {
      welcomeStartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideWelcomeModal();
      });
    }

    if (welcomeDemoBtn) {
      welcomeDemoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideWelcomeModal();
        this.loadDemoData();
      });
    }

    // Close modals on overlay click
    document.getElementById('settings-modal').addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal') this.hideSettingsModal();
    });
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
      if (e.target.id === 'confirm-modal') this.hideConfirmModal();
    });
    document.getElementById('help-modal').addEventListener('click', (e) => {
      if (e.target.id === 'help-modal') this.hideHelpModal();
    });
    document.getElementById('welcome-modal').addEventListener('click', (e) => {
      if (e.target.id === 'welcome-modal') this.hideWelcomeModal();
    });
  },

  /**
   * Bind keyboard shortcuts
   */
  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      // Check for modals
      const hasActiveModal = document.querySelector('.modal-overlay--active');

      switch (e.key.toLowerCase()) {
        case 'n':
          if (!hasActiveModal) {
            e.preventDefault();
            this.showFormView();
          }
          break;
        case 'r':
          if (!hasActiveModal) {
            e.preventDefault();
            this.showReportView();
          }
          break;
        case 's':
          if (!hasActiveModal) {
            e.preventDefault();
            this.showSettingsModal();
          }
          break;
        case 't':
          if (!hasActiveModal) {
            e.preventDefault();
            ThemeManager.toggle();
          }
          break;
        case '?':
          e.preventDefault();
          if (hasActiveModal) {
            this.hideAllModals();
          }
          this.showHelpModal();
          break;
        case 'escape':
          if (hasActiveModal) {
            this.hideAllModals();
          } else if (this.currentView !== 'roster') {
            this.showRosterView();
          }
          break;
      }
    });
  },

  /**
   * Setup offline detection
   */
  setupOfflineDetection() {
    const updateOnlineStatus = () => {
      if (!navigator.onLine) {
        this.showToast('You are offline. Data is saved locally.', 'warning');
      }
    };

    window.addEventListener('online', () => {
      this.showToast('Back online', 'success');
    });

    window.addEventListener('offline', updateOnlineStatus);
  },

  /**
   * Show a specific view
   */
  showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
    document.getElementById(viewId).classList.add('view--active');
    this.currentView = viewId.replace('-view', '');

    // Toggle form-active class for styling
    if (viewId === 'form-view') {
      document.body.classList.add('form-active');
    } else {
      document.body.classList.remove('form-active');
    }
  },

  /**
   * Switch to a tab (Roster, Sign In, Reports, Settings)
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.top-tabs__tab').forEach(tab => {
      tab.classList.remove('top-tabs__tab--active');
      if (tab.dataset.tab === tabName) {
        tab.classList.add('top-tabs__tab--active');
      }
    });

    // Handle the view change
    switch (tabName) {
      case 'roster':
        this.showRosterView();
        break;
      case 'signin':
        this.showQuickSignIn();
        break;
      case 'reports':
        this.showReportView();
        break;
      case 'settings':
        this.showSettingsModal();
        break;
    }
  },

  /**
   * Show quick sign-in - shows first person needing a muster or roster if none
   */
  showQuickSignIn() {
    const active = Roster.getAll().filter(r => r.active);
    if (active.length === 0) {
      this.showToast('Add restrictees first to use quick sign-in', 'info');
      this.showRosterView();
      return;
    }

    // Find someone who needs a muster soon
    const now = new Date();
    const currentTime = DateUtils.formatTime(now);
    let targetRestrictee = null;
    let targetMusterTime = null;

    // First try to find someone with an upcoming muster within the hour
    for (const r of active) {
      for (const time of r.musterTimes) {
        const [h, m] = time.split(':').map(Number);
        const musterMinutes = h * 60 + m;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const diff = musterMinutes - currentMinutes;

        // Within the next hour or just passed (within 30 min)
        if (diff >= -30 && diff <= 60) {
          // Check if not already signed in for this time today
          const musters = MusterLog.getForRestrictee(r.id);
          const today = DateUtils.today();
          const alreadySigned = musters.some(m =>
            m.date === today && m.scheduledTime === time
          );

          if (!alreadySigned) {
            targetRestrictee = r;
            targetMusterTime = time;
            break;
          }
        }
      }
      if (targetRestrictee) break;
    }

    if (targetRestrictee) {
      this.showSignInView(targetRestrictee.id, targetMusterTime);
    } else {
      // No urgent musters, show first active person with their first muster time
      const first = active[0];
      this.showSignInView(first.id, first.musterTimes[0]);
    }
  },

  /**
   * Show roster view
   */
  showRosterView() {
    this.showView('roster-view');
    this.renderRoster();
  },

  /**
   * Show form view for adding/editing
   */
  showFormView(id = null) {
    this.editingId = id;
    this.customMusterTimes = [];

    if (id) {
      const restrictee = Roster.getById(id);
      if (!restrictee) return;

      document.getElementById('form-title').textContent = 'Edit Restrictee';
      this.populateForm(restrictee);
    } else {
      document.getElementById('form-title').textContent = 'Add Restrictee';
      this.resetForm();
    }

    this.showView('form-view');
  },

  /**
   * Show sign-in view
   */
  showSignInView(restricteeId, musterTime) {
    const restrictee = Roster.getById(restricteeId);
    if (!restrictee) return;

    this.currentRestrictee = restrictee;
    this.currentMusterTime = musterTime;

    const personInfo = document.getElementById('signin-person-info');
    personInfo.innerHTML = `
      <h2 class="signin-person__name">${Roster.getDisplayName(restrictee)}</h2>
      <p class="signin-person__muster">${DateUtils.formatTimeDisplay(musterTime)} Muster</p>
    `;

    const settings = Storage.getAppData().settings;
    document.getElementById('signin-recorder').value = settings.defaultRecorder || '';
    document.getElementById('signin-notes-group').classList.add('hidden');
    document.getElementById('signin-notes').value = '';

    this.showView('signin-view');
  },

  /**
   * Show detail view for a restrictee
   */
  showDetailView(restricteeId) {
    const restrictee = Roster.getById(restricteeId);
    if (!restrictee) return;

    this.currentRestrictee = restrictee;
    document.getElementById('detail-title').textContent = Roster.getDisplayName(restrictee);

    this.renderDetailContent(restrictee);
    this.showView('detail-view');
  },

  /**
   * Show report view
   */
  showReportView() {
    this.renderReport();
    this.showView('report-view');
  },

  /**
   * Render the roster list
   */
  renderRoster() {
    const restrictees = Roster.sortForDisplay(Roster.getAll());
    const active = restrictees.filter(r => r.active);
    const completed = restrictees.filter(r => !r.active);

    const rosterList = document.getElementById('roster-list');
    const emptyState = document.getElementById('empty-state');
    const completedSection = document.getElementById('completed-section');

    if (active.length === 0) {
      rosterList.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      rosterList.innerHTML = active.map(r => this.renderRosterCard(r)).join('');
      this.bindRosterCardEvents();
    }

    if (completed.length > 0) {
      completedSection.classList.remove('hidden');
      document.getElementById('completed-toggle').querySelector('span').textContent =
        `Completed Restrictions (${completed.length})`;
      document.getElementById('completed-list').innerHTML =
        completed.map(r => this.renderRosterCard(r, true)).join('');
    } else {
      completedSection.classList.add('hidden');
    }

    // Update pending muster badge
    this.updatePendingMusterBadge();
  },

  /**
   * Update the pending muster count (for future use)
   */
  updatePendingMusterBadge() {
    // Badge removed with tabs - urgent musters are shown via card styling
  },

  /**
   * Render a single roster card
   */
  renderRosterCard(restrictee, isCompleted = false) {
    const status = Roster.getStatus(restrictee);
    const daysRemaining = status.daysRemaining;
    const daysText = daysRemaining > 0
      ? `${daysRemaining} of ${restrictee.daysAwarded} days remaining`
      : 'Restriction complete';

    // Calculate progress percentage
    const daysServed = restrictee.daysAwarded - daysRemaining;
    const progressPercent = Math.min(100, Math.round((daysServed / restrictee.daysAwarded) * 100));
    let progressClass = '';
    if (progressPercent >= 80) progressClass = 'days-progress__bar--success';
    else if (progressPercent >= 50) progressClass = 'days-progress__bar--warning';

    // Determine card urgency class
    let cardClass = 'roster-card';
    if (!isCompleted && status.nextMuster) {
      if (status.nextMuster.status === 'overdue' || status.nextMuster.status === 'due') {
        cardClass += ' roster-card--urgent';
      } else if (status.nextMuster.status === 'soon') {
        cardClass += ' roster-card--soon';
      }
    }

    let nextMusterText = '';
    if (!isCompleted && status.nextMuster) {
      const nm = status.nextMuster;
      const timeDisplay = DateUtils.formatTimeDisplay(nm.time);
      const untilText = DateUtils.formatMinutesUntil(nm.minutesUntil);

      let musterClass = 'roster-card__muster';
      if (nm.status === 'soon') musterClass += ' roster-card__muster--soon';
      if (nm.status === 'due' || nm.status === 'overdue') musterClass += ' roster-card__muster--overdue';

      nextMusterText = `<p class="${musterClass}">Next muster: ${timeDisplay} (${untilText})</p>`;
    } else if (!isCompleted && !status.nextMuster) {
      nextMusterText = '<p class="roster-card__muster">All musters complete for today</p>';
    }

    const typeLabel = restrictee.restrictionType !== 'restriction'
      ? `<span class="roster-card__type">${Roster.getTypeDisplayName(restrictee.restrictionType)}</span>`
      : '';

    const signInBtn = !isCompleted && status.nextMuster
      ? `<button class="btn btn--primary btn--sm signin-btn-action" data-id="${restrictee.id}" data-time="${status.nextMuster.time}">Sign In</button>`
      : '';

    const progressBar = !isCompleted
      ? `<div class="days-progress"><div class="days-progress__bar ${progressClass}" style="width: ${progressPercent}%"></div></div>`
      : '';

    return `
      <div class="${cardClass}" data-id="${restrictee.id}">
        <div class="roster-card__header">
          <span class="roster-card__status ${status.statusClass}">${status.statusIcon}</span>
          <div class="roster-card__info">
            <h3 class="roster-card__name">${Roster.getDisplayName(restrictee)}${typeLabel}</h3>
            <p class="roster-card__meta">${daysText}</p>
            ${progressBar}
            ${nextMusterText}
          </div>
        </div>
        <div class="roster-card__actions">
          ${signInBtn}
          <button class="btn btn--outline btn--sm view-log-btn" data-id="${restrictee.id}">View Log</button>
          <button class="btn btn--ghost btn--sm edit-btn" data-id="${restrictee.id}">Edit</button>
        </div>
      </div>
    `;
  },

  /**
   * Bind events to roster card buttons
   */
  bindRosterCardEvents() {
    document.querySelectorAll('.signin-btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const time = e.currentTarget.dataset.time;
        this.showSignInView(id, time);
      });
    });

    document.querySelectorAll('.view-log-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        this.showDetailView(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        this.showFormView(id);
      });
    });
  },

  /**
   * Update roster status
   */
  updateRosterStatus() {
    if (this.currentView === 'roster') {
      this.renderRoster();
    }
  },

  /**
   * Toggle completed section visibility
   */
  toggleCompletedSection() {
    const toggle = document.getElementById('completed-toggle');
    const list = document.getElementById('completed-list');
    toggle.classList.toggle('expanded');
    list.classList.toggle('hidden');
  },

  /**
   * Reset the person form
   */
  resetForm() {
    document.getElementById('person-form').reset();
    document.getElementById('person-startdate').value = DateUtils.today();
    document.getElementById('person-days').value = '30';
    this.updateEndDate();
    document.querySelectorAll('.muster-time-cb').forEach(cb => cb.checked = true);
    this.customMusterTimes = [];
    this.renderCustomMusterTimes();
  },

  /**
   * Populate form with restrictee data
   */
  populateForm(restrictee) {
    document.getElementById('person-rank').value = restrictee.rank;
    document.getElementById('person-lastname').value = restrictee.lastName;
    document.getElementById('person-firstname').value = restrictee.firstName;
    document.getElementById('person-mi').value = restrictee.mi || '';
    document.getElementById('person-edipi').value = restrictee.edipi || '';
    document.getElementById('person-unit').value = restrictee.unit || '';

    document.querySelector(`input[name="restriction-type"][value="${restrictee.restrictionType}"]`).checked = true;

    document.getElementById('person-startdate').value = restrictee.startDate;
    document.getElementById('person-days').value = restrictee.daysAwarded;
    document.getElementById('person-enddate').value = restrictee.endDate;

    document.getElementById('person-offense').value = restrictee.offense || '';
    document.getElementById('person-notes').value = restrictee.notes || '';

    const standardTimes = ['0600', '1200', '1800', '2200'];
    document.querySelectorAll('.muster-time-cb').forEach(cb => {
      cb.checked = restrictee.musterTimes.includes(cb.value);
    });

    this.customMusterTimes = restrictee.musterTimes.filter(t => !standardTimes.includes(t));
    this.renderCustomMusterTimes();
  },

  /**
   * Update end date based on start date and days
   */
  updateEndDate() {
    const startDate = document.getElementById('person-startdate').value;
    const days = parseInt(document.getElementById('person-days').value, 10);

    if (startDate && days > 0) {
      const endDate = DateUtils.calculateEndDate(startDate, days);
      document.getElementById('person-enddate').value = DateUtils.formatISO(endDate);
    }
  },

  /**
   * Add custom muster time
   */
  addCustomMusterTime() {
    const input = document.getElementById('custom-muster-time');
    const time = input.value;

    if (!time) return;

    const hhmm = time.replace(':', '');
    const allTimes = this.getAllSelectedMusterTimes();
    if (allTimes.includes(hhmm)) {
      this.showToast('This time is already selected', 'warning');
      return;
    }

    this.customMusterTimes.push(hhmm);
    this.renderCustomMusterTimes();
    input.value = '';
  },

  /**
   * Remove custom muster time
   */
  removeCustomMusterTime(time) {
    this.customMusterTimes = this.customMusterTimes.filter(t => t !== time);
    this.renderCustomMusterTimes();
  },

  /**
   * Render custom muster times list
   */
  renderCustomMusterTimes() {
    const container = document.getElementById('custom-times-list');
    container.innerHTML = this.customMusterTimes.map(time => `
      <span class="custom-time-tag">
        ${DateUtils.formatTimeDisplay(time)}
        <button type="button" onclick="App.removeCustomMusterTime('${time}')" aria-label="Remove ${time}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');
  },

  /**
   * Get all selected muster times
   */
  getAllSelectedMusterTimes() {
    const standard = [];
    document.querySelectorAll('.muster-time-cb:checked').forEach(cb => {
      standard.push(cb.value);
    });
    return [...standard, ...this.customMusterTimes].sort((a, b) =>
      DateUtils.parseTimeToMinutes(a) - DateUtils.parseTimeToMinutes(b)
    );
  },

  /**
   * Save person
   */
  savePerson() {
    const formData = {
      rank: document.getElementById('person-rank').value,
      lastName: document.getElementById('person-lastname').value,
      firstName: document.getElementById('person-firstname').value,
      mi: document.getElementById('person-mi').value,
      edipi: document.getElementById('person-edipi').value,
      unit: document.getElementById('person-unit').value,
      restrictionType: document.querySelector('input[name="restriction-type"]:checked').value,
      startDate: document.getElementById('person-startdate').value,
      daysAwarded: document.getElementById('person-days').value,
      offense: document.getElementById('person-offense').value,
      notes: document.getElementById('person-notes').value,
      musterTimes: this.getAllSelectedMusterTimes()
    };

    const restrictee = Roster.fromFormData(formData);
    const validation = Roster.validate(restrictee);

    if (!validation.valid) {
      this.showToast(validation.errors[0], 'error');
      return;
    }

    if (this.editingId) {
      Roster.update(this.editingId, restrictee);
      this.showToast('Restrictee updated', 'success');
    } else {
      Roster.add(restrictee);
      this.showToast('Restrictee added', 'success');
    }

    this.showRosterView();
  },

  /**
   * Record muster sign-in
   */
  recordMuster(status) {
    const recorder = document.getElementById('signin-recorder').value.trim();
    const notes = document.getElementById('signin-notes').value.trim();

    if (!recorder) {
      this.showToast('Please enter who is recording this muster', 'warning');
      document.getElementById('signin-recorder').focus();
      return;
    }

    if ((status === 'late' || status === 'missed' || status === 'excused') && !notes) {
      document.getElementById('signin-notes-group').classList.remove('hidden');
      document.getElementById('signin-notes').focus();
      this.showToast('Please add a note for this status', 'warning');
      return;
    }

    Muster.recordSignIn({
      restricteeId: this.currentRestrictee.id,
      scheduledTime: this.currentMusterTime,
      status,
      recordedBy: recorder,
      notes
    });

    const statusDisplay = Muster.getStatusDisplay(status);
    this.showToast(`Muster recorded: ${statusDisplay.text}`, 'success');
    this.showRosterView();
  },

  /**
   * Render detail view content
   */
  renderDetailContent(restrictee) {
    const container = document.getElementById('detail-content');
    const daysRemaining = DateUtils.daysRemaining(restrictee.endDate);
    const stats = Muster.getStats(restrictee.id);

    let html = `
      <div class="detail-header">
        <h2 class="detail-header__name">${Roster.getDisplayName(restrictee)}</h2>
        <div class="detail-header__info">
          <div class="detail-header__item">
            <span class="detail-header__label">Type:</span>
            <span>${Roster.getTypeDisplayName(restrictee.restrictionType)}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Period:</span>
            <span>${DateUtils.formatMilitary(restrictee.startDate)} - ${DateUtils.formatMilitary(restrictee.endDate)}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Days Remaining:</span>
            <span>${daysRemaining > 0 ? daysRemaining : 'Complete'}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Muster Times:</span>
            <span>${restrictee.musterTimes.map(t => DateUtils.formatTimeDisplay(t)).join(', ')}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Compliance:</span>
            <span>${stats.complianceRate}% (${stats.present + stats.late + stats.excused}/${stats.total})</span>
          </div>
        </div>
      </div>
    `;

    const recordsByDate = Muster.getRecordsGroupedByDate(restrictee.id, 14);
    const today = DateUtils.today();

    if (!recordsByDate[today]) {
      recordsByDate[today] = [];
    }

    const sortedDates = Object.keys(recordsByDate).sort().reverse();

    for (const date of sortedDates) {
      const dailyLog = Muster.buildDailyLog(restrictee, date);
      const isToday = date === today;

      html += `
        <div class="detail-day">
          <div class="detail-day__header">${isToday ? 'TODAY - ' : ''}${DateUtils.formatMilitary(date)}</div>
          <div class="detail-day__musters">
      `;

      for (const muster of dailyLog.musters) {
        let statusIcon, statusText;

        if (muster.status === 'pending') {
          statusIcon = Muster.getPendingIcon(muster.timeStatus);
          statusText = muster.timeStatus === 'overdue' ? 'OVERDUE' : 'Pending';
        } else if (muster.status === 'unrecorded') {
          statusIcon = '❓';
          statusText = 'No Record';
        } else {
          const display = Muster.getStatusDisplay(muster.status);
          statusIcon = display.icon;
          statusText = display.text;
        }

        html += `
          <div class="detail-muster">
            <span class="detail-muster__time">${DateUtils.formatTimeDisplay(muster.time)}</span>
            <span class="detail-muster__status">${statusIcon}</span>
            <span class="detail-muster__actual">${muster.actualTime ? DateUtils.formatTimeDisplay(muster.actualTime) : statusText}</span>
            <span class="detail-muster__recorder">${muster.recordedBy || ''}</span>
          </div>
        `;

        if (muster.notes) {
          html += `<div class="detail-muster__note">Note: ${muster.notes}</div>`;
        }
      }

      html += '</div></div>';
    }

    container.innerHTML = html;
  },

  /**
   * Edit current restrictee
   */
  editCurrentRestrictee() {
    if (this.currentRestrictee) {
      this.showFormView(this.currentRestrictee.id);
    }
  },

  /**
   * End restriction for current restrictee
   */
  endRestriction() {
    this.confirmAction(
      'End Restriction',
      `Are you sure you want to mark ${Roster.getDisplayName(this.currentRestrictee)}'s restriction as complete?`,
      () => {
        Roster.complete(this.currentRestrictee.id);
        this.showToast('Restriction marked as complete', 'success');
        this.showRosterView();
      }
    );
  },

  /**
   * Export individual report
   */
  exportIndividualReport() {
    if (this.currentRestrictee) {
      Reports.generateIndividualReport(this.currentRestrictee.id);
      this.showToast('Report downloaded', 'success');
    }
  },

  /**
   * Render report view
   */
  renderReport() {
    const date = document.getElementById('report-date').value;
    const settings = Storage.getAppData().settings;
    const html = Reports.buildDailyReportHTML(date, settings.unitName);
    document.getElementById('report-content').innerHTML = html;
  },

  /**
   * Export daily report
   */
  exportDailyReport() {
    const date = document.getElementById('report-date').value;
    const settings = Storage.getAppData().settings;
    Reports.generateDailyReport(date, settings.unitName);
    this.showToast('Report downloaded', 'success');
  },

  // ===================
  // Data Import/Export
  // ===================

  /**
   * Export all data as JSON
   */
  exportData() {
    const data = Storage.getAppData();
    data.exportedAt = new Date().toISOString();
    data.version = this.VERSION;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restriction-tracker-backup-${DateUtils.formatNumeric(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Data exported successfully', 'success');
  },

  /**
   * Import data from JSON file
   */
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.restrictees || !Array.isArray(data.restrictees)) {
          throw new Error('Invalid data format');
        }

        this.confirmAction(
          'Import Data',
          `This will replace all current data with ${data.restrictees.length} restrictees and ${(data.musterRecords || []).length} muster records. Continue?`,
          () => {
            Storage.saveAppData(data);
            this.showRosterView();
            this.hideSettingsModal();
            this.showToast('Data imported successfully', 'success');
          }
        );
      } catch (err) {
        this.showToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  /**
   * Load demo data
   */
  loadDemoData() {
    const today = DateUtils.today();
    const yesterday = DateUtils.formatISO(DateUtils.addDays(today, -1));

    const demoData = {
      restrictees: [
        {
          id: 'demo-1',
          rank: 'PFC',
          lastName: 'SMITH',
          firstName: 'John',
          mi: 'A',
          edipi: '',
          unit: '1st Plt, Alpha Co',
          restrictionType: 'restriction',
          startDate: DateUtils.formatISO(DateUtils.addDays(today, -15)),
          endDate: DateUtils.formatISO(DateUtils.addDays(today, 14)),
          daysAwarded: 30,
          offense: 'Article 92 - Failure to obey order',
          musterTimes: ['0600', '1200', '1800', '2200'],
          notes: '',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-2',
          rank: 'LCpl',
          lastName: 'JONES',
          firstName: 'Maria',
          mi: 'T',
          edipi: '',
          unit: '2nd Plt, Alpha Co',
          restrictionType: 'restriction',
          startDate: DateUtils.formatISO(DateUtils.addDays(today, -3)),
          endDate: DateUtils.formatISO(DateUtils.addDays(today, 10)),
          daysAwarded: 14,
          offense: '',
          musterTimes: ['0600', '1200', '1800', '2200'],
          notes: '',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-3',
          rank: 'Cpl',
          lastName: 'DAVIS',
          firstName: 'Robert',
          mi: 'L',
          edipi: '',
          unit: '3rd Plt, Bravo Co',
          restrictionType: 'epd',
          startDate: DateUtils.formatISO(DateUtils.addDays(today, -6)),
          endDate: DateUtils.formatISO(DateUtils.addDays(today, 0)),
          daysAwarded: 7,
          offense: '',
          musterTimes: ['0600', '1800'],
          notes: 'EPD only - no 1200/2200 muster required',
          active: true,
          createdAt: new Date().toISOString()
        }
      ],
      musterRecords: [
        // Yesterday's records for demo-1
        { id: 'rec-1', restricteeId: 'demo-1', date: yesterday, scheduledTime: '0600', actualTime: '0555', status: 'present', recordedBy: 'SGT Martinez', notes: '', timestamp: new Date().toISOString() },
        { id: 'rec-2', restricteeId: 'demo-1', date: yesterday, scheduledTime: '1200', actualTime: '1158', status: 'present', recordedBy: 'SSgt Garcia', notes: '', timestamp: new Date().toISOString() },
        { id: 'rec-3', restricteeId: 'demo-1', date: yesterday, scheduledTime: '1800', actualTime: null, status: 'missed', recordedBy: 'GySgt Johnson', notes: 'At dental appointment - unexcused', timestamp: new Date().toISOString() },
        { id: 'rec-4', restricteeId: 'demo-1', date: yesterday, scheduledTime: '2200', actualTime: '2145', status: 'present', recordedBy: 'SSgt Garcia', notes: '', timestamp: new Date().toISOString() },
        // Today's records for demo-1
        { id: 'rec-5', restricteeId: 'demo-1', date: today, scheduledTime: '0600', actualTime: '0558', status: 'present', recordedBy: 'SGT Martinez', notes: '', timestamp: new Date().toISOString() },
        // Yesterday's records for demo-2
        { id: 'rec-6', restricteeId: 'demo-2', date: yesterday, scheduledTime: '0600', actualTime: '0602', status: 'present', recordedBy: 'SGT Martinez', notes: '', timestamp: new Date().toISOString() },
        { id: 'rec-7', restricteeId: 'demo-2', date: yesterday, scheduledTime: '1200', actualTime: '1215', status: 'late', recordedBy: 'SSgt Garcia', notes: 'At medical appointment', timestamp: new Date().toISOString() },
        { id: 'rec-8', restricteeId: 'demo-2', date: yesterday, scheduledTime: '1800', actualTime: '1758', status: 'present', recordedBy: 'GySgt Johnson', notes: '', timestamp: new Date().toISOString() },
        { id: 'rec-9', restricteeId: 'demo-2', date: yesterday, scheduledTime: '2200', actualTime: '2155', status: 'present', recordedBy: 'SSgt Garcia', notes: '', timestamp: new Date().toISOString() },
      ],
      settings: {
        defaultMusterTimes: ['0600', '1200', '1800', '2200'],
        unitName: '1st Battalion, 5th Marines',
        defaultRecorder: 'SSgt Garcia'
      },
      lastUpdated: new Date().toISOString()
    };

    Storage.saveAppData(demoData);
    this.showRosterView();
    this.showToast('Demo data loaded', 'success');
  },

  // ===================
  // Modal Management
  // ===================

  showSettingsModal() {
    const settings = Storage.getAppData().settings;
    document.getElementById('settings-unit').value = settings.unitName || '';
    document.getElementById('settings-recorder').value = settings.defaultRecorder || '';

    const currentTheme = ThemeManager.getCurrent();
    document.querySelector(`input[name="theme"][value="${currentTheme}"]`).checked = true;

    document.getElementById('settings-modal').classList.add('modal-overlay--active');
  },

  hideSettingsModal() {
    document.getElementById('settings-modal').classList.remove('modal-overlay--active');
  },

  showHelpModal() {
    document.getElementById('help-modal').classList.add('modal-overlay--active');
  },

  hideHelpModal() {
    document.getElementById('help-modal').classList.remove('modal-overlay--active');
  },

  showWelcomeModal() {
    document.getElementById('welcome-modal').classList.add('modal-overlay--active');
  },

  hideWelcomeModal() {
    document.getElementById('welcome-modal').classList.remove('modal-overlay--active');
    localStorage.setItem(this.FIRST_RUN_KEY, 'true');
  },

  hideAllModals() {
    document.querySelectorAll('.modal-overlay--active').forEach(modal => {
      modal.classList.remove('modal-overlay--active');
    });
  },

  loadSettings() {
    const settings = Storage.getAppData().settings;
    document.getElementById('settings-unit').value = settings.unitName || '';
    document.getElementById('settings-recorder').value = settings.defaultRecorder || '';
  },

  saveSettings() {
    const data = Storage.getAppData();
    data.settings.unitName = document.getElementById('settings-unit').value.trim();
    data.settings.defaultRecorder = document.getElementById('settings-recorder').value.trim();
    Storage.saveAppData(data);

    this.hideSettingsModal();
    this.showToast('Settings saved', 'success');
  },

  confirmClearData() {
    this.confirmAction(
      'Clear All Data',
      'Are you sure you want to delete all data? This cannot be undone.',
      () => {
        Storage.remove(Storage.STORAGE_KEY);
        this.hideSettingsModal();
        this.showRosterView();
        this.showToast('All data cleared', 'success');
      }
    );
  },

  confirmAction(title, message, onConfirm) {
    this.pendingConfirmAction = onConfirm;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').classList.add('modal-overlay--active');
  },

  hideConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('modal-overlay--active');
    this.pendingConfirmAction = null;
  },

  handleConfirm() {
    if (this.pendingConfirmAction) {
      this.pendingConfirmAction();
    }
    this.hideConfirmModal();
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Make App available globally
window.App = App;
