/**
 * Execution Section Handler
 * Manages the Execution section of the order
 */

const ExecutionSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'intent-purpose': 'execution.intent.purpose',
      'intent-method': 'execution.intent.method',
      'intent-endstate-friendly': 'execution.intent.endstateFriendly',
      'intent-endstate-enemy': 'execution.intent.endstateEnemy',
      'intent-endstate-terrain': 'execution.intent.endstateTerrain',
      'scheme-maneuver': 'execution.concept.schemeManeuver',
      'fire-support': 'execution.concept.fireSupport',
      'task-team1': 'execution.tasks.team1',
      'task-team2': 'execution.tasks.team2',
      'task-team3': 'execution.tasks.team3',
      'task-attachments': 'execution.tasks.attachments',
      'coord-timeline': 'execution.coordinating.timeline',
      'coord-priority-fires': 'execution.coordinating.priorityFires',
      'coord-roe': 'execution.coordinating.roe',
      'coord-mopp': 'execution.coordinating.mopp',
      'coord-contact': 'execution.coordinating.contact',
      'coord-objective': 'execution.coordinating.objective',
      'coord-consolidation': 'execution.coordinating.consolidation',
      'coord-formation': 'execution.coordinating.formation',
      'coord-technique': 'execution.coordinating.technique',
      'coord-departure': 'execution.coordinating.departure'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Execution Help',
      content: `
        <h4>Purpose</h4>
        <p>Detail how you will accomplish the mission. This is the most detailed section of the order.</p>

        <h4>Commander's Intent</h4>
        <ul>
          <li><strong>Purpose</strong> - The "why" behind the mission</li>
          <li><strong>Method</strong> - General approach to accomplish the mission</li>
          <li><strong>End State</strong> - What success looks like for friendly, enemy, and terrain</li>
        </ul>

        <h4>Concept of Operations</h4>
        <ul>
          <li><strong>Scheme of Maneuver</strong> - How you will move and fight</li>
          <li><strong>Fire Support</strong> - How fires will support the maneuver</li>
        </ul>

        <h4>Tasks to Subordinates</h4>
        <p>Each subordinate task should include WHO, WHAT, WHERE, WHEN, and WHY.</p>

        <h4>Coordinating Instructions</h4>
        <p>Key information that applies to everyone:</p>
        <ul>
          <li>Timeline and phases</li>
          <li>ROE (Rules of Engagement)</li>
          <li>Actions on contact</li>
          <li>Movement formation and technique</li>
          <li>Consolidation and reorganization</li>
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
    const e = data.execution;
    return !!(
      e.intent.purpose ||
      e.intent.method ||
      e.concept.schemeManeuver ||
      e.tasks.team1 ||
      e.coordinating.timeline ||
      e.coordinating.contact
    );
  }
};
