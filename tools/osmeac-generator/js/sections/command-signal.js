/**
 * Command & Signal Section Handler
 * Manages the Command & Signal section of the order
 */

const CommandSignalSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'cmd-location': 'command.command.location',
      'cmd-succession': 'command.command.succession',
      'cmd-cp': 'command.command.cp',
      'freq-primary': 'command.frequencies.primary',
      'freq-alternate': 'command.frequencies.alternate',
      'freq-contingency': 'command.frequencies.contingency',
      'freq-emergency': 'command.frequencies.emergency',
      'callsign-higher': 'command.callsigns.higher',
      'callsign-this': 'command.callsigns.thisUnit',
      'callsign-subordinates': 'command.callsigns.subordinates',
      'signal-shiftfire': 'command.signals.shiftFire',
      'signal-ceasefire': 'command.signals.ceaseFire',
      'signal-assault': 'command.signals.assault',
      'signal-rally': 'command.signals.rally',
      'pyrotechnics': 'command.pyrotechnics',
      'challenge-password': 'command.challengePassword',
      'running-password': 'command.runningPassword',
      'number-combo': 'command.numberCombo',
      'time-hack': 'command.timeHack'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Command & Signal Help',
      content: `
        <h4>Purpose</h4>
        <p>Establish command relationships and communication procedures.</p>

        <h4>Command</h4>
        <ul>
          <li><strong>Location of Commander</strong> - Where you will be during execution</li>
          <li><strong>Succession of Command</strong> - Who takes over if leader becomes a casualty</li>
          <li><strong>CP Location</strong> - Command Post grid coordinate</li>
        </ul>

        <h4>Signal - PACE Plan</h4>
        <ul>
          <li><strong>Primary</strong> - Main communication method</li>
          <li><strong>Alternate</strong> - Backup method</li>
          <li><strong>Contingency</strong> - Third option</li>
          <li><strong>Emergency</strong> - Last resort</li>
        </ul>

        <h4>Call Signs</h4>
        <p>Use assigned call signs for radio communications.</p>

        <h4>Signals</h4>
        <p>Visual or audible signals for key actions:</p>
        <ul>
          <li>Shift Fire - Move fire to a new target</li>
          <li>Cease Fire - Stop shooting</li>
          <li>Assault - Begin the assault</li>
          <li>Rally Point - Location to regroup</li>
        </ul>

        <h4>Recognition</h4>
        <ul>
          <li><strong>Challenge/Password</strong> - Near recognition (whispered)</li>
          <li><strong>Running Password</strong> - Far recognition (shouted)</li>
          <li><strong>Number Combination</strong> - Numbers that add to a specific sum</li>
        </ul>

        <h4>Time Hack</h4>
        <p>Synchronize watches at the end of the order.</p>
      `
    };
  },

  /**
   * Check if section has data
   * @param {Object} data - Order data
   * @returns {boolean} - Whether section has data
   */
  hasData(data) {
    const c = data.command;
    return !!(
      c.command.location ||
      c.command.succession ||
      c.frequencies.primary ||
      c.callsigns.thisUnit ||
      c.challengePassword
    );
  }
};
