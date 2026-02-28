/**
 * OSMEAC Generator - Main Application
 * 5-Paragraph Order Builder with Live Preview
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
  orderData: null,
  currentSection: 'orientation',
  previewDebounce: null,
  previewActive: false,
  installPWA,

  sections: {
    orientation: OrientationSection,
    situation: SituationSection,
    mission: MissionSection,
    execution: ExecutionSection,
    admin: AdminLogisticsSection,
    command: CommandSignalSection
  },

  init() {
    this.orderData = Storage.loadCurrent();
    this.setupEventListeners();
    this.populateAllFields();
    this.updateLivePreview();

    // Initialize QR sharing and check for imported order
    QRShare.init((sharedOrder) => {
      this.importSharedOrder(sharedOrder);
    });

    console.log('OSMEAC Generator initialized');
  },

  /**
   * Import a shared order received via QR code
   * @param {Object} sharedOrder - The order data from QR
   */
  importSharedOrder(sharedOrder) {
    if (!sharedOrder) return;

    // Merge with empty order to ensure all fields exist
    const emptyOrder = Storage.getEmptyOrder();
    this.orderData = this.deepMerge(emptyOrder, sharedOrder);

    Storage.saveCurrent(this.orderData);
    this.populateAllFields();
    this.updateLivePreview();
    this.showToast('Order received! Review and edit as needed.');
  },

  /**
   * Deep merge two objects
   * @param {Object} target - Base object
   * @param {Object} source - Object to merge in
   * @returns {Object} - Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  },

  togglePreview() {
    const pane = document.getElementById('livePreviewPane');
    const container = document.getElementById('mainContainer');
    const toggle = document.getElementById('previewToggle');

    this.previewActive = !this.previewActive;

    if (this.previewActive) {
      pane?.classList.add('show');
      container?.classList.add('preview-active');
      toggle?.classList.add('active');
      toggle?.setAttribute('aria-pressed', 'true');
      if (toggle) toggle.textContent = 'Hide Preview';
      this.updateLivePreview();
    } else {
      pane?.classList.remove('show');
      container?.classList.remove('preview-active');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-pressed', 'false');
      if (toggle) toggle.textContent = 'Live Preview';
    }
  },

  setupEventListeners() {
    // Preview toggle
    document.getElementById('previewToggle')?.addEventListener('click', () => {
      this.togglePreview();
    });

    // Preview close
    document.getElementById('previewClose')?.addEventListener('click', () => {
      this.togglePreview();
    });

    // Menu toggle
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      document.getElementById('menu-dropdown')?.classList.toggle('hidden');
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('menu-dropdown');
      const toggle = document.getElementById('menu-toggle');
      if (menu && !menu.contains(e.target) && e.target !== toggle && !toggle?.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });

    // Menu actions
    document.getElementById('new-order-btn')?.addEventListener('click', () => this.newOrder());
    document.getElementById('load-order-btn')?.addEventListener('click', () => this.showLoadModal());
    document.getElementById('save-order-btn')?.addEventListener('click', () => this.showSaveModal());
    document.getElementById('export-text-btn')?.addEventListener('click', () => this.exportToText());
    document.getElementById('print-order-btn')?.addEventListener('click', () => this.printOrder());
    document.getElementById('load-example-btn')?.addEventListener('click', () => loadExampleOrder());

    // QR Share
    document.getElementById('share-qr-btn')?.addEventListener('click', () => {
      document.getElementById('menu-dropdown')?.classList.add('hidden');
      QRShare.showShareModal(this.orderData);
    });

    document.getElementById('qr-modal-done')?.addEventListener('click', () => {
      QRShare.hideShareModal();
    });

    document.getElementById('qr-copy-url')?.addEventListener('click', async () => {
      const success = await QRShare.copyShareURL(this.orderData);
      this.showToast(success ? 'Share URL copied!' : 'Failed to copy URL');
    });

    // Section tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchSection(tab.dataset.section));
    });

    // Preview pane buttons
    document.getElementById('copy-order-btn')?.addEventListener('click', () => this.copyToClipboard());
    document.getElementById('export-btn')?.addEventListener('click', () => this.exportToText());
    document.getElementById('print-btn')?.addEventListener('click', () => this.printOrder());

    // Modal handlers
    document.getElementById('save-modal-cancel')?.addEventListener('click', () => this.hideModal('save-modal'));
    document.getElementById('save-modal-confirm')?.addEventListener('click', () => this.saveOrder());
    document.getElementById('load-modal-cancel')?.addEventListener('click', () => this.hideModal('load-modal'));

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('modal-overlay--active');
      });
    });

    // Form field listeners for live update
    this.setupFormListeners();
  },

  setupFormListeners() {
    const allMappings = {
      ...OrientationSection.getFieldMappings(),
      ...SituationSection.getFieldMappings(),
      ...MissionSection.getFieldMappings(),
      ...ExecutionSection.getFieldMappings(),
      ...AdminLogisticsSection.getFieldMappings(),
      ...CommandSignalSection.getFieldMappings()
    };

    Object.keys(allMappings).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        const handler = () => {
          this.setNestedValue(this.orderData, allMappings[fieldId], field.value);
          Storage.saveCurrent(this.orderData);
          this.schedulePreviewUpdate();

          // Update mission preview inline
          if (fieldId.startsWith('mission-')) {
            this.updateMissionPreviewInline();
          }
        };
        field.addEventListener('input', handler);
        field.addEventListener('change', handler);
      }
    });
  },

  schedulePreviewUpdate() {
    clearTimeout(this.previewDebounce);
    this.previewDebounce = setTimeout(() => this.updateLivePreview(), 150);
  },

  switchSection(section) {
    this.currentSection = section;

    // Update tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === section);
    });

    // Update forms
    document.querySelectorAll('.section-form').forEach(form => {
      form.classList.toggle('active', form.id === `form-${section}`);
    });
  },

  populateAllFields() {
    const allMappings = {
      ...OrientationSection.getFieldMappings(),
      ...SituationSection.getFieldMappings(),
      ...MissionSection.getFieldMappings(),
      ...ExecutionSection.getFieldMappings(),
      ...AdminLogisticsSection.getFieldMappings(),
      ...CommandSignalSection.getFieldMappings()
    };

    Object.keys(allMappings).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.value = this.getNestedValue(this.orderData, allMappings[fieldId]) || '';
      }
    });

    this.updateMissionPreviewInline();
  },

  updateMissionPreviewInline() {
    const m = this.orderData.mission;
    const el = document.getElementById('mission-statement-inline');
    if (!el) return;

    if (m.who || m.what || m.whatCustom || m.where || m.when || m.why) {
      const who = m.who || '[WHO]';
      const what = m.whatCustom || m.what || '[WHAT]';
      const where = m.where || '[WHERE]';
      const when = m.when || '[WHEN]';
      const why = m.why || '[WHY]';
      el.textContent = `"${who} ${what} ${where} ${when} IOT ${why}."`;
    } else {
      el.textContent = 'Complete the fields above to generate your mission statement.';
    }
  },

  updateLivePreview() {
    const container = document.getElementById('order-document');
    if (!container) return;

    container.innerHTML = this.generateOrderContent();
  },

  generateOrderContent() {
    const d = this.orderData;
    const m = d.mission;
    const missionStatement = `${m.who || '___'} ${m.whatCustom || m.what || '___'} ${m.where || '___'} ${m.when || '___'} IOT ${m.why || '___'}.`;

    return `<div class="order-header">5-PARAGRAPH ORDER</div>

<div class="order-section">
<div class="section-heading">ORIENTATION</div>
<div class="subsection">a. Present Location: Grid ${d.orientation.presentLocation || '________'}</div>
<div class="subsection">b. Direction of Attack: ${d.orientation.directionAzimuth || '___'}° magnetic, ${d.orientation.directionDistance || '___'} meters</div>
<div class="subsection">c. Objective Location: Grid ${d.orientation.objectiveLocation || '________'}</div>
<div class="subsection">d. Terrain (KOCOA):</div>
<div class="sub-subsection">(1) Key Terrain: ${d.orientation.kocoa.keyTerrain || '________'}</div>
<div class="sub-subsection">(2) Observation & Fields of Fire: ${d.orientation.kocoa.observation || '________'}</div>
<div class="sub-subsection">(3) Cover & Concealment: ${d.orientation.kocoa.cover || '________'}</div>
<div class="sub-subsection">(4) Obstacles: ${d.orientation.kocoa.obstacles || '________'}</div>
<div class="sub-subsection">(5) Avenues of Approach: ${d.orientation.kocoa.avenues || '________'}</div>
<div class="subsection">e. Weather: ${d.orientation.weather || '________'}</div>
<div class="subsection question">"Are there any questions on the orientation?"</div>
</div>

<div class="order-section">
<div class="section-heading">I. SITUATION</div>
<div class="subsection">a. Enemy Forces:</div>
<div class="sub-subsection">(1) Composition, Disposition, Strength (SALUTE):</div>
<div class="bullet-item">Size: ${d.situation.salute.size || '________'}</div>
<div class="bullet-item">Activity: ${d.situation.salute.activity || '________'}</div>
<div class="bullet-item">Location: ${d.situation.salute.location || '________'}</div>
<div class="bullet-item">Unit/Uniform: ${d.situation.salute.unit || '________'}</div>
<div class="bullet-item">Time: ${d.situation.salute.time || '________'}</div>
<div class="bullet-item">Equipment: ${d.situation.salute.equipment || '________'}</div>
<div class="sub-subsection">(2) Capabilities (DRAW-D):</div>
<div class="bullet-item">Defend: ${d.situation.drawd.defend || '________'}</div>
<div class="bullet-item">Reinforce: ${d.situation.drawd.reinforce || '________'}</div>
<div class="bullet-item">Attack: ${d.situation.drawd.attack || '________'}</div>
<div class="bullet-item">Withdraw: ${d.situation.drawd.withdraw || '________'}</div>
<div class="bullet-item">Delay: ${d.situation.drawd.delay || '________'}</div>
<div class="sub-subsection">(3) EMLCOA: ${d.situation.emlcoa || '________'}</div>
<div class="sub-subsection">(4) EMDCOA: ${d.situation.emdcoa || '________'}</div>
<div class="subsection">b. Friendly Forces:</div>
<div class="sub-subsection">(1) Higher's Mission: ${d.situation.friendly.higherMission || '________'}</div>
<div class="sub-subsection">(2) Higher's Intent: ${d.situation.friendly.higherIntent || '________'}</div>
<div class="sub-subsection">(3) Adjacent Units:</div>
<div class="bullet-item">North: ${d.situation.friendly.adjacentNorth || '________'}</div>
<div class="bullet-item">South: ${d.situation.friendly.adjacentSouth || '________'}</div>
<div class="bullet-item">East: ${d.situation.friendly.adjacentEast || '________'}</div>
<div class="bullet-item">West: ${d.situation.friendly.adjacentWest || '________'}</div>
<div class="sub-subsection">(4) Supporting Units: ${d.situation.friendly.supportingUnits || '________'}</div>
<div class="subsection">c. Attachments/Detachments: ${d.situation.attachments || '________'}</div>
</div>

<div class="order-section">
<div class="section-heading">II. MISSION</div>
<div class="subsection mission-text">${missionStatement}</div>
</div>

<div class="order-section">
<div class="section-heading">III. EXECUTION</div>
<div class="subsection">a. Commander's Intent:</div>
<div class="sub-subsection">(1) Purpose: ${d.execution.intent.purpose || '________'}</div>
<div class="sub-subsection">(2) Method: ${d.execution.intent.method || '________'}</div>
<div class="sub-subsection">(3) End State:</div>
<div class="bullet-item">Friendly: ${d.execution.intent.endstateFriendly || '________'}</div>
<div class="bullet-item">Enemy: ${d.execution.intent.endstateEnemy || '________'}</div>
<div class="bullet-item">Terrain: ${d.execution.intent.endstateTerrain || '________'}</div>
<div class="subsection">b. Concept of Operations:</div>
<div class="sub-subsection">(1) Scheme of Maneuver: ${d.execution.concept.schemeManeuver || '________'}</div>
<div class="sub-subsection">(2) Fire Support Plan: ${d.execution.concept.fireSupport || '________'}</div>
<div class="subsection">c. Tasks to Subordinate Units:</div>
<div class="sub-subsection">(1) 1st Fire Team: ${d.execution.tasks.team1 || '________'}</div>
<div class="sub-subsection">(2) 2nd Fire Team: ${d.execution.tasks.team2 || '________'}</div>
<div class="sub-subsection">(3) 3rd Fire Team: ${d.execution.tasks.team3 || '________'}</div>
<div class="sub-subsection">(4) Attachments: ${d.execution.tasks.attachments || '________'}</div>
<div class="subsection">d. Coordinating Instructions:</div>
<div class="sub-subsection">(1) Timeline: ${d.execution.coordinating.timeline || '________'}</div>
<div class="sub-subsection">(2) Priority of Fires: ${d.execution.coordinating.priorityFires || '________'}</div>
<div class="sub-subsection">(3) ROE: ${d.execution.coordinating.roe || '________'}</div>
<div class="sub-subsection">(4) MOPP Level: ${d.execution.coordinating.mopp || '________'}</div>
<div class="sub-subsection">(5) Actions on Contact: ${d.execution.coordinating.contact || '________'}</div>
<div class="sub-subsection">(6) Actions at Objective: ${d.execution.coordinating.objective || '________'}</div>
<div class="sub-subsection">(7) Consolidation/Reorganization: ${d.execution.coordinating.consolidation || '________'}</div>
<div class="sub-subsection">(8) Movement Formation: ${d.execution.coordinating.formation || '________'}</div>
<div class="sub-subsection">(9) Movement Technique: ${d.execution.coordinating.technique || '________'}</div>
<div class="sub-subsection">(10) Departure/Reentry of Lines: ${d.execution.coordinating.departure || '________'}</div>
</div>

<div class="page-break"></div>

<div class="order-section">
<div class="section-heading">IV. ADMINISTRATION & LOGISTICS</div>
<div class="subsection">a. Administration:</div>
<div class="sub-subsection">(1) EPW Handling: ${d.admin.administration.epw || '________'}</div>
<div class="sub-subsection">(2) Captured Material: ${d.admin.administration.captured || '________'}</div>
<div class="subsection">b. Logistics:</div>
<div class="sub-subsection">(1) Ammunition: ${d.admin.logistics.ammo || '________'}</div>
<div class="sub-subsection">(2) Rations: ${d.admin.logistics.rations || '________'}</div>
<div class="sub-subsection">(3) Water: ${d.admin.logistics.water || '________'}</div>
<div class="sub-subsection">(4) Special Equipment: ${d.admin.logistics.equipment || '________'}</div>
<div class="sub-subsection">(5) Resupply Point: Grid ${d.admin.logistics.resupply || '________'}</div>
<div class="subsection">c. CASEVAC:</div>
<div class="sub-subsection">(1) Collection Point: Grid ${d.admin.casevac.collection || '________'}</div>
<div class="sub-subsection">(2) Route: ${d.admin.casevac.route || '________'}</div>
<div class="sub-subsection">(3) Medical Support: ${d.admin.casevac.medical || '________'}</div>
</div>

<div class="order-section">
<div class="section-heading">V. COMMAND & SIGNAL</div>
<div class="subsection">a. Command:</div>
<div class="sub-subsection">(1) Location of Commander: ${d.command.command.location || '________'}</div>
<div class="sub-subsection">(2) Succession of Command: ${d.command.command.succession || '________'}</div>
<div class="sub-subsection">(3) CP Location: Grid ${d.command.command.cp || '________'}</div>
<div class="subsection">b. Signal:</div>
<div class="sub-subsection">(1) Frequencies:</div>
<div class="bullet-item">Primary: ${d.command.frequencies.primary || '________'}</div>
<div class="bullet-item">Alternate: ${d.command.frequencies.alternate || '________'}</div>
<div class="bullet-item">Contingency: ${d.command.frequencies.contingency || '________'}</div>
<div class="bullet-item">Emergency: ${d.command.frequencies.emergency || '________'}</div>
<div class="sub-subsection">(2) Call Signs:</div>
<div class="bullet-item">Higher: ${d.command.callsigns.higher || '________'}</div>
<div class="bullet-item">This Unit: ${d.command.callsigns.thisUnit || '________'}</div>
<div class="bullet-item">Subordinates: ${d.command.callsigns.subordinates || '________'}</div>
<div class="sub-subsection">(3) Signals:</div>
<div class="bullet-item">Shift Fire: ${d.command.signals.shiftFire || '________'}</div>
<div class="bullet-item">Cease Fire: ${d.command.signals.ceaseFire || '________'}</div>
<div class="bullet-item">Assault: ${d.command.signals.assault || '________'}</div>
<div class="bullet-item">Rally Point: ${d.command.signals.rally || '________'}</div>
<div class="sub-subsection">(4) Pyrotechnics: ${d.command.pyrotechnics || '________'}</div>
<div class="sub-subsection">(5) Challenge/Password: ${d.command.challengePassword || '________'}</div>
<div class="sub-subsection">(6) Running Password: ${d.command.runningPassword || '________'}</div>
<div class="sub-subsection">(7) Number Combination: ${d.command.numberCombo || '________'}</div>
<div class="subsection question">"Are there any questions?"</div>
<div class="subsection time-hack">TIME HACK: ${d.command.timeHack || '________'}</div>
</div>`;
  },

  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  },

  getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === undefined || current === null) return '';
      current = current[key];
    }
    return current || '';
  },

  newOrder() {
    if (confirm('Start a new order? All unsaved changes will be lost.')) {
      this.orderData = Storage.getEmptyOrder();
      Storage.saveCurrent(this.orderData);
      this.populateAllFields();
      this.updateLivePreview();
      document.getElementById('menu-dropdown')?.classList.add('hidden');
      this.showToast('New order started');
    }
  },

  showSaveModal() {
    document.getElementById('menu-dropdown')?.classList.add('hidden');
    document.getElementById('save-order-name').value = '';
    this.showModal('save-modal');
  },

  saveOrder() {
    const name = document.getElementById('save-order-name')?.value.trim();
    if (!name) {
      alert('Please enter a name for the order.');
      return;
    }
    if (Storage.saveOrder(name, this.orderData)) {
      this.hideModal('save-modal');
      this.showToast('Order saved');
    } else {
      alert('Failed to save order.');
    }
  },

  showLoadModal() {
    document.getElementById('menu-dropdown')?.classList.add('hidden');
    const list = document.getElementById('saved-orders-list');
    if (!list) return;

    const orders = Storage.getOrders();
    if (orders.length === 0) {
      list.innerHTML = '<p class="text-secondary text-sm">No saved orders found.</p>';
    } else {
      list.innerHTML = orders.map(o => `
        <div class="saved-order-item" data-id="${o.id}">
          <div>
            <div class="saved-order-name">${this.escapeHtml(o.name)}</div>
            <div class="saved-order-date">${new Date(o.updatedAt).toLocaleDateString()}</div>
          </div>
          <button class="saved-order-delete" data-id="${o.id}">&times;</button>
        </div>
      `).join('');

      list.querySelectorAll('.saved-order-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (!e.target.classList.contains('saved-order-delete')) {
            this.loadOrder(item.dataset.id);
          }
        });
      });

      list.querySelectorAll('.saved-order-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteOrder(btn.dataset.id);
        });
      });
    }
    this.showModal('load-modal');
  },

  loadOrder(id) {
    const order = Storage.getOrder(id);
    if (order) {
      this.orderData = order.data;
      Storage.saveCurrent(this.orderData);
      this.populateAllFields();
      this.updateLivePreview();
      this.hideModal('load-modal');
      this.showToast(`Loaded: ${order.name}`);
    }
  },

  deleteOrder(id) {
    if (confirm('Delete this saved order?')) {
      Storage.deleteOrder(id);
      this.showLoadModal();
    }
  },

  copyToClipboard() {
    const doc = document.getElementById('order-document');
    if (doc) {
      const text = doc.innerText;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard');
      }).catch(() => {
        this.showToast('Failed to copy');
      });
    }
  },

  exportToText() {
    document.getElementById('menu-dropdown')?.classList.add('hidden');
    const doc = document.getElementById('order-document');
    if (doc) {
      const text = doc.innerText;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `osmeac-order-${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Order exported');
    }
  },

  printOrder() {
    document.getElementById('menu-dropdown')?.classList.add('hidden');
    window.print();
  },

  showModal(id) {
    document.getElementById(id)?.classList.add('modal-overlay--active');
  },

  hideModal(id) {
    document.getElementById(id)?.classList.remove('modal-overlay--active');
  },

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
