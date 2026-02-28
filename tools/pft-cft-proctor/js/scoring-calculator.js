/**
 * PFT/CFT Proctor - Scoring Calculator
 * Real-time score calculation with debouncing
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const ScoringCalculator = {
  // Current event selections
  upperEvent: 'pullups',
  cardioEvent: 'run',

  // Debounced update functions (initialized in init)
  debouncedPFTUpdate: null,
  debouncedCFTUpdate: null,

  // Current calculated results
  currentPFT: null,
  currentCFT: null,

  /**
   * Initialize the scoring calculator
   */
  init() {
    // Create debounced versions of update functions
    this.debouncedPFTUpdate = Utils.debounce(() => this.calculatePFT(), 100);
    this.debouncedCFTUpdate = Utils.debounce(() => this.calculateCFT(), 100);

    // Set up DOB listener for auto age calculation
    const dobInput = Utils.$('marine-dob');
    if (dobInput) {
      dobInput.addEventListener('change', () => {
        this.calculateAge();
        this.triggerPFTUpdate();
        this.triggerCFTUpdate();
      });
    }

    // Set up gender listener
    const genderInput = Utils.$('marine-gender');
    if (genderInput) {
      genderInput.addEventListener('change', () => {
        this.triggerPFTUpdate();
        this.triggerCFTUpdate();
      });
    }

    console.log('ScoringCalculator initialized');
  },

  /**
   * Trigger debounced PFT update
   */
  triggerPFTUpdate() {
    if (this.debouncedPFTUpdate) {
      this.debouncedPFTUpdate();
    } else {
      this.calculatePFT();
    }
  },

  /**
   * Trigger debounced CFT update
   */
  triggerCFTUpdate() {
    if (this.debouncedCFTUpdate) {
      this.debouncedCFTUpdate();
    } else {
      this.calculateCFT();
    }
  },

  /**
   * Calculate age from DOB
   * @returns {number|null} Age in years
   */
  calculateAge() {
    const dobInput = Utils.$('marine-dob');
    const ageInput = Utils.$('marine-age');

    if (!dobInput || !dobInput.value) {
      if (ageInput) ageInput.value = '';
      return null;
    }

    const dob = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (ageInput) ageInput.value = age;
    return age;
  },

  /**
   * Get current age
   * @returns {number}
   */
  getCurrentAge() {
    const ageInput = Utils.$('marine-age');
    if (ageInput && ageInput.value) {
      return parseInt(ageInput.value);
    }
    return this.calculateAge() || 21;
  },

  /**
   * Get current gender
   * @returns {string} 'male' or 'female'
   */
  getCurrentGender() {
    return Utils.getValue('marine-gender', 'male');
  },

  /**
   * Set upper body event type
   * @param {string} type - 'pullups' or 'pushups'
   */
  setUpperEvent(type) {
    this.upperEvent = type;

    // Update toggle buttons
    Utils.toggleClass('btn-pullups', 'toggle-btn--active', type === 'pullups');
    Utils.toggleClass('btn-pushups', 'toggle-btn--active', type === 'pushups');

    // Show/hide inputs
    Utils.toggleClass('pullups-event', 'hidden', type !== 'pullups');
    Utils.toggleClass('pushups-event', 'hidden', type !== 'pushups');

    this.triggerPFTUpdate();
  },

  /**
   * Set cardio event type
   * @param {string} type - 'run' or 'row'
   */
  setCardioEvent(type) {
    this.cardioEvent = type;

    // Update toggle buttons
    Utils.toggleClass('btn-run', 'toggle-btn--active', type === 'run');
    Utils.toggleClass('btn-row', 'toggle-btn--active', type === 'row');

    // Show/hide inputs
    Utils.toggleClass('run-event', 'hidden', type !== 'run');
    Utils.toggleClass('row-event', 'hidden', type !== 'row');

    this.triggerPFTUpdate();
  },

  /**
   * Calculate PFT scores
   */
  calculatePFT() {
    const gender = this.getCurrentGender();
    const age = this.getCurrentAge();
    const ageBracket = ScoringTables.getAgeBracket(age);

    // Upper body
    let upperScore = 0;
    let upperValue = 0;
    if (this.upperEvent === 'pullups') {
      upperValue = Utils.getNumber('marine-pullups', 0);
      upperScore = Calculator.calculatePullups(gender, ageBracket, upperValue);
      Utils.setText('pullups-score', `${upperScore} pts`);
    } else {
      upperValue = Utils.getNumber('marine-pushups', 0);
      upperScore = Calculator.calculatePushups(gender, ageBracket, upperValue);
      Utils.setText('pushups-score', `${upperScore} pts`);
    }

    // Plank
    const plankMin = Utils.getNumber('marine-plank-min', 0);
    const plankSec = Utils.getNumber('marine-plank-sec', 0);
    const plankSeconds = (plankMin * 60) + plankSec;
    const plankScore = Calculator.calculatePlank(plankSeconds);
    Utils.setText('plank-score', `${plankScore} pts`);

    // Cardio
    const isAltitude = Utils.$('marine-altitude')?.checked || false;
    let cardioScore = 0;
    let cardioTime = '';

    if (this.cardioEvent === 'run') {
      const runMin = Utils.getNumber('marine-run-min', 0);
      const runSec = Utils.getNumber('marine-run-sec', 0);
      const runSeconds = (runMin * 60) + runSec;
      if (runSeconds > 0) {
        cardioScore = Calculator.calculateRun(gender, ageBracket, runSeconds, isAltitude);
      }
      cardioTime = Utils.formatTime(runMin, runSec);
      Utils.setText('run-score', `${cardioScore} pts`);
    } else {
      const rowMin = Utils.getNumber('marine-row-min', 0);
      const rowSec = Utils.getNumber('marine-row-sec', 0);
      const rowSeconds = (rowMin * 60) + rowSec;
      if (rowSeconds > 0) {
        cardioScore = Calculator.calculateRow(gender, ageBracket, rowSeconds);
      }
      cardioTime = Utils.formatTime(rowMin, rowSec);
      Utils.setText('row-score', `${cardioScore} pts`);
    }

    // Total
    const total = upperScore + plankScore + cardioScore;
    Utils.setText('pft-total', total);
    Utils.setText('pft-header-score', `${total} pts`);

    // Update header score color
    const headerScore = Utils.$('pft-header-score');
    if (headerScore) {
      headerScore.classList.remove('section__score--success', 'section__score--warning', 'section__score--error');
      if (total >= 235) {
        headerScore.classList.add('section__score--success');
      } else if (total > 0 && total < 150) {
        headerScore.classList.add('section__score--error');
      }
    }

    // Classification
    const classification = Calculator.getClassification(total);
    const hasScores = upperScore > 0 || plankScore > 0 || cardioScore > 0;
    Utils.setText('pft-class', hasScores ? classification.class : 'Enter scores above');

    // Store current result
    this.currentPFT = {
      upperBody: {
        score: upperScore,
        isPullups: this.upperEvent === 'pullups',
        value: upperValue
      },
      plank: {
        score: plankScore,
        time: Utils.formatTime(plankMin, plankSec)
      },
      cardio: {
        score: cardioScore,
        isRun: this.cardioEvent === 'run',
        time: cardioTime
      },
      total,
      classification: classification.class,
      grade: classification.grade
    };

    // Dispatch event for preview updates
    document.dispatchEvent(new CustomEvent('scoresUpdated', { detail: { type: 'pft' } }));
  },

  /**
   * Calculate CFT scores
   */
  calculateCFT() {
    const gender = this.getCurrentGender();
    const age = this.getCurrentAge();
    const ageBracket = ScoringTables.getAgeBracket(age);
    const isAltitude = Utils.$('marine-cft-altitude')?.checked || false;

    // MTC
    const mtcMin = Utils.getNumber('marine-mtc-min', 0);
    const mtcSec = Utils.getNumber('marine-mtc-sec', 0);
    const mtcSeconds = (mtcMin * 60) + mtcSec;
    const mtcScore = mtcSeconds > 0 ? Calculator.calculateMTC(gender, ageBracket, mtcSeconds, isAltitude) : 0;
    Utils.setText('mtc-score', `${mtcScore} pts`);

    // Ammo Lift
    const alReps = Utils.getNumber('marine-al', 0);
    const alScore = Calculator.calculateAmmoLift(gender, ageBracket, alReps);
    Utils.setText('al-score', `${alScore} pts`);

    // MANUF
    const manufMin = Utils.getNumber('marine-manuf-min', 0);
    const manufSec = Utils.getNumber('marine-manuf-sec', 0);
    const manufSeconds = (manufMin * 60) + manufSec;
    const manufScore = manufSeconds > 0 ? Calculator.calculateMANUF(gender, ageBracket, manufSeconds, isAltitude) : 0;
    Utils.setText('manuf-score', `${manufScore} pts`);

    // Total
    const total = mtcScore + alScore + manufScore;
    Utils.setText('cft-total', total);
    Utils.setText('cft-header-score', `${total} pts`);

    // Update header score color
    const headerScore = Utils.$('cft-header-score');
    if (headerScore) {
      headerScore.classList.remove('section__score--success', 'section__score--warning', 'section__score--error');
      if (total >= 235) {
        headerScore.classList.add('section__score--success');
      } else if (total > 0 && total < 150) {
        headerScore.classList.add('section__score--error');
      }
    }

    // Classification
    const classification = Calculator.getClassification(total);
    const hasScores = mtcScore > 0 || alScore > 0 || manufScore > 0;
    const passStatus = total >= 150 ? 'PASS' : 'FAIL';
    Utils.setText('cft-class', hasScores ? `${classification.class} - ${passStatus}` : 'Enter scores above');

    // Store current result
    this.currentCFT = {
      mtc: { score: mtcScore, time: Utils.formatTime(mtcMin, mtcSec) },
      al: { score: alScore, reps: alReps },
      manuf: { score: manufScore, time: Utils.formatTime(manufMin, manufSec) },
      total,
      classification: classification.class,
      passStatus
    };

    // Dispatch event for preview updates
    document.dispatchEvent(new CustomEvent('scoresUpdated', { detail: { type: 'cft' } }));
  },

  /**
   * Get current PFT data
   * @returns {Object|null}
   */
  getPFTData() {
    return this.currentPFT;
  },

  /**
   * Get current CFT data
   * @returns {Object|null}
   */
  getCFTData() {
    return this.currentCFT;
  },

  /**
   * Reset all scores
   */
  reset() {
    this.currentPFT = null;
    this.currentCFT = null;
    this.upperEvent = 'pullups';
    this.cardioEvent = 'run';
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoringCalculator;
}
