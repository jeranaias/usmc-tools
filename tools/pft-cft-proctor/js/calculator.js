/**
 * PFT/CFT Score Calculator
 * Calculates scores based on MCO 6100.13A w/CH-4
 */

const Calculator = {
  /**
   * Linear interpolation for scoring
   * @param {number} value - The actual value (reps or time in seconds)
   * @param {number} maxValue - Value for max points (best performance)
   * @param {number} minValue - Value for min points (minimum passing)
   * @param {number} maxPts - Maximum points
   * @param {number} minPts - Minimum passing points
   * @param {boolean} lowerIsBetter - True for timed events, false for reps
   * @returns {number} Calculated points
   */
  interpolateScore(value, maxValue, minValue, maxPts, minPts, lowerIsBetter = false) {
    if (lowerIsBetter) {
      // For timed events: lower time = better
      if (value <= maxValue) return maxPts;
      if (value >= minValue) return minPts;

      const range = minValue - maxValue;
      const scoreRange = maxPts - minPts;
      const position = (value - maxValue) / range;

      return Math.round(maxPts - (position * scoreRange));
    } else {
      // For rep events: higher reps = better
      if (value >= maxValue) return maxPts;
      if (value <= minValue) return minPts;

      const range = maxValue - minValue;
      const scoreRange = maxPts - minPts;
      const position = (value - minValue) / range;

      return Math.round(minPts + (position * scoreRange));
    }
  },

  /**
   * Calculate pull-up score
   */
  calculatePullups(gender, ageBracket, reps) {
    const table = ScoringTables.PULLUPS[gender][ageBracket];
    if (!table) return 0;

    if (reps < table.minReps) return 0; // Below minimum = 0 points

    return this.interpolateScore(
      reps,
      table.maxReps,
      table.minReps,
      table.maxPts,
      table.minPts,
      false
    );
  },

  /**
   * Calculate push-up score (capped at 70 points)
   */
  calculatePushups(gender, ageBracket, reps) {
    const table = ScoringTables.PUSHUPS[gender][ageBracket];
    if (!table) return 0;

    if (reps < table.minReps) return 0; // Below minimum = 0 points

    return this.interpolateScore(
      reps,
      table.maxReps,
      table.minReps,
      table.maxPts,
      table.minPts,
      false
    );
  },

  /**
   * Calculate plank score
   * @param {number} seconds - Plank hold time in seconds
   */
  calculatePlank(seconds) {
    const thresholds = ScoringTables.PLANK.thresholds;

    // Find the bracket
    for (let i = 0; i < thresholds.length - 1; i++) {
      const upper = thresholds[i];
      const lower = thresholds[i + 1];

      if (seconds >= upper.time) {
        return upper.points;
      }

      if (seconds >= lower.time && seconds < upper.time) {
        // Interpolate between thresholds
        const range = upper.time - lower.time;
        const scoreRange = upper.points - lower.points;
        const position = (seconds - lower.time) / range;
        return Math.round(lower.points + (position * scoreRange));
      }
    }

    return 0; // Below minimum
  },

  /**
   * Calculate 3-mile run score
   * @param {number} seconds - Run time in seconds
   * @param {boolean} isAltitude - High altitude adjustment
   */
  calculateRun(gender, ageBracket, seconds, isAltitude = false) {
    const table = ScoringTables.RUN_3MILE[gender][ageBracket];
    if (!table) return 0;

    let maxTime = table.maxTime;
    let minTime = table.minTime;

    // Apply altitude adjustment
    if (isAltitude) {
      maxTime += ScoringTables.RUN_3MILE.altitudeAdjustment.maxTime;
      minTime += ScoringTables.RUN_3MILE.altitudeAdjustment.minTime;
    }

    if (seconds > minTime) return 0; // Slower than minimum = 0 points

    return this.interpolateScore(
      seconds,
      maxTime,
      minTime,
      table.maxPts,
      table.minPts,
      true
    );
  },

  /**
   * Calculate 5k row score (for 46+ or medical waiver)
   */
  calculateRow(gender, ageBracket, seconds) {
    const table = ScoringTables.ROW_5K[gender]?.[ageBracket];
    if (!table) return 0;

    if (seconds > table.minTime) return 0;

    return this.interpolateScore(
      seconds,
      table.maxTime,
      table.minTime,
      table.maxPts,
      table.minPts,
      true
    );
  },

  /**
   * Calculate Movement to Contact score
   */
  calculateMTC(gender, ageBracket, seconds, isAltitude = false) {
    const table = ScoringTables.MTC[gender][ageBracket];
    if (!table) return 0;

    let maxTime = table.maxTime;
    let minTime = table.minTime;

    // Altitude adjustment (same as run)
    if (isAltitude) {
      maxTime += 30;
      minTime += 60;
    }

    if (seconds > minTime) return 0;

    return this.interpolateScore(
      seconds,
      maxTime,
      minTime,
      table.maxPts,
      table.minPts,
      true
    );
  },

  /**
   * Calculate Ammunition Lift score
   */
  calculateAmmoLift(gender, ageBracket, reps) {
    const table = ScoringTables.AMMO_LIFT[gender][ageBracket];
    if (!table) return 0;

    if (reps < table.minReps) return 0;

    return this.interpolateScore(
      reps,
      table.maxReps,
      table.minReps,
      table.maxPts,
      table.minPts,
      false
    );
  },

  /**
   * Calculate Maneuver Under Fire score
   */
  calculateMANUF(gender, ageBracket, seconds, isAltitude = false) {
    const table = ScoringTables.MANUF[gender][ageBracket];
    if (!table) return 0;

    let maxTime = table.maxTime;
    let minTime = table.minTime;

    if (isAltitude) {
      maxTime += 30;
      minTime += 60;
    }

    if (seconds > minTime) return 0;

    return this.interpolateScore(
      seconds,
      maxTime,
      minTime,
      table.maxPts,
      table.minPts,
      true
    );
  },

  /**
   * Get classification from total score
   */
  getClassification(totalScore) {
    const c = ScoringTables.CLASSIFICATION;
    if (totalScore >= c.FIRST_CLASS) return { class: '1st Class', grade: 'A' };
    if (totalScore >= c.SECOND_CLASS) return { class: '2nd Class', grade: 'B' };
    if (totalScore >= c.THIRD_CLASS) return { class: '3rd Class', grade: 'C' };
    return { class: 'Fail', grade: 'Fail' };
  },

  /**
   * Check if all events meet minimum score
   */
  checkMinimumScores(scores) {
    const minScore = ScoringTables.CLASSIFICATION.MIN_EVENT_SCORE;
    const failures = [];

    for (const [event, score] of Object.entries(scores)) {
      if (score < minScore) {
        failures.push(event);
      }
    }

    return {
      passed: failures.length === 0,
      failures
    };
  },

  /**
   * Calculate complete PFT score
   */
  calculatePFTScore(gender, age, options) {
    const ageBracket = ScoringTables.getAgeBracket(age);

    // Upper body event
    let upperBodyScore = 0;
    let upperBodyEvent = '';
    if (options.pullups !== undefined && options.pullups !== null) {
      upperBodyScore = this.calculatePullups(gender, ageBracket, options.pullups);
      upperBodyEvent = 'Pull-ups';
    } else if (options.pushups !== undefined && options.pushups !== null) {
      upperBodyScore = this.calculatePushups(gender, ageBracket, options.pushups);
      upperBodyEvent = 'Push-ups';
    }

    // Core event (plank)
    const coreScore = this.calculatePlank(options.plankSeconds || 0);

    // Cardio event
    let cardioScore = 0;
    let cardioEvent = '';
    if (options.isRow && options.rowSeconds) {
      cardioScore = this.calculateRow(gender, ageBracket, options.rowSeconds);
      cardioEvent = '5k Row';
    } else if (options.runSeconds) {
      cardioScore = this.calculateRun(gender, ageBracket, options.runSeconds, options.isAltitude);
      cardioEvent = '3-Mile Run';
    }

    const total = upperBodyScore + coreScore + cardioScore;
    const classification = this.getClassification(total);

    // Check minimum event scores
    const eventScores = {
      [upperBodyEvent]: upperBodyScore,
      'Plank': coreScore,
      [cardioEvent]: cardioScore
    };
    const minCheck = this.checkMinimumScores(eventScores);

    return {
      upperBody: { event: upperBodyEvent, score: upperBodyScore },
      core: { event: 'Plank', score: coreScore },
      cardio: { event: cardioEvent, score: cardioScore },
      total,
      classification: minCheck.passed ? classification.class : 'Fail',
      grade: minCheck.passed ? classification.grade : 'Fail',
      minimumsMet: minCheck.passed,
      failedEvents: minCheck.failures
    };
  },

  /**
   * Calculate complete CFT score
   */
  calculateCFTScore(gender, age, options) {
    const ageBracket = ScoringTables.getAgeBracket(age);
    const isAltitude = options.isAltitude || false;

    const mtcScore = this.calculateMTC(gender, ageBracket, options.mtcSeconds || 0, isAltitude);
    const alScore = this.calculateAmmoLift(gender, ageBracket, options.ammoLifts || 0);
    const manufScore = this.calculateMANUF(gender, ageBracket, options.manufSeconds || 0, isAltitude);

    const total = mtcScore + alScore + manufScore;
    const classification = this.getClassification(total);

    // Check minimum event scores
    const eventScores = {
      'MTC': mtcScore,
      'Ammo Lift': alScore,
      'MANUF': manufScore
    };
    const minCheck = this.checkMinimumScores(eventScores);

    return {
      mtc: { event: 'Movement to Contact', score: mtcScore },
      al: { event: 'Ammunition Lift', score: alScore },
      manuf: { event: 'Maneuver Under Fire', score: manufScore },
      total,
      classification: minCheck.passed ? classification.class : 'Fail',
      grade: minCheck.passed ? classification.grade : 'Fail',
      minimumsMet: minCheck.passed,
      failedEvents: minCheck.failures
    };
  },

  /**
   * Convert time string (MM:SS) to seconds
   */
  timeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
  },

  /**
   * Convert seconds to time string (MM:SS)
   */
  secondsToTime(totalSeconds) {
    if (!totalSeconds || totalSeconds < 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}
