/**
 * Mission Section Handler
 * Manages the Mission section of the order
 */

const MissionSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'mission-who': 'mission.who',
      'mission-what': 'mission.what',
      'mission-what-custom': 'mission.whatCustom',
      'mission-where': 'mission.where',
      'mission-when': 'mission.when',
      'mission-why': 'mission.why'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Mission Help',
      content: `
        <h4>Purpose</h4>
        <p>State the mission using the 5 W's format. A clear mission statement tells subordinates exactly what needs to be accomplished.</p>

        <h4>The 5 W's</h4>
        <ul>
          <li><strong>WHO</strong> - Your unit (e.g., "1st Squad")</li>
          <li><strong>WHAT</strong> - The tactical task (e.g., "attacks to seize")</li>
          <li><strong>WHERE</strong> - The location (e.g., "Building 4 at grid 12345678")</li>
          <li><strong>WHEN</strong> - The time (e.g., "NLT 0600")</li>
          <li><strong>WHY</strong> - The purpose (e.g., "establish a support-by-fire position")</li>
        </ul>

        <h4>Mission Statement Format</h4>
        <p><em>[WHO] [WHAT] [WHERE] [WHEN] IOT [WHY].</em></p>

        <h4>Example</h4>
        <p>"1st Squad attacks to seize Building 4 at grid 12345678 NLT 0600 IOT establish a support-by-fire position for the platoon's main assault."</p>

        <h4>Tips</h4>
        <ul>
          <li>Use active voice</li>
          <li>Be specific about location</li>
          <li>Make the purpose clear</li>
          <li>NLT = No Later Than</li>
          <li>IOT = In Order To</li>
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
    const m = data.mission;
    return !!(m.who || m.what || m.whatCustom || m.where || m.when || m.why);
  },

  /**
   * Update mission preview in real-time
   * @param {Object} data - Mission data
   */
  updatePreview(data) {
    const previewEl = document.getElementById('mission-statement-preview');
    if (!previewEl) return;

    const who = data.who || '[WHO]';
    const what = data.whatCustom || data.what || '[WHAT]';
    const where = data.where || '[WHERE]';
    const when = data.when || '[WHEN]';
    const why = data.why || '[WHY]';

    if (data.who || data.what || data.whatCustom || data.where || data.when || data.why) {
      previewEl.textContent = `"${who} ${what} ${where} ${when} IOT ${why}."`;
    } else {
      previewEl.textContent = 'Complete the fields above to generate your mission statement.';
    }
  }
};
