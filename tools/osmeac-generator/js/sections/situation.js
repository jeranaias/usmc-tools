/**
 * Situation Section Handler
 * Manages the Situation section of the order
 */

const SituationSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'salute-size': 'situation.salute.size',
      'salute-activity': 'situation.salute.activity',
      'salute-location': 'situation.salute.location',
      'salute-unit': 'situation.salute.unit',
      'salute-time': 'situation.salute.time',
      'salute-equipment': 'situation.salute.equipment',
      'drawd-defend': 'situation.drawd.defend',
      'drawd-reinforce': 'situation.drawd.reinforce',
      'drawd-attack': 'situation.drawd.attack',
      'drawd-withdraw': 'situation.drawd.withdraw',
      'drawd-delay': 'situation.drawd.delay',
      'emlcoa': 'situation.emlcoa',
      'emdcoa': 'situation.emdcoa',
      'higher-mission': 'situation.friendly.higherMission',
      'higher-intent': 'situation.friendly.higherIntent',
      'adjacent-north': 'situation.friendly.adjacentNorth',
      'adjacent-south': 'situation.friendly.adjacentSouth',
      'adjacent-east': 'situation.friendly.adjacentEast',
      'adjacent-west': 'situation.friendly.adjacentWest',
      'supporting-units': 'situation.friendly.supportingUnits',
      'attachments': 'situation.attachments'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Situation Help',
      content: `
        <h4>Purpose</h4>
        <p>Describe the tactical situation including enemy and friendly forces.</p>

        <h4>SALUTE - Enemy Report</h4>
        <ul>
          <li><strong>S</strong>ize - Number of personnel/vehicles</li>
          <li><strong>A</strong>ctivity - What are they doing?</li>
          <li><strong>L</strong>ocation - Where are they?</li>
          <li><strong>U</strong>nit/Uniform - Identification</li>
          <li><strong>T</strong>ime - When observed?</li>
          <li><strong>E</strong>quipment - Weapons and gear</li>
        </ul>

        <h4>DRAW-D - Enemy Capabilities</h4>
        <ul>
          <li><strong>D</strong>efend - Can they hold their position?</li>
          <li><strong>R</strong>einforce - Can they get help?</li>
          <li><strong>A</strong>ttack - Can they attack us?</li>
          <li><strong>W</strong>ithdraw - Can they escape?</li>
          <li><strong>D</strong>elay - Can they slow us down?</li>
        </ul>

        <h4>COAs</h4>
        <ul>
          <li><strong>EMLCOA</strong> - Enemy Most Likely Course of Action</li>
          <li><strong>EMDCOA</strong> - Enemy Most Dangerous Course of Action</li>
        </ul>
      `
    };
  },

  /**
   * Check if section has data
   * @param {Object} data - Order data
   * @returns {boolean} - Whether section has data
   */
  hasData(data) {
    const s = data.situation;
    return !!(
      s.salute.size ||
      s.salute.activity ||
      s.salute.location ||
      s.emlcoa ||
      s.emdcoa ||
      s.friendly.higherMission ||
      s.attachments
    );
  }
};
