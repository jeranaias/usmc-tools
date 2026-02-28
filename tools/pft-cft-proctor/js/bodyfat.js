/**
 * Body Composition / Height-Weight Calculator
 * Based on MCO 6110.3A w/CH-4
 */

const BodyFat = {
  /**
   * Check if Marine meets weight standard
   * @param {string} gender - 'male' or 'female'
   * @param {number} age - Age in years
   * @param {number} heightInches - Height in inches
   * @param {number} weight - Weight in pounds
   */
  checkWeightStandard(gender, age, heightInches, weight) {
    const ageBracket = ScoringTables.getWeightAgeBracket(age);
    const standards = ScoringTables.WEIGHT_STANDARDS[gender];

    if (!standards) {
      return { error: 'Invalid gender' };
    }

    // Find height standard (round to nearest inch)
    const height = Math.round(heightInches);
    const heightStandard = standards[height];

    if (!heightStandard) {
      return { error: `No standard for height ${height}"` };
    }

    const maxWeight = heightStandard[ageBracket];

    return {
      maxWeight,
      actualWeight: weight,
      overBy: weight > maxWeight ? weight - maxWeight : 0,
      withinStandard: weight <= maxWeight,
      requiresBCP: weight > maxWeight
    };
  },

  /**
   * Calculate body fat percentage using DoD tape test method
   *
   * Male: Circumference Value = Abdomen - Neck
   * Female: Circumference Value = Abdomen + Hips - Neck
   *
   * Uses DoD body fat formula (derived from Navy method)
   *
   * @param {string} gender - 'male' or 'female'
   * @param {number} heightInches - Height in inches
   * @param {number} neck - Neck circumference (rounded UP to nearest 0.5")
   * @param {number} abdomen - Abdomen circumference (rounded DOWN to nearest 0.5")
   * @param {number} hips - Hips circumference for females (rounded DOWN to nearest 0.5")
   */
  calculateBodyFat(gender, heightInches, neck, abdomen, hips = 0) {
    // Round measurements per regulations
    const neckRounded = this.roundUp(neck);
    const abdomenRounded = this.roundDown(abdomen);
    const hipsRounded = this.roundDown(hips);

    let circumferenceValue;
    let bodyFatPercent;

    if (gender === 'male') {
      circumferenceValue = abdomenRounded - neckRounded;

      // Male body fat formula (DoD/Navy method)
      // BF% = 86.010 * log10(abdomen - neck) - 70.041 * log10(height) + 36.76
      bodyFatPercent = (86.010 * Math.log10(circumferenceValue)) -
                       (70.041 * Math.log10(heightInches)) + 36.76;
    } else {
      circumferenceValue = abdomenRounded + hipsRounded - neckRounded;

      // Female body fat formula (DoD/Navy method)
      // BF% = 163.205 * log10(abdomen + hips - neck) - 97.684 * log10(height) - 78.387
      bodyFatPercent = (163.205 * Math.log10(circumferenceValue)) -
                       (97.684 * Math.log10(heightInches)) - 78.387;
    }

    // Round to nearest whole number
    bodyFatPercent = Math.round(bodyFatPercent);

    // Ensure non-negative
    if (bodyFatPercent < 0) bodyFatPercent = 0;

    const maxAllowed = ScoringTables.BODY_FAT_LIMITS[gender];
    const withinStandard = bodyFatPercent <= maxAllowed;

    return {
      circumferenceValue,
      bodyFatPercent,
      maxAllowed,
      withinStandard,
      overBy: withinStandard ? 0 : bodyFatPercent - maxAllowed,
      measurements: {
        neck: neckRounded,
        abdomen: abdomenRounded,
        hips: hipsRounded
      }
    };
  },

  /**
   * Round up to nearest 0.5
   */
  roundUp(value) {
    return Math.ceil(value * 2) / 2;
  },

  /**
   * Round down to nearest 0.5
   */
  roundDown(value) {
    return Math.floor(value * 2) / 2;
  },

  /**
   * Complete BCP assessment
   */
  assessBCP(gender, age, heightInches, weight, neck, abdomen, hips = 0) {
    // First check weight standard
    const weightCheck = this.checkWeightStandard(gender, age, heightInches, weight);

    if (weightCheck.error) {
      return { error: weightCheck.error };
    }

    // If within weight standard, no BCP needed
    if (weightCheck.withinStandard) {
      return {
        weightCheck,
        requiresTape: false,
        bodyFatCheck: null,
        overallStatus: 'PASS',
        message: 'Within height/weight standards'
      };
    }

    // Over weight standard, calculate body fat
    const bodyFatCheck = this.calculateBodyFat(gender, heightInches, neck, abdomen, hips);

    const overallStatus = bodyFatCheck.withinStandard ? 'PASS' : 'FAIL';

    return {
      weightCheck,
      requiresTape: true,
      bodyFatCheck,
      overallStatus,
      message: bodyFatCheck.withinStandard
        ? `Over weight standard but within body fat limit (${bodyFatCheck.bodyFatPercent}%)`
        : `Exceeds body fat standard: ${bodyFatCheck.bodyFatPercent}% (max ${bodyFatCheck.maxAllowed}%)`
    };
  },

  /**
   * Get measurement instructions
   */
  getMeasurementInstructions(gender) {
    const instructions = {
      neck: "Measure at Adam's apple level. Round UP to nearest 0.5 inch.",
      abdomen: "Measure at navel level (belly button). Round DOWN to nearest 0.5 inch."
    };

    if (gender === 'female') {
      instructions.hips = "Measure at widest point of hips/buttocks. Round DOWN to nearest 0.5 inch.";
    }

    return instructions;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BodyFat;
}
