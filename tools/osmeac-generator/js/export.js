/**
 * Export Module
 * Handles exporting orders to text and printing
 */

const Export = {
  /**
   * Generate formatted order text from order data
   * @param {Object} data - Order data
   * @returns {string} - Formatted order text
   */
  generateOrderText(data) {
    const lines = [];

    // Header
    lines.push('═'.repeat(60));
    lines.push('                    5-PARAGRAPH ORDER');
    lines.push('═'.repeat(60));
    lines.push('');

    // ORIENTATION
    lines.push('ORIENTATION');
    lines.push('─'.repeat(40));
    lines.push('');

    if (data.orientation.presentLocation) {
      lines.push(`   a. Present Location: Grid ${data.orientation.presentLocation}`);
    }

    if (data.orientation.directionAzimuth || data.orientation.directionDistance) {
      const azimuth = data.orientation.directionAzimuth || '___';
      const distance = data.orientation.directionDistance || '___';
      lines.push(`   b. Direction of Attack: ${azimuth}° magnetic, ${distance} meters`);
    }

    if (data.orientation.objectiveLocation) {
      lines.push(`   c. Objective Location: Grid ${data.orientation.objectiveLocation}`);
    }

    lines.push('');
    lines.push('   d. Terrain (KOCOA):');
    if (data.orientation.kocoa.keyTerrain) {
      lines.push(`      (1) Key Terrain: ${data.orientation.kocoa.keyTerrain}`);
    }
    if (data.orientation.kocoa.observation) {
      lines.push(`      (2) Observation & Fields of Fire: ${data.orientation.kocoa.observation}`);
    }
    if (data.orientation.kocoa.cover) {
      lines.push(`      (3) Cover & Concealment: ${data.orientation.kocoa.cover}`);
    }
    if (data.orientation.kocoa.obstacles) {
      lines.push(`      (4) Obstacles: ${data.orientation.kocoa.obstacles}`);
    }
    if (data.orientation.kocoa.avenues) {
      lines.push(`      (5) Avenues of Approach: ${data.orientation.kocoa.avenues}`);
    }

    if (data.orientation.weather) {
      lines.push('');
      lines.push(`   e. Weather: ${data.orientation.weather}`);
    }

    lines.push('');
    lines.push('   "Are there any questions on the orientation?"');
    lines.push('');
    lines.push('');

    // I. SITUATION
    lines.push('I. SITUATION');
    lines.push('─'.repeat(40));
    lines.push('');

    lines.push('   a. Enemy Forces:');
    lines.push('      (1) Composition, Disposition, Strength (SALUTE):');
    if (data.situation.salute.size) {
      lines.push(`          - Size: ${data.situation.salute.size}`);
    }
    if (data.situation.salute.activity) {
      lines.push(`          - Activity: ${data.situation.salute.activity}`);
    }
    if (data.situation.salute.location) {
      lines.push(`          - Location: ${data.situation.salute.location}`);
    }
    if (data.situation.salute.unit) {
      lines.push(`          - Unit/Uniform: ${data.situation.salute.unit}`);
    }
    if (data.situation.salute.time) {
      lines.push(`          - Time: ${data.situation.salute.time}`);
    }
    if (data.situation.salute.equipment) {
      lines.push(`          - Equipment: ${data.situation.salute.equipment}`);
    }

    lines.push('');
    lines.push('      (2) Capabilities (DRAW-D):');
    if (data.situation.drawd.defend) {
      lines.push(`          - Defend: ${data.situation.drawd.defend}`);
    }
    if (data.situation.drawd.reinforce) {
      lines.push(`          - Reinforce: ${data.situation.drawd.reinforce}`);
    }
    if (data.situation.drawd.attack) {
      lines.push(`          - Attack: ${data.situation.drawd.attack}`);
    }
    if (data.situation.drawd.withdraw) {
      lines.push(`          - Withdraw: ${data.situation.drawd.withdraw}`);
    }
    if (data.situation.drawd.delay) {
      lines.push(`          - Delay: ${data.situation.drawd.delay}`);
    }

    if (data.situation.emlcoa) {
      lines.push('');
      lines.push(`      (3) EMLCOA: ${data.situation.emlcoa}`);
    }

    if (data.situation.emdcoa) {
      lines.push('');
      lines.push(`      (4) EMDCOA: ${data.situation.emdcoa}`);
    }

    lines.push('');
    lines.push('   b. Friendly Forces:');
    if (data.situation.friendly.higherMission) {
      lines.push(`      (1) Higher's Mission: ${data.situation.friendly.higherMission}`);
    }
    if (data.situation.friendly.higherIntent) {
      lines.push(`      (2) Higher's Intent: ${data.situation.friendly.higherIntent}`);
    }
    lines.push('      (3) Adjacent Units:');
    if (data.situation.friendly.adjacentNorth) {
      lines.push(`          - North: ${data.situation.friendly.adjacentNorth}`);
    }
    if (data.situation.friendly.adjacentSouth) {
      lines.push(`          - South: ${data.situation.friendly.adjacentSouth}`);
    }
    if (data.situation.friendly.adjacentEast) {
      lines.push(`          - East: ${data.situation.friendly.adjacentEast}`);
    }
    if (data.situation.friendly.adjacentWest) {
      lines.push(`          - West: ${data.situation.friendly.adjacentWest}`);
    }
    if (data.situation.friendly.supportingUnits) {
      lines.push(`      (4) Supporting Units: ${data.situation.friendly.supportingUnits}`);
    }

    if (data.situation.attachments) {
      lines.push('');
      lines.push(`   c. Attachments/Detachments: ${data.situation.attachments}`);
    }

    lines.push('');
    lines.push('');

    // II. MISSION
    lines.push('II. MISSION');
    lines.push('─'.repeat(40));
    lines.push('');

    const missionStatement = this.buildMissionStatement(data.mission);
    lines.push(`    ${missionStatement}`);

    lines.push('');
    lines.push('');

    // III. EXECUTION
    lines.push('III. EXECUTION');
    lines.push('─'.repeat(40));
    lines.push('');

    lines.push('    a. Commander\'s Intent:');
    if (data.execution.intent.purpose) {
      lines.push(`       (1) Purpose: ${data.execution.intent.purpose}`);
    }
    if (data.execution.intent.method) {
      lines.push(`       (2) Method: ${data.execution.intent.method}`);
    }
    lines.push('       (3) End State:');
    if (data.execution.intent.endstateFriendly) {
      lines.push(`           - Friendly: ${data.execution.intent.endstateFriendly}`);
    }
    if (data.execution.intent.endstateEnemy) {
      lines.push(`           - Enemy: ${data.execution.intent.endstateEnemy}`);
    }
    if (data.execution.intent.endstateTerrain) {
      lines.push(`           - Terrain: ${data.execution.intent.endstateTerrain}`);
    }

    lines.push('');
    lines.push('    b. Concept of Operations:');
    if (data.execution.concept.schemeManeuver) {
      lines.push(`       (1) Scheme of Maneuver: ${data.execution.concept.schemeManeuver}`);
    }
    if (data.execution.concept.fireSupport) {
      lines.push(`       (2) Fire Support Plan: ${data.execution.concept.fireSupport}`);
    }

    lines.push('');
    lines.push('    c. Tasks to Subordinate Units:');
    if (data.execution.tasks.team1) {
      lines.push(`       (1) 1st Fire Team: ${data.execution.tasks.team1}`);
    }
    if (data.execution.tasks.team2) {
      lines.push(`       (2) 2nd Fire Team: ${data.execution.tasks.team2}`);
    }
    if (data.execution.tasks.team3) {
      lines.push(`       (3) 3rd Fire Team: ${data.execution.tasks.team3}`);
    }
    if (data.execution.tasks.attachments) {
      lines.push(`       (4) Attachments: ${data.execution.tasks.attachments}`);
    }

    lines.push('');
    lines.push('    d. Coordinating Instructions:');
    if (data.execution.coordinating.timeline) {
      lines.push(`       (1) Timeline: ${data.execution.coordinating.timeline}`);
    }
    if (data.execution.coordinating.priorityFires) {
      lines.push(`       (2) Priority of Fires: ${data.execution.coordinating.priorityFires}`);
    }
    if (data.execution.coordinating.roe) {
      lines.push(`       (3) ROE: ${data.execution.coordinating.roe}`);
    }
    if (data.execution.coordinating.mopp) {
      lines.push(`       (4) MOPP Level: ${data.execution.coordinating.mopp}`);
    }
    if (data.execution.coordinating.contact) {
      lines.push(`       (5) Actions on Contact: ${data.execution.coordinating.contact}`);
    }
    if (data.execution.coordinating.objective) {
      lines.push(`       (6) Actions at Objective: ${data.execution.coordinating.objective}`);
    }
    if (data.execution.coordinating.consolidation) {
      lines.push(`       (7) Consolidation/Reorganization: ${data.execution.coordinating.consolidation}`);
    }
    if (data.execution.coordinating.formation) {
      lines.push(`       (8) Movement Formation: ${data.execution.coordinating.formation}`);
    }
    if (data.execution.coordinating.technique) {
      lines.push(`       (9) Movement Technique: ${data.execution.coordinating.technique}`);
    }
    if (data.execution.coordinating.departure) {
      lines.push(`       (10) Departure/Reentry of Lines: ${data.execution.coordinating.departure}`);
    }

    lines.push('');
    lines.push('');

    // IV. ADMINISTRATION & LOGISTICS
    lines.push('IV. ADMINISTRATION & LOGISTICS');
    lines.push('─'.repeat(40));
    lines.push('');

    lines.push('    a. Administration:');
    if (data.admin.administration.epw) {
      lines.push(`       (1) EPW Handling: ${data.admin.administration.epw}`);
    }
    if (data.admin.administration.captured) {
      lines.push(`       (2) Captured Material: ${data.admin.administration.captured}`);
    }

    lines.push('');
    lines.push('    b. Logistics:');
    if (data.admin.logistics.ammo) {
      lines.push(`       (1) Ammunition: ${data.admin.logistics.ammo}`);
    }
    if (data.admin.logistics.rations) {
      lines.push(`       (2) Rations: ${data.admin.logistics.rations}`);
    }
    if (data.admin.logistics.water) {
      lines.push(`       (3) Water: ${data.admin.logistics.water}`);
    }
    if (data.admin.logistics.equipment) {
      lines.push(`       (4) Special Equipment: ${data.admin.logistics.equipment}`);
    }
    if (data.admin.logistics.resupply) {
      lines.push(`       (5) Resupply Point: Grid ${data.admin.logistics.resupply}`);
    }

    lines.push('');
    lines.push('    c. CASEVAC:');
    if (data.admin.casevac.collection) {
      lines.push(`       (1) Collection Point: Grid ${data.admin.casevac.collection}`);
    }
    if (data.admin.casevac.route) {
      lines.push(`       (2) Route: ${data.admin.casevac.route}`);
    }
    if (data.admin.casevac.medical) {
      lines.push(`       (3) Medical Support: ${data.admin.casevac.medical}`);
    }

    lines.push('');
    lines.push('');

    // V. COMMAND & SIGNAL
    lines.push('V. COMMAND & SIGNAL');
    lines.push('─'.repeat(40));
    lines.push('');

    lines.push('    a. Command:');
    if (data.command.command.location) {
      lines.push(`       (1) Location of Commander: ${data.command.command.location}`);
    }
    if (data.command.command.succession) {
      lines.push(`       (2) Succession of Command: ${data.command.command.succession}`);
    }
    if (data.command.command.cp) {
      lines.push(`       (3) CP Location: Grid ${data.command.command.cp}`);
    }

    lines.push('');
    lines.push('    b. Signal:');
    lines.push('       (1) Frequencies:');
    if (data.command.frequencies.primary) {
      lines.push(`           - Primary: ${data.command.frequencies.primary}`);
    }
    if (data.command.frequencies.alternate) {
      lines.push(`           - Alternate: ${data.command.frequencies.alternate}`);
    }
    if (data.command.frequencies.contingency) {
      lines.push(`           - Contingency: ${data.command.frequencies.contingency}`);
    }
    if (data.command.frequencies.emergency) {
      lines.push(`           - Emergency: ${data.command.frequencies.emergency}`);
    }

    lines.push('       (2) Call Signs:');
    if (data.command.callsigns.higher) {
      lines.push(`           - Higher: ${data.command.callsigns.higher}`);
    }
    if (data.command.callsigns.thisUnit) {
      lines.push(`           - This Unit: ${data.command.callsigns.thisUnit}`);
    }
    if (data.command.callsigns.subordinates) {
      lines.push(`           - Subordinates: ${data.command.callsigns.subordinates}`);
    }

    lines.push('       (3) Signals:');
    if (data.command.signals.shiftFire) {
      lines.push(`           - Shift Fire: ${data.command.signals.shiftFire}`);
    }
    if (data.command.signals.ceaseFire) {
      lines.push(`           - Cease Fire: ${data.command.signals.ceaseFire}`);
    }
    if (data.command.signals.assault) {
      lines.push(`           - Assault: ${data.command.signals.assault}`);
    }
    if (data.command.signals.rally) {
      lines.push(`           - Rally Point: ${data.command.signals.rally}`);
    }

    if (data.command.pyrotechnics) {
      lines.push(`       (4) Pyrotechnics: ${data.command.pyrotechnics}`);
    }
    if (data.command.challengePassword) {
      lines.push(`       (5) Challenge/Password: ${data.command.challengePassword}`);
    }
    if (data.command.runningPassword) {
      lines.push(`       (6) Running Password: ${data.command.runningPassword}`);
    }
    if (data.command.numberCombo) {
      lines.push(`       (7) Number Combination: ${data.command.numberCombo}`);
    }

    lines.push('');
    lines.push('    "Are there any questions?"');
    lines.push('');

    if (data.command.timeHack) {
      lines.push(`    TIME HACK: ${data.command.timeHack}`);
    }

    lines.push('');
    lines.push('═'.repeat(60));
    lines.push('                    END OF ORDER');
    lines.push('═'.repeat(60));

    return lines.join('\n');
  },

  /**
   * Build mission statement from mission data
   * @param {Object} mission - Mission data
   * @returns {string} - Formatted mission statement
   */
  buildMissionStatement(mission) {
    const who = mission.who || '[WHO]';
    const what = mission.whatCustom || mission.what || '[WHAT]';
    const where = mission.where || '[WHERE]';
    const when = mission.when || '[WHEN]';
    const why = mission.why || '[WHY]';

    return `${who} ${what} ${where} ${when} IOT ${why}.`;
  },

  /**
   * Export order to text file
   * @param {Object} data - Order data
   * @param {string} filename - Filename (without extension)
   */
  exportToText(data, filename = 'order') {
    const orderText = this.generateOrderText(data);
    const blob = new Blob([orderText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Print the order
   * @param {Object} data - Order data
   */
  printOrder(data) {
    const orderText = this.generateOrderText(data);
    const orderContent = document.getElementById('order-content');
    if (orderContent) {
      orderContent.innerHTML = `<pre>${orderText}</pre>`;
    }
    window.print();
  }
};
