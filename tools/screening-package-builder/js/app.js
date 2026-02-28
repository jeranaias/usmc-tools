/**
 * Screening Package Builder - Main Application
 * Checklist-driven package builder for USMC special duty assignments
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
    alert('To install: Use your browser menu → "Add to Home Screen" or "Install App"');
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
  installPWA,
  currentView: 'home',
  currentPackage: null,
  currentTab: 'checklist',

  // Initialize the application
  init() {
    // Initialize theme
    ThemeManager.init();

    // Initialize preview manager
    if (typeof PreviewManager !== 'undefined') {
      PreviewManager.init();
    }

    // Bind global events
    this.bindEvents();

    // Load saved packages and render home view
    this.showView('home');

    // Show status indicator
    this.updateStatus('saved');
  },

  // Bind global event handlers
  bindEvents() {
    // Modal close buttons
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') {
        this.closeAllModals();
      }
    });

    // Document modal save
    document.getElementById('btn-save-document')?.addEventListener('click', () => {
      ChecklistManager.saveDocument();
    });

    // Document modal cancel
    document.getElementById('btn-cancel-document')?.addEventListener('click', () => {
      ChecklistManager.closeModal();
    });

    // Routing modal save
    document.getElementById('btn-save-routing')?.addEventListener('click', () => {
      RoutingManager.saveStep();
    });

    // Routing modal cancel
    document.getElementById('btn-cancel-routing')?.addEventListener('click', () => {
      RoutingManager.closeModal();
    });

    // New package modal
    document.getElementById('btn-create-package')?.addEventListener('click', () => {
      this.createNewPackage();
    });

    document.getElementById('btn-cancel-new-package')?.addEventListener('click', () => {
      this.closeNewPackageModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape - close modals/preview
      if (e.key === 'Escape') {
        if (typeof PreviewManager !== 'undefined' && PreviewManager.enabled) {
          PreviewManager.close();
        } else {
          this.closeAllModals();
        }
      }

      // Ctrl+P - toggle preview
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        if (typeof PreviewManager !== 'undefined') {
          PreviewManager.toggle();
        }
      }

      // Ctrl+S - save current package
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveCurrentPackage();
      }
    });
  },

  // Update status indicator
  updateStatus(status) {
    const indicator = document.getElementById('status-indicator');
    if (!indicator) return;

    indicator.className = 'status-indicator';

    switch (status) {
      case 'saving':
        indicator.classList.add('saving');
        indicator.textContent = 'Saving...';
        break;
      case 'saved':
        indicator.classList.add('saved');
        indicator.textContent = 'All changes saved';
        break;
      case 'offline':
        indicator.classList.add('offline');
        indicator.textContent = 'Offline mode';
        break;
    }
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Save current package
  saveCurrentPackage() {
    if (!this.currentPackage) {
      this.showToast('No package to save', 'warning');
      return;
    }

    this.updateStatus('saving');
    this.currentPackage.lastUpdated = new Date().toISOString();
    Storage.save(this.currentPackage.id, this.currentPackage);

    setTimeout(() => {
      this.updateStatus('saved');
      this.showToast('Package saved successfully', 'success');
    }, 300);

    // Trigger preview update
    if (typeof PreviewManager !== 'undefined') {
      PreviewManager.scheduleUpdate();
    }
  },

  // Show a specific view
  showView(viewName, data = null) {
    this.currentView = viewName;

    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));

    // Show requested view
    const view = document.getElementById(`view-${viewName}`);
    if (view) {
      view.classList.add('view--active');
    }

    // Initialize view-specific content
    switch (viewName) {
      case 'home':
        this.renderHome();
        break;
      case 'dashboard':
        if (data) this.currentPackage = data;
        this.renderDashboard();
        break;
    }
  },

  // Render home view
  renderHome() {
    const packageTypesContainer = document.getElementById('package-types');
    const savedPackagesContainer = document.getElementById('saved-packages-list');

    if (!packageTypesContainer) return;

    // Render available package types
    const availableTypes = PackageRegistry.getAvailableTypes();
    const comingSoonTypes = PackageRegistry.getComingSoonTypes();

    let typesHtml = '';

    // Available packages
    availableTypes.forEach(type => {
      typesHtml += `
        <div class="package-card" data-package-type="${type.id}">
          <h3 class="package-card__title">${type.name}</h3>
          <p class="package-card__description">${type.description}</p>
          <button type="button" class="btn btn-primary btn--sm">Start Package</button>
        </div>
      `;
    });

    // Coming soon packages
    comingSoonTypes.forEach(type => {
      typesHtml += `
        <div class="package-card package-card--disabled">
          <h3 class="package-card__title">${type.name}</h3>
          <p class="package-card__description">${type.description}</p>
          <span class="package-card__coming-soon">Coming Soon</span>
        </div>
      `;
    });

    packageTypesContainer.innerHTML = typesHtml;

    // Bind click events for package types
    document.querySelectorAll('.package-card:not(.package-card--disabled)').forEach(card => {
      card.addEventListener('click', () => {
        const packageType = card.dataset.packageType;
        this.openNewPackageModal(packageType);
      });
    });

    // Render saved packages
    const savedPackages = Storage.getAllPackages();

    if (savedPackages.length === 0) {
      savedPackagesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">&#128230;</div>
          <h3 class="empty-state__title">No saved packages</h3>
          <p class="empty-state__description">
            Select a package type above to start building your screening package.
          </p>
        </div>
      `;
    } else {
      savedPackagesContainer.innerHTML = savedPackages.map(pkg => {
        const progress = PackageRegistry.calculateProgress(pkg);

        return `
          <div class="saved-package-item" data-package-id="${pkg.id}">
            <div class="saved-package-item__info">
              <div class="saved-package-item__name">
                ${pkg.packageName} Package${pkg.applicantName ? ` - ${pkg.applicantRank} ${pkg.applicantName}` : ''}
              </div>
              <div class="saved-package-item__meta">
                Last updated: ${DateUtils.formatMilitary(pkg.lastUpdated)}
              </div>
            </div>
            <div class="saved-package-item__progress">
              <span class="badge badge--${progress.percentage === 100 ? 'success' : 'secondary'}">${progress.percentage}%</span>
            </div>
          </div>
        `;
      }).join('');

      // Bind click events for saved packages
      document.querySelectorAll('.saved-package-item').forEach(item => {
        item.addEventListener('click', () => {
          const packageId = item.dataset.packageId;
          const pkg = savedPackages.find(p => p.id === packageId);
          if (pkg) {
            this.showView('dashboard', pkg);
          }
        });
      });
    }
  },

  // Open new package modal
  openNewPackageModal(packageType) {
    const modal = document.getElementById('new-package-modal');
    const overlay = document.getElementById('modal-overlay');
    const template = PackageRegistry.getTemplate(packageType);

    if (!modal || !template) return;

    document.getElementById('new-package-type').value = packageType;
    document.getElementById('new-package-modal-title').textContent = `New ${template.name} Package`;

    // Show/hide package-specific fields
    const woFields = document.getElementById('wo-specific-fields');
    const recFields = document.getElementById('rec-specific-fields');

    if (woFields) woFields.style.display = packageType === 'warrant_officer' ? 'block' : 'none';
    if (recFields) recFields.style.display = packageType === 'recruiting' ? 'block' : 'none';

    // Clear form
    document.getElementById('new-package-name').value = '';
    document.getElementById('new-package-rank').value = '';
    document.getElementById('new-package-deadline').value = '';

    // Show modal
    overlay.classList.add('modal-overlay--active');
    document.getElementById('document-modal').classList.add('hidden');
    document.getElementById('routing-modal').classList.add('hidden');
    modal.classList.remove('hidden');
  },

  // Close new package modal
  closeNewPackageModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('modal-overlay--active');
    document.getElementById('new-package-modal').classList.add('hidden');
    document.getElementById('document-modal').classList.remove('hidden');
  },

  // Create new package
  createNewPackage() {
    const packageType = document.getElementById('new-package-type').value;
    const name = document.getElementById('new-package-name').value.trim();
    const rank = document.getElementById('new-package-rank').value;
    const deadline = document.getElementById('new-package-deadline').value;

    if (!name) {
      alert('Please enter applicant name');
      return;
    }

    const applicantInfo = {
      name: name,
      rank: rank,
      deadline: deadline
    };

    // Add package-specific fields
    if (packageType === 'warrant_officer') {
      applicantInfo.targetBoard = document.getElementById('new-package-target-board')?.value || '';
    }

    // Create the package
    const newPackage = PackageRegistry.createPackage(packageType, applicantInfo);

    // Save to storage
    Storage.save(newPackage.id, newPackage);

    // Close modal and navigate to dashboard
    this.closeNewPackageModal();
    this.showView('dashboard', newPackage);
  },

  // Render dashboard view
  renderDashboard() {
    if (!this.currentPackage) {
      this.showView('home');
      return;
    }

    const pkg = this.currentPackage;
    const template = PackageRegistry.getTemplate(pkg.packageType);
    const progress = PackageRegistry.calculateProgress(pkg);
    const routingProgress = PackageRegistry.getRoutingProgress(pkg);

    // Update header
    document.getElementById('dashboard-title').textContent = `${template?.name || pkg.packageName} Package`;
    document.getElementById('dashboard-subtitle').textContent =
      pkg.applicantName ? `${pkg.applicantRank} ${pkg.applicantName}` : 'New Package';

    // Update deadline banner
    this.updateDeadlineBanner();

    // Update progress bar
    const progressBar = document.getElementById('dashboard-progress-bar');
    const progressText = document.getElementById('dashboard-progress-text');

    if (progressBar) {
      progressBar.style.width = `${progress.percentage}%`;
      if (progress.percentage === 100) {
        progressBar.classList.add('progress__bar--success');
      } else {
        progressBar.classList.remove('progress__bar--success');
      }
    }

    if (progressText) {
      progressText.textContent = `${progress.percentage}% Complete`;
    }

    // Update stats
    this.updateDashboardStats();

    // Initialize tab content
    this.switchTab(this.currentTab);

    // Bind navigation and action buttons
    this.bindDashboardEvents();
  },

  // Update deadline banner
  updateDeadlineBanner() {
    const banner = document.getElementById('deadline-banner');
    if (!banner || !this.currentPackage) return;

    const pkg = this.currentPackage;

    if (!pkg.deadline) {
      banner.style.display = 'none';
      return;
    }

    const daysRemaining = DateUtils.daysUntil(pkg.deadline);
    const isUrgent = daysRemaining !== null && daysRemaining <= 14;

    banner.style.display = 'flex';
    banner.className = `deadline-banner ${isUrgent ? 'deadline-banner--urgent' : ''}`;

    const icon = banner.querySelector('.deadline-banner__icon');
    const text = banner.querySelector('.deadline-banner__text');

    if (icon) icon.innerHTML = isUrgent ? '&#9888;' : '&#128197;';
    if (text) {
      text.innerHTML = `
        Deadline: ${DateUtils.formatMilitary(pkg.deadline)}
        <span class="deadline-banner__days">(${DateUtils.getRelativeTime(pkg.deadline)})</span>
      `;
    }
  },

  // Update dashboard stats
  updateDashboardStats() {
    if (!this.currentPackage) return;

    const progress = PackageRegistry.calculateProgress(this.currentPackage);
    const routingProgress = PackageRegistry.getRoutingProgress(this.currentPackage);

    const stats = [
      { id: 'stat-complete', value: progress.complete, label: 'Complete' },
      { id: 'stat-needed', value: progress.missing.length, label: 'Needed' },
      { id: 'stat-waivers', value: progress.waiverNeeded.length, label: 'Waivers' },
      { id: 'stat-signatures', value: routingProgress.total - routingProgress.signed, label: 'Signatures' }
    ];

    stats.forEach(stat => {
      const el = document.getElementById(stat.id);
      if (el) {
        el.querySelector('.stat-item__value').textContent = stat.value;
      }
    });

    // Also update progress bar
    const progressBar = document.getElementById('dashboard-progress-bar');
    const progressText = document.getElementById('dashboard-progress-text');

    if (progressBar) {
      progressBar.style.width = `${progress.percentage}%`;
    }
    if (progressText) {
      progressText.textContent = `${progress.percentage}% Complete`;
    }
  },

  // Switch tabs in dashboard
  switchTab(tabName) {
    this.currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('tab--active', tab.dataset.tab === tabName);
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('tab-panel--active', panel.id === `tab-${tabName}`);
    });

    // Initialize tab content
    switch (tabName) {
      case 'checklist':
        ChecklistManager.init(this.currentPackage);
        break;
      case 'coversheet':
        CoverSheetGenerator.init(this.currentPackage);
        break;
      case 'routing':
        RoutingManager.init(this.currentPackage);
        break;
    }
  },

  // Bind dashboard events (only once)
  bindDashboardEvents() {
    // Prevent duplicate bindings
    if (this._dashboardEventsBound) return;
    this._dashboardEventsBound = true;

    // Back button
    document.getElementById('btn-back-home')?.addEventListener('click', () => {
      this.showView('home');
      this._dashboardEventsBound = false; // Reset for next dashboard load
    });

    // Tab buttons - use event delegation for reliable tab switching
    document.querySelector('.tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (tab && tab.dataset.tab) {
        this.switchTab(tab.dataset.tab);
      }
    });

    // Export button
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      ExportManager.exportChecklist(this.currentPackage);
    });

    // Delete button
    document.getElementById('btn-delete-package')?.addEventListener('click', () => {
      this.confirmDeletePackage();
    });
  },

  // Confirm and delete package
  confirmDeletePackage() {
    if (!this.currentPackage) return;

    const confirmed = confirm(
      `Are you sure you want to delete this package?\n\n` +
      `${this.currentPackage.packageName} - ${this.currentPackage.applicantName || 'Unnamed'}\n\n` +
      `This action cannot be undone.`
    );

    if (confirmed) {
      Storage.remove(this.currentPackage.id);
      this.currentPackage = null;
      this.showView('home');
    }
  },

  // Close all modals
  closeAllModals() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('modal-overlay--active');
    }

    document.querySelectorAll('.modal').forEach(modal => {
      if (modal.id !== 'document-modal') {
        modal.classList.add('hidden');
      }
    });

    // Reset document modal visibility
    document.getElementById('document-modal')?.classList.remove('hidden');
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
