/**
 * Tactical Tasks Reference
 * Common tactical tasks for mission building
 */

const TacticalTasks = {
  // Offensive Tasks
  offensive: [
    'attacks to seize',
    'attacks to destroy',
    'attacks to neutralize',
    'attacks to secure',
    'attacks to clear',
    'conducts a raid on',
    'conducts an ambush at',
    'infiltrates to',
    'breaches',
    'bypasses',
    'envelops',
    'penetrates',
    'turns'
  ],

  // Defensive Tasks
  defensive: [
    'defends',
    'delays',
    'withdraws to',
    'retrogrades to',
    'blocks',
    'contains',
    'disrupts'
  ],

  // Security Tasks
  security: [
    'screens',
    'guards',
    'covers',
    'conducts area security of'
  ],

  // Other Tasks
  other: [
    'reconnoiters',
    'occupies',
    'secures',
    'seizes',
    'holds',
    'supports by fire',
    'provides overwatch of',
    'establishes a blocking position at'
  ],

  /**
   * Get all tasks as flat array
   * @returns {Array} - All tactical tasks
   */
  getAll() {
    return [
      ...this.offensive,
      ...this.defensive,
      ...this.security,
      ...this.other
    ];
  },

  /**
   * Get tasks grouped by category
   * @returns {Object} - Tasks grouped by category
   */
  getGrouped() {
    return {
      'Offensive Tasks': this.offensive,
      'Defensive Tasks': this.defensive,
      'Security Tasks': this.security,
      'Other Tasks': this.other
    };
  }
};
