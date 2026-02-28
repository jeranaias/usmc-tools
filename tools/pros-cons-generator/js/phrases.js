/**
 * Phrase Banks for Proficiency and Conduct Statements
 * Organized by performance level (5.0 to 1.0)
 */

const PhraseBanks = {
  // Proficiency phrases organized by level
  proficiency: {
    '5.0': [
      'Performs all duties in an exemplary manner',
      'Consistently exceeds standards in all areas',
      'Demonstrates exceptional technical proficiency',
      'Produces work of the highest quality',
      'Displays superior knowledge of MOS',
      'Takes charge and leads effectively',
      'Mentors junior Marines beyond expectations',
      'Achieves exceptional results consistently',
      'Expert-level proficiency in primary duties',
      'Outstanding initiative and resourcefulness',
      'Exceptional problem-solving abilities',
      'Completes all assignments ahead of schedule',
      'Work quality is consistently flawless',
      'Superior performer in all aspects'
    ],
    '4.5': [
      'Exceeds standards in performance of duties',
      'Highly proficient in MOS skills',
      'Produces high-quality work consistently',
      'Strong technical knowledge',
      'Reliable and effective performer',
      'Takes initiative without prompting',
      'Excellent work ethic',
      'Demonstrates leadership potential',
      'Eager to accept additional responsibilities',
      'Thorough and detail-oriented'
    ],
    '4.0': [
      'Performs duties well above average',
      'Solid technical proficiency',
      'Consistent quality of work',
      'Reliable performer',
      'Meets and often exceeds standards',
      'Good initiative',
      'Professional approach to duties',
      'Completes tasks efficiently'
    ],
    '3.5': [
      'Performs duties satisfactorily',
      'Meets minimum standards',
      'Adequate technical knowledge',
      'Acceptable work quality',
      'Requires occasional supervision',
      'Generally reliable',
      'Satisfactory performer',
      'Meets basic requirements'
    ],
    '3.0': [
      'Performs duties satisfactorily',
      'Meets minimum standards',
      'Adequate technical knowledge',
      'Acceptable work quality',
      'Requires occasional supervision',
      'Generally reliable',
      'Satisfactory performer',
      'Meets basic requirements'
    ],
    '2.5': [
      'Fails to meet standards consistently',
      'Requires frequent supervision',
      'Work quality is inconsistent',
      'Technical knowledge is lacking',
      'Does not take initiative',
      'Performance needs improvement',
      'Struggles with basic duties',
      'Below expectations for grade'
    ],
    '2.0': [
      'Fails to meet standards consistently',
      'Requires frequent supervision',
      'Work quality is inconsistent',
      'Technical knowledge is lacking',
      'Does not take initiative',
      'Performance needs improvement',
      'Struggles with basic duties',
      'Below expectations for grade'
    ],
    '1.5': [
      'Consistently fails to meet minimum standards',
      'Unable to perform basic duties',
      'Requires constant supervision',
      'Significant performance deficiencies',
      'Has not responded to corrective guidance',
      'Detrimental to unit readiness'
    ],
    '1.0': [
      'Consistently fails to meet minimum standards',
      'Unable to perform basic duties',
      'Requires constant supervision',
      'Significant performance deficiencies',
      'Has not responded to corrective guidance',
      'Detrimental to unit readiness'
    ]
  },

  // Conduct phrases organized by level
  conduct: {
    '5.0': [
      'Exemplary conduct in all regards',
      'Sets the standard for junior Marines',
      'Outstanding military bearing',
      'Impeccable personal appearance',
      'Role model for peers and subordinates',
      'Exceptional self-discipline',
      'Positive influence on entire unit',
      'Highest moral and ethical standards',
      'Perfect adherence to regulations'
    ],
    '4.5': [
      'Excellent conduct and bearing',
      'Strong positive influence on others',
      'Professional demeanor at all times',
      'Highly reliable and trustworthy',
      'Maintains high standards',
      'Positive attitude',
      'Respects authority'
    ],
    '4.0': [
      'Good conduct and military bearing',
      'Professional appearance',
      'Reliable and punctual',
      'Positive influence on peers',
      'Follows orders without issue',
      'Good self-discipline'
    ],
    '3.5': [
      'Satisfactory conduct',
      'Generally follows regulations',
      'Adequate military bearing',
      'Acceptable appearance',
      'Minor issues only',
      'Requires occasional reminder of standards'
    ],
    '3.0': [
      'Satisfactory conduct',
      'Generally follows regulations',
      'Adequate military bearing',
      'Acceptable appearance',
      'Minor issues only',
      'Requires occasional reminder of standards'
    ],
    '2.5': [
      'Conduct issues noted',
      'Has received counseling for behavior',
      'Requires frequent correction',
      'Negative influence on peers',
      'Military bearing needs improvement',
      'Does not consistently follow regulations'
    ],
    '2.0': [
      'Conduct issues noted',
      'Has received counseling for behavior',
      'Requires frequent correction',
      'Negative influence on peers',
      'Military bearing needs improvement',
      'Does not consistently follow regulations'
    ],
    '1.5': [
      'Serious conduct deficiencies',
      'Has received NJP/disciplinary action',
      'Consistent disregard for regulations',
      'Detrimental influence on unit',
      'Does not respond to corrective measures'
    ],
    '1.0': [
      'Serious conduct deficiencies',
      'Has received NJP/disciplinary action',
      'Consistent disregard for regulations',
      'Detrimental influence on unit',
      'Does not respond to corrective measures'
    ]
  },

  // Action verbs bank
  actionVerbs: {
    leadership: [
      'Leads', 'Directs', 'Guides', 'Mentors', 'Coaches',
      'Develops', 'Supervises', 'Manages', 'Coordinates', 'Organizes',
      'Delegates', 'Motivates', 'Inspires', 'Influences'
    ],
    performance: [
      'Performs', 'Executes', 'Accomplishes', 'Achieves', 'Completes',
      'Delivers', 'Produces', 'Maintains', 'Ensures', 'Demonstrates',
      'Exhibits', 'Displays'
    ],
    initiative: [
      'Initiates', 'Volunteers', 'Seeks', 'Pursues', 'Identifies',
      'Recognizes', 'Anticipates', 'Proposes', 'Recommends', 'Implements'
    ],
    technical: [
      'Masters', 'Operates', 'Repairs', 'Troubleshoots', 'Analyzes',
      'Evaluates', 'Assesses', 'Inspects', 'Verifies', 'Calibrates'
    ],
    support: [
      'Assists', 'Supports', 'Aids', 'Helps', 'Contributes',
      'Participates', 'Cooperates', 'Collaborates'
    ]
  },

  // MOS-specific phrases
  mosSpecific: {
    admin: [
      'Maintains accurate administrative records',
      'Processes correspondence efficiently',
      'Demonstrates proficiency in Marine Online systems',
      'Ensures compliance with records management procedures'
    ],
    combat: [
      'Maintains combat readiness at all times',
      'Demonstrates proficiency with assigned weapons systems',
      'Excels in tactical operations',
      'Leads fire team/squad effectively in field environments'
    ],
    aviation: [
      'Maintains aircraft to highest safety standards',
      'Demonstrates technical expertise in aviation systems',
      'Ensures flight safety compliance',
      'Proficient in pre-flight and post-flight procedures'
    ],
    logistics: [
      'Manages supply chain operations effectively',
      'Maintains accurate inventory records',
      'Ensures timely distribution of supplies',
      'Demonstrates proficiency in logistics information systems'
    ],
    communications: [
      'Maintains communications equipment to standard',
      'Ensures network security and reliability',
      'Demonstrates proficiency with multiple comm systems',
      'Troubleshoots technical issues effectively'
    ],
    intelligence: [
      'Produces accurate and timely intelligence products',
      'Demonstrates analytical thinking skills',
      'Maintains security of classified materials',
      'Briefs effectively at all levels'
    ],
    'motor-t': [
      'Maintains vehicles to highest standards',
      'Operates vehicles safely in all conditions',
      'Ensures proper preventive maintenance',
      'Demonstrates proficiency in convoy operations'
    ],
    general: []
  },

  /**
   * Get phrases for a specific level and type
   * @param {string} type - 'proficiency' or 'conduct'
   * @param {string} level - Mark level (e.g., '4.0', '5.0')
   * @returns {Array} Array of phrases
   */
  getPhrases(type, level) {
    const bank = this[type];
    if (!bank) return [];

    // Handle ranges (e.g., 3.5 and 3.0 share same phrases)
    const levelFloat = parseFloat(level);

    // Default to 4.0 (above average) if level is empty, NaN, or invalid
    if (isNaN(levelFloat) || levelFloat < 1.0 || levelFloat > 5.0) {
      return bank['4.0'] || [];
    }

    if (levelFloat >= 5.0) return bank['5.0'] || [];
    if (levelFloat >= 4.5) return bank['4.5'] || [];
    if (levelFloat >= 4.0) return bank['4.0'] || [];
    if (levelFloat >= 3.0) return bank['3.5'] || [];
    if (levelFloat >= 2.0) return bank['2.5'] || [];
    return bank['1.5'] || [];
  },

  /**
   * Get MOS-specific phrases
   * @param {string} mosType - MOS category
   * @returns {Array} Array of MOS-specific phrases
   */
  getMosPhrases(mosType) {
    return this.mosSpecific[mosType] || [];
  },

  /**
   * Get quick phrases based on level (top 3-5 for display)
   * @param {string} type - 'proficiency' or 'conduct'
   * @param {string} level - Mark level
   * @returns {Array} Array of quick phrases
   */
  getQuickPhrases(type, level) {
    const phrases = this.getPhrases(type, level);
    return phrases.slice(0, 5);
  }
};

// Make available globally
window.PhraseBanks = PhraseBanks;
