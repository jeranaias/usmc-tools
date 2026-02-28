/**
 * Example Order Data
 * A realistic squad attack order for demonstration
 */

const ExampleData = {
  orientation: {
    presentLocation: '18TVM8534',
    directionAzimuth: '045',
    directionDistance: '800',
    objectiveLocation: '18TVM8642',
    kocoa: {
      keyTerrain: 'Hill 142 to the northeast provides overwatch of the objective. The treeline at grid 8538 offers covered approach.',
      observation: 'Open fields to the east provide good fields of fire. Limited visibility in the woodline to the west.',
      cover: 'Stone walls along the road provide cover. Woodline offers concealment for approach.',
      obstacles: 'Wire obstacle at the objective perimeter. Creek crossing at grid 8540 - fordable.',
      avenues: 'Primary: Along treeline from southwest. Alternate: Road approach from south (more exposed).'
    },
    weather: 'Clear skies, temp 45F, winds NW 5-10 knots. First light 0615, BMNT 0545. Good visibility.'
  },
  situation: {
    salute: {
      size: 'Squad-sized element, 8-10 personnel',
      activity: 'Defending fortified position, conducting local security patrols',
      location: 'Building complex at grid 18TVM8642',
      unit: 'Unknown militia, woodland camouflage uniforms',
      time: '0430 local (this morning)',
      equipment: 'Small arms (AK-pattern rifles), 1x PKM machine gun, no observed armor or vehicles'
    },
    drawd: {
      defend: 'Likely to defend in place. Prepared positions with overhead cover observed.',
      reinforce: 'Possible reinforcement from village 2km north within 30 minutes of contact.',
      attack: 'Limited offensive capability. May conduct spoiling attack if our approach detected.',
      withdraw: 'Likely withdrawal route to the north along MSR.',
      delay: 'May delay with PKM covering withdrawal if overwhelmed.'
    },
    emlcoa: 'Enemy defends in place, engaging our assault element with PKM while riflemen provide supporting fire from prepared positions.',
    emdcoa: 'Enemy detects our approach, reinforces position, and establishes ambush along our primary avenue of approach.',
    friendly: {
      higherMission: '2nd Platoon attacks to clear enemy positions in zone NLT 0700 to enable company advance.',
      higherIntent: 'Purpose: Eliminate enemy presence blocking MSR. Method: Deliberate clearance with supporting fires. End State: Enemy destroyed or displaced, MSR open for traffic.',
      adjacentNorth: '2nd Squad establishes support-by-fire position at grid 8644',
      adjacentSouth: '3rd Squad in reserve at ORP, prepared to exploit success',
      adjacentEast: 'None',
      adjacentWest: 'None',
      supportingUnits: '60mm mortars on call, 2 rounds HE per tube. Platoon MG section attached to 2nd Squad.'
    },
    attachments: '1x Combat Engineer attached for obstacle breach. 1x Corpsman.'
  },
  mission: {
    who: '1st Squad',
    what: 'attacks to seize',
    whatCustom: '',
    where: 'Building 1 at grid 18TVM8642',
    when: 'NLT 0630',
    why: 'destroy enemy forces and establish foothold for platoon assault on the objective complex'
  },
  execution: {
    intent: {
      purpose: 'Eliminate enemy defensive position blocking our advance along MSR.',
      method: 'Rapid assault following suppression, close with and destroy enemy in building.',
      endstateFriendly: '1st Squad consolidated on objective, prepared to support follow-on assault.',
      endstateEnemy: 'Enemy in Building 1 destroyed or captured.',
      endstateTerrain: 'Building 1 cleared and secured, enabling platoon maneuver.'
    },
    concept: {
      schemeManeuver: 'From ORP, squad moves in wedge formation along covered route through treeline. At LD, shift to traveling overwatch. At PLD, 2nd FT establishes SBF while 1st and 3rd FT assault. Assault element breaches entry point, clears building room by room.',
      fireSupport: '60mm mortars fire smoke screen on signal to obscure enemy observation. 2nd Squad MGs suppress enemy positions on order. Lift/shift fires on green star cluster.'
    },
    tasks: {
      team1: '1st Fire Team leads assault element. Breaches point of entry on the southeast corner. Clears rooms 1-3. Be prepared to assume SBF if 2nd FT becomes combat ineffective.',
      team2: '2nd Fire Team establishes support-by-fire position at grid 8640. Suppresses enemy in objective on order. Shifts fire on green star cluster. Joins assault on red star cluster.',
      team3: '3rd Fire Team follows 1st FT in assault. Clears rooms 4-6. Secures EPWs. Establishes security on north side of building post-assault.',
      attachments: 'Combat Engineer attached to 1st FT for breach. Corpsman with assault element.'
    },
    coordinating: {
      timeline: 'SP from ORP: 0545. Cross LD: 0600. PLD: 0615. H-Hour (assault): 0625.',
      priorityFires: '2nd Fire Team, then 1st Fire Team, then 3rd Fire Team.',
      roe: 'Hostile act/hostile intent. PID required. Minimize collateral damage.',
      mopp: 'MOPP 0',
      contact: 'Break contact, move to rally point, report. If within 100m of objective, assault through.',
      objective: 'Clear building systematically. Mark cleared rooms. Consolidate on north side.',
      consolidation: 'ACE report within 5 minutes. Establish 360 security. Prepare for counterattack.',
      formation: 'Wedge to PLD, then assault column',
      technique: 'Traveling Overwatch',
      departure: 'Passage point at grid 8534. Challenge: Thunder. Password: Lightning. Report departure and return.'
    }
  },
  admin: {
    administration: {
      epw: 'Search, silence, segregate, speed to collection point. 3rd FT responsible for EPW handling.',
      captured: 'Mark in place, do not touch. Report to squad leader for exploitation.'
    },
    logistics: {
      ammo: '210 rounds 5.56 per rifleman. 600 rounds per SAW. 2x grenades per Marine. Resupply at ORP after consolidation.',
      rations: '1x MRE. Consume prior to SP.',
      water: '2 quarts per Marine. Resupply at ORP.',
      equipment: 'Breaching kit with 1st FT. Flex cuffs with 3rd FT. IR chemlights for marking.',
      resupply: '18TVM8534 (ORP)'
    },
    casevac: {
      collection: '18TVM8538',
      route: 'South along treeline to collection point. Mark with VS-17 panel.',
      medical: 'Corpsman with assault element. CCP at grid 8538. Medevac on standby at FOB.'
    }
  },
  command: {
    command: {
      location: 'With 1st Fire Team during assault',
      succession: '1. Squad Leader, 2. 1st Fire Team Leader, 3. 2nd Fire Team Leader, 4. 3rd Fire Team Leader',
      cp: '18TVM8534'
    },
    frequencies: {
      primary: 'Squad: 42.50',
      alternate: 'Platoon: 43.75',
      contingency: 'Company: 38.25',
      emergency: 'Battalion TAC: 51.00'
    },
    callsigns: {
      higher: 'Warrior 6 (Platoon Commander)',
      thisUnit: 'Warrior 1',
      subordinates: '1st FT: Warrior 1-1, 2nd FT: Warrior 1-2, 3rd FT: Warrior 1-3'
    },
    signals: {
      shiftFire: 'Green star cluster',
      ceaseFire: 'Cease fire, cease fire, cease fire (verbal)',
      assault: 'Red star cluster',
      rally: 'ORP at grid 8534'
    },
    pyrotechnics: 'Green star cluster: Shift/lift fire. Red star cluster: Assault/commit reserve. Red smoke: Casualty, mark CCP.',
    challengePassword: 'Thunder / Lightning',
    runningPassword: 'Oorah',
    numberCombo: 'Any two numbers equaling 7',
    timeHack: '0530'
  }
};

/**
 * Load example data into the order
 */
function loadExampleOrder() {
  if (typeof App !== 'undefined' && App.orderData) {
    // Deep copy example data
    App.orderData = JSON.parse(JSON.stringify(ExampleData));
    Storage.saveCurrent(App.orderData);
    App.populateAllFields();
    App.updateLivePreview();
    App.showToast('Example order loaded');
  }
}
