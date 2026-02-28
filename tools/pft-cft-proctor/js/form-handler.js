/**
 * PFT/CFT Proctor - Form Handler
 * Manages form inputs, toggles, and +/- buttons
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const FormHandler = {
  /**
   * Initialize form handlers
   */
  init() {
    this.initInputListeners();
    this.initSectionToggles();
    this.setDefaultDate();
    console.log('FormHandler initialized');
  },

  /**
   * Set default session date to today
   */
  setDefaultDate() {
    const dateInput = Utils.$('session-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  },

  /**
   * Initialize input event listeners
   */
  initInputListeners() {
    // PFT inputs - trigger debounced calculation
    const pftInputs = [
      'marine-pullups', 'marine-pushups',
      'marine-plank-min', 'marine-plank-sec',
      'marine-run-min', 'marine-run-sec',
      'marine-row-min', 'marine-row-sec',
      'marine-altitude'
    ];

    pftInputs.forEach(id => {
      const el = Utils.$(id);
      if (el) {
        el.addEventListener('input', () => ScoringCalculator.triggerPFTUpdate());
        el.addEventListener('change', () => ScoringCalculator.triggerPFTUpdate());
      }
    });

    // CFT inputs - trigger debounced calculation
    const cftInputs = [
      'marine-mtc-min', 'marine-mtc-sec',
      'marine-al',
      'marine-manuf-min', 'marine-manuf-sec',
      'marine-cft-altitude'
    ];

    cftInputs.forEach(id => {
      const el = Utils.$(id);
      if (el) {
        el.addEventListener('input', () => ScoringCalculator.triggerCFTUpdate());
        el.addEventListener('change', () => ScoringCalculator.triggerCFTUpdate());
      }
    });

    // Session inputs - trigger auto-save
    const sessionInputs = ['session-unit', 'session-date', 'session-monitor'];
    sessionInputs.forEach(id => {
      const el = Utils.$(id);
      if (el) {
        el.addEventListener('input', () => SessionManager.saveSession());
      }
    });
  },

  /**
   * Initialize collapsible section toggles
   */
  initSectionToggles() {
    // Sections start expanded by default
    // Save collapsed state in localStorage
    const sections = ['marine-section', 'pft-section', 'cft-section', 'worksheet-section'];

    sections.forEach(id => {
      const saved = localStorage.getItem(`section-${id}`);
      if (saved === 'collapsed') {
        Utils.addClass(id, 'section--collapsed');
      }
    });
  },

  /**
   * Toggle a collapsible section
   * @param {string} sectionId - Section element ID
   */
  toggleSection(sectionId) {
    const section = Utils.$(sectionId);
    if (!section) return;

    const isCollapsed = section.classList.toggle('section--collapsed');
    localStorage.setItem(`section-${sectionId}`, isCollapsed ? 'collapsed' : 'expanded');
  },

  /**
   * Adjust count input with +/- buttons
   * @param {string} type - 'pullups', 'pushups', or 'al'
   * @param {number} delta - Amount to adjust (+1 or -1)
   */
  adjustCount(type, delta) {
    const inputMap = {
      'pullups': 'marine-pullups',
      'pushups': 'marine-pushups',
      'al': 'marine-al'
    };

    const maxMap = {
      'pullups': 50,
      'pushups': 150,
      'al': 200
    };

    const inputId = inputMap[type];
    if (!inputId) return;

    let value = Utils.getNumber(inputId, 0);
    value = Math.max(0, Math.min(value + delta, maxMap[type] || 999));
    Utils.setValue(inputId, value);

    // Trigger appropriate calculation
    if (type === 'al') {
      ScoringCalculator.triggerCFTUpdate();
    } else {
      ScoringCalculator.triggerPFTUpdate();
    }
  },

  /**
   * Collect current Marine data from form
   * @returns {Object} Marine data object
   */
  collectMarineData() {
    const pft = ScoringCalculator.getPFTData();
    const cft = ScoringCalculator.getCFTData();

    return {
      rank: Utils.getValue('marine-rank', 'LCpl'),
      firstName: Utils.getValue('marine-firstname').trim(),
      lastName: Utils.getValue('marine-lastname').trim(),
      mi: Utils.getValue('marine-mi').trim().toUpperCase(),
      edipi: Utils.getValue('marine-edipi').trim(),
      dob: Utils.getValue('marine-dob'),
      age: ScoringCalculator.getCurrentAge(),
      gender: ScoringCalculator.getCurrentGender(),
      height: Utils.getValue('marine-height'),
      weight: Utils.getValue('marine-weight'),
      phaDate: Utils.getValue('marine-pha'),

      // PFT Data
      pullUps: pft?.upperBody.isPullups ? pft.upperBody.value : '',
      pullUpsScore: pft?.upperBody.isPullups ? pft.upperBody.score : '',
      pushUps: !pft?.upperBody.isPullups ? pft.upperBody.value : '',
      pushUpsScore: !pft?.upperBody.isPullups ? pft.upperBody.score : '',
      plankTime: pft?.plank.time,
      plankScore: pft?.plank.score,
      runTime: pft?.cardio.isRun ? pft.cardio.time : '',
      runScore: pft?.cardio.isRun ? pft.cardio.score : '',
      rowTime: !pft?.cardio.isRun ? pft.cardio.time : '',
      rowScore: !pft?.cardio.isRun ? pft.cardio.score : '',
      pftTotal: pft?.total || 0,

      // CFT Data
      mtcTime: cft?.mtc.time,
      mtcScore: cft?.mtc.score,
      alReps: cft?.al.reps,
      alScore: cft?.al.score,
      manufTime: cft?.manuf.time,
      manufScore: cft?.manuf.score,
      cftTotal: cft?.total || 0,
      cftPassFail: cft?.passStatus || ''
    };
  },

  /**
   * Add current Marine to worksheet
   */
  addMarineToWorksheet() {
    try {
      const marineData = this.collectMarineData();
      console.log('Collected marine data:', marineData);

      const success = SessionManager.addMarine(marineData);

      if (success) {
        this.clearForm();
        // Scroll to worksheet section
        const worksheetSection = Utils.$('worksheet-section');
        if (worksheetSection) {
          worksheetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error adding Marine:', error);
      Utils.showStatus('error', 'Failed to add Marine. Check console for details.');
    }
  },

  /**
   * Clear the Marine input form
   */
  clearForm() {
    const form = Utils.$('marine-form');
    if (form) form.reset();

    Utils.setValue('marine-age', '');

    // Reset count inputs
    Utils.setValue('marine-pullups', '0');
    Utils.setValue('marine-pushups', '0');
    Utils.setValue('marine-al', '0');

    // Reset time inputs
    const timeInputs = [
      'marine-plank-min', 'marine-plank-sec',
      'marine-run-min', 'marine-run-sec',
      'marine-row-min', 'marine-row-sec',
      'marine-mtc-min', 'marine-mtc-sec',
      'marine-manuf-min', 'marine-manuf-sec'
    ];
    timeInputs.forEach(id => {
      Utils.setValue(id, id.endsWith('-sec') ? '00' : '0');
    });

    // Reset event selections
    ScoringCalculator.setUpperEvent('pullups');
    ScoringCalculator.setCardioEvent('run');

    // Reset checkboxes
    const altitudeCheck = Utils.$('marine-altitude');
    const cftAltitudeCheck = Utils.$('marine-cft-altitude');
    if (altitudeCheck) altitudeCheck.checked = false;
    if (cftAltitudeCheck) cftAltitudeCheck.checked = false;

    // Reset score displays
    const scoreElements = [
      'pullups-score', 'pushups-score', 'plank-score', 'run-score', 'row-score',
      'mtc-score', 'al-score', 'manuf-score'
    ];
    scoreElements.forEach(id => Utils.setText(id, '0 pts'));

    Utils.setText('pft-total', '0');
    Utils.setText('pft-header-score', '0 pts');
    Utils.setText('pft-class', 'Enter scores above');
    Utils.setText('cft-total', '0');
    Utils.setText('cft-header-score', '0 pts');
    Utils.setText('cft-class', 'Enter scores above');

    // Reset calculator state
    ScoringCalculator.reset();
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}
