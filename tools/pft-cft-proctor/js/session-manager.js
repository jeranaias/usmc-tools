/**
 * PFT/CFT Proctor - Session Manager
 * Handles Marines list, session storage, auto-save
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const SessionManager = {
  // Marines in current session
  marines: [],

  // Auto-save timer
  autoSaveTimer: null,
  AUTO_SAVE_INTERVAL: 2000, // 2 seconds like navalletterformat

  // Storage key
  STORAGE_KEY: 'navmc-session',

  /**
   * Initialize session manager
   */
  init() {
    this.loadSession();
    this.startAutoSave();
    console.log('SessionManager initialized');
  },

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    // Clear existing timer
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    // Save every 2 seconds if there are changes
    this.autoSaveTimer = setInterval(() => {
      this.saveSession();
    }, this.AUTO_SAVE_INTERVAL);

    // Also save on visibility change (user switching tabs)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveSession();
      }
    });

    // Save before unload
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });
  },

  /**
   * Add a Marine to the session
   * @param {Object} marineData - Marine data from form
   * @returns {boolean} Success
   */
  addMarine(marineData) {
    // Validate required fields
    if (!marineData.lastName) {
      Utils.showStatus('error', 'Last name is required');
      const input = document.getElementById('marine-lastname');
      if (input) input.focus();
      return false;
    }

    if (!marineData.firstName) {
      Utils.showStatus('error', 'First name is required');
      const input = document.getElementById('marine-firstname');
      if (input) input.focus();
      return false;
    }

    if (!marineData.age || marineData.age < 17) {
      Utils.showStatus('error', 'Please enter Date of Birth (Marine must be 17+)');
      const input = document.getElementById('marine-dob');
      if (input) input.focus();
      return false;
    }

    const marine = {
      id: Utils.generateId(),
      ...marineData,
      addedAt: new Date().toISOString()
    };

    this.marines.push(marine);
    this.saveSession();
    this.renderMarinesList();

    Utils.showStatus('success', `Added ${marine.rank} ${marine.lastName}`);
    return true;
  },

  /**
   * Remove a Marine from the session
   * @param {string} id - Marine ID
   */
  removeMarine(id) {
    const marine = this.marines.find(m => m.id === id);
    this.marines = this.marines.filter(m => m.id !== id);
    this.saveSession();
    this.renderMarinesList();

    if (marine) {
      Utils.showStatus('info', `Removed ${marine.rank} ${marine.lastName}`);
    }
  },

  /**
   * Clear all Marines
   */
  clearAll() {
    if (this.marines.length === 0) return;

    if (confirm(`Remove all ${this.marines.length} Marines from the worksheet?`)) {
      this.marines = [];
      this.saveSession();
      this.renderMarinesList();
      Utils.showStatus('info', 'Worksheet cleared');
    }
  },

  /**
   * Get all Marines
   * @returns {Array}
   */
  getMarines() {
    return this.marines;
  },

  /**
   * Get Marine count
   * @returns {number}
   */
  getCount() {
    return this.marines.length;
  },

  /**
   * Render the Marines list in the UI
   */
  renderMarinesList() {
    const listEl = Utils.$('marines-list');
    const countBadge = Utils.$('marine-count-badge');
    const actionsEl = Utils.$('worksheet-actions');

    if (countBadge) countBadge.textContent = this.marines.length;
    if (actionsEl) actionsEl.style.display = this.marines.length > 0 ? 'flex' : 'none';

    if (!listEl) return;

    if (this.marines.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <div class="empty-state__text">No Marines added yet</div>
          <button type="button" class="btn btn--outline btn--sm mt-3" onclick="App.loadExample()">
            Load Example Roster
          </button>
        </div>
      `;
      return;
    }

    let html = '<table class="marines-table"><thead><tr>';
    html += '<th>Marine</th><th>PFT</th><th>CFT</th><th></th>';
    html += '</tr></thead><tbody>';

    this.marines.forEach((marine) => {
      const pftClass = marine.pftTotal >= 235 ? 'text-success' : marine.pftTotal >= 150 ? '' : 'text-error';
      const cftClass = marine.cftTotal >= 235 ? 'text-success' : marine.cftTotal >= 150 ? '' : 'text-error';

      html += `
        <tr>
          <td data-label="Marine">
            <div class="marine-name">${marine.rank} ${marine.lastName}, ${marine.firstName}</div>
            <div class="marine-details">${marine.gender === 'male' ? 'M' : 'F'} / ${marine.age}yo</div>
          </td>
          <td data-label="PFT" class="font-bold ${pftClass}">${marine.pftTotal || 0}</td>
          <td data-label="CFT" class="font-bold ${cftClass}">${marine.cftTotal || '--'}</td>
          <td data-label="">
            <button class="btn btn--ghost btn--sm" onclick="SessionManager.removeMarine('${marine.id}')" aria-label="Remove ${marine.lastName}">×</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    listEl.innerHTML = html;

    // Dispatch event for preview
    document.dispatchEvent(new CustomEvent('marinesUpdated'));
  },

  /**
   * Save session to localStorage
   */
  saveSession() {
    const session = {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  },

  /**
   * Load session from localStorage
   */
  loadSession() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;

      const session = JSON.parse(saved);

      if (session.unit) Utils.setValue('session-unit', session.unit);
      if (session.date) Utils.setValue('session-date', session.date);
      if (session.monitor) Utils.setValue('session-monitor', session.monitor);
      if (session.marines) this.marines = session.marines;

      this.renderMarinesList();

      console.log(`Restored session with ${this.marines.length} Marines`);
    } catch (e) {
      console.warn('Failed to load session:', e);
    }
  },

  /**
   * Export session to file
   */
  exportSession() {
    const session = {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pft-cft-session-${session.date || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    Utils.showStatus('success', 'Session exported');
  },

  /**
   * Import session from file
   * @param {File} file - JSON file
   */
  async importSession(file) {
    try {
      const text = await file.text();
      const session = JSON.parse(text);

      if (session.unit) Utils.setValue('session-unit', session.unit);
      if (session.date) Utils.setValue('session-date', session.date);
      if (session.monitor) Utils.setValue('session-monitor', session.monitor);
      if (session.marines) {
        this.marines = session.marines;
        this.saveSession();
        this.renderMarinesList();
      }

      Utils.showStatus('success', `Imported ${this.marines.length} Marines`);
    } catch (e) {
      Utils.showStatus('error', 'Failed to import session file');
      console.error('Import error:', e);
    }
  },

  /**
   * Get session data for PDF generation
   * @returns {Object}
   */
  getSessionData() {
    return {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines
    };
  },

  /**
   * Load example roster for demonstration
   */
  loadExampleRoster() {
    // Confirm if existing data
    if (this.marines.length > 0) {
      if (!confirm('This will replace your current worksheet. Continue?')) {
        return;
      }
    }

    // Set example session info
    const today = new Date().toISOString().split('T')[0];
    Utils.setValue('session-unit', '1st Bn, 5th Marines');
    Utils.setValue('session-date', today);
    Utils.setValue('session-monitor', 'SSgt Rodriguez');

    // Example Marines with comprehensive data matching collectMarineData() structure
    const exampleMarines = [
      {
        id: Utils.generateId(),
        rank: 'Sgt', lastName: 'Johnson', firstName: 'Marcus', mi: 'A',
        edipi: '1234567890', dob: '1995-03-15', gender: 'male', age: 29,
        height: '71', weight: '185', phaDate: '2025-06-15',
        // PFT - Pull-ups
        pullUps: 23, pullUpsScore: 100,
        pushUps: '', pushUpsScore: '',
        plankTime: '4:15', plankScore: 100,
        runTime: '19:30', runScore: 98,
        rowTime: '', rowScore: '',
        pftTotal: 298,
        // CFT
        mtcTime: '2:45', mtcScore: 100,
        alReps: 115, alScore: 100,
        manufTime: '2:38', manufScore: 100,
        cftTotal: 300, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'LCpl', lastName: 'Williams', firstName: 'Sarah', mi: 'E',
        edipi: '2345678901', dob: '2000-07-22', gender: 'female', age: 24,
        height: '65', weight: '140', phaDate: '2025-08-20',
        // PFT - Pull-ups (female)
        pullUps: 11, pullUpsScore: 100,
        pushUps: '', pushUpsScore: '',
        plankTime: '3:45', plankScore: 80,
        runTime: '23:15', runScore: 92,
        rowTime: '', rowScore: '',
        pftTotal: 272,
        // CFT
        mtcTime: '3:20', mtcScore: 95,
        alReps: 75, alScore: 90,
        manufTime: '3:15', manufScore: 88,
        cftTotal: 273, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Cpl', lastName: 'Martinez', firstName: 'Diego', mi: 'R',
        edipi: '3456789012', dob: '1998-11-08', gender: 'male', age: 26,
        height: '68', weight: '175', phaDate: '2025-04-10',
        // PFT - Pull-ups
        pullUps: 18, pullUpsScore: 90,
        pushUps: '', pushUpsScore: '',
        plankTime: '3:30', plankScore: 75,
        runTime: '21:45', runScore: 85,
        rowTime: '', rowScore: '',
        pftTotal: 250,
        // CFT
        mtcTime: '3:05', mtcScore: 88,
        alReps: 98, alScore: 85,
        manufTime: '2:55', manufScore: 92,
        cftTotal: 265, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'PFC', lastName: 'Thompson', firstName: 'James', mi: 'L',
        edipi: '4567890123', dob: '2002-04-30', gender: 'male', age: 22,
        height: '72', weight: '195', phaDate: '2025-09-05',
        // PFT - Push-ups (chose alternate)
        pullUps: '', pullUpsScore: '',
        pushUps: 65, pushUpsScore: 60,
        plankTime: '2:50', plankScore: 55,
        runTime: '24:00', runScore: 68,
        rowTime: '', rowScore: '',
        pftTotal: 183,
        // CFT
        mtcTime: '3:25', mtcScore: 78,
        alReps: 82, alScore: 72,
        manufTime: '3:30', manufScore: 75,
        cftTotal: 225, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'SSgt', lastName: 'Chen', firstName: 'Michelle', mi: 'K',
        edipi: '5678901234', dob: '1990-09-12', gender: 'female', age: 34,
        height: '64', weight: '135', phaDate: '2025-07-22',
        // PFT - Pull-ups (female)
        pullUps: 8, pullUpsScore: 85,
        pushUps: '', pushUpsScore: '',
        plankTime: '4:00', plankScore: 90,
        runTime: '25:30', runScore: 78,
        rowTime: '', rowScore: '',
        pftTotal: 253,
        // CFT
        mtcTime: '3:35', mtcScore: 88,
        alReps: 68, alScore: 82,
        manufTime: '3:28', manufScore: 85,
        cftTotal: 255, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'GySgt', lastName: 'Davis', firstName: 'Robert', mi: 'W',
        edipi: '6789012345', dob: '1985-01-25', gender: 'male', age: 39,
        height: '70', weight: '190', phaDate: '2025-03-18',
        // PFT - Pull-ups
        pullUps: 15, pullUpsScore: 78,
        pushUps: '', pushUpsScore: '',
        plankTime: '3:20', plankScore: 68,
        runTime: '23:30', runScore: 75,
        rowTime: '', rowScore: '',
        pftTotal: 221,
        // CFT
        mtcTime: '3:15', mtcScore: 82,
        alReps: 88, alScore: 78,
        manufTime: '3:10', manufScore: 80,
        cftTotal: 240, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Capt', lastName: 'Anderson', firstName: 'Emily', mi: 'J',
        edipi: '7890123456', dob: '1993-06-18', gender: 'female', age: 31,
        height: '66', weight: '145', phaDate: '2025-05-30',
        // PFT - Pull-ups (female)
        pullUps: 10, pullUpsScore: 95,
        pushUps: '', pushUpsScore: '',
        plankTime: '4:30', plankScore: 100,
        runTime: '22:45', runScore: 95,
        rowTime: '', rowScore: '',
        pftTotal: 290,
        // CFT
        mtcTime: '3:10', mtcScore: 100,
        alReps: 82, alScore: 95,
        manufTime: '3:05', manufScore: 95,
        cftTotal: 290, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Pvt', lastName: 'Garcia', firstName: 'Anthony', mi: 'M',
        edipi: '8901234567', dob: '2003-12-05', gender: 'male', age: 21,
        height: '69', weight: '170', phaDate: '2025-10-12',
        // PFT - Pull-ups (struggling new join)
        pullUps: 12, pullUpsScore: 60,
        pushUps: '', pushUpsScore: '',
        plankTime: '2:15', plankScore: 40,
        runTime: '26:30', runScore: 55,
        rowTime: '', rowScore: '',
        pftTotal: 155,
        // CFT
        mtcTime: '3:45', mtcScore: 68,
        alReps: 72, alScore: 65,
        manufTime: '3:45', manufScore: 62,
        cftTotal: 195, cftPassFail: 'PASS',
        addedAt: new Date().toISOString()
      }
    ];

    this.marines = exampleMarines;
    this.saveSession();
    this.renderMarinesList();

    Utils.showStatus('success', `Loaded ${exampleMarines.length} example Marines`);
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
}
