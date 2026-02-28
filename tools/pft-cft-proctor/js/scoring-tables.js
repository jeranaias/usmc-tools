/**
 * PFT/CFT Scoring Tables
 * Based on MCO 6100.13A w/CH-4 (March 23, 2022)
 */

const ScoringTables = {
  // Age brackets
  AGE_BRACKETS: ['17-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'],

  // Get age bracket from age
  getAgeBracket(age) {
    if (age <= 20) return '17-20';
    if (age <= 25) return '21-25';
    if (age <= 30) return '26-30';
    if (age <= 35) return '31-35';
    if (age <= 40) return '36-40';
    if (age <= 45) return '41-45';
    if (age <= 50) return '46-50';
    return '51+';
  },

  // Classification thresholds
  CLASSIFICATION: {
    FIRST_CLASS: 235,
    SECOND_CLASS: 200,
    THIRD_CLASS: 150,
    MIN_EVENT_SCORE: 40
  },

  // Pull-ups scoring (max 100 points)
  PULLUPS: {
    male: {
      '17-20': { maxReps: 23, minReps: 4, maxPts: 100, minPts: 40 },
      '21-25': { maxReps: 23, minReps: 5, maxPts: 100, minPts: 40 },
      '26-30': { maxReps: 23, minReps: 5, maxPts: 100, minPts: 40 },
      '31-35': { maxReps: 23, minReps: 5, maxPts: 100, minPts: 40 },
      '36-40': { maxReps: 23, minReps: 5, maxPts: 100, minPts: 40 },
      '41-45': { maxReps: 23, minReps: 5, maxPts: 100, minPts: 40 },
      '46-50': { maxReps: 23, minReps: 4, maxPts: 100, minPts: 40 },
      '51+':   { maxReps: 23, minReps: 3, maxPts: 100, minPts: 40 }
    },
    female: {
      '17-20': { maxReps: 12, minReps: 1, maxPts: 100, minPts: 40 },
      '21-25': { maxReps: 12, minReps: 1, maxPts: 100, minPts: 40 },
      '26-30': { maxReps: 12, minReps: 2, maxPts: 100, minPts: 40 },
      '31-35': { maxReps: 12, minReps: 2, maxPts: 100, minPts: 40 },
      '36-40': { maxReps: 12, minReps: 2, maxPts: 100, minPts: 40 },
      '41-45': { maxReps: 12, minReps: 1, maxPts: 100, minPts: 40 },
      '46-50': { maxReps: 12, minReps: 1, maxPts: 100, minPts: 40 },
      '51+':   { maxReps: 12, minReps: 1, maxPts: 100, minPts: 40 }
    }
  },

  // Push-ups scoring (max 70 points, 2 minutes)
  PUSHUPS: {
    male: {
      '17-20': { maxReps: 82, minReps: 42, maxPts: 70, minPts: 40 },
      '21-25': { maxReps: 87, minReps: 47, maxPts: 70, minPts: 40 },
      '26-30': { maxReps: 84, minReps: 44, maxPts: 70, minPts: 40 },
      '31-35': { maxReps: 80, minReps: 40, maxPts: 70, minPts: 40 },
      '36-40': { maxReps: 76, minReps: 36, maxPts: 70, minPts: 40 },
      '41-45': { maxReps: 72, minReps: 32, maxPts: 70, minPts: 40 },
      '46-50': { maxReps: 68, minReps: 28, maxPts: 70, minPts: 40 },
      '51+':   { maxReps: 64, minReps: 24, maxPts: 70, minPts: 40 }
    },
    female: {
      '17-20': { maxReps: 42, minReps: 19, maxPts: 70, minPts: 40 },
      '21-25': { maxReps: 48, minReps: 25, maxPts: 70, minPts: 40 },
      '26-30': { maxReps: 50, minReps: 27, maxPts: 70, minPts: 40 },
      '31-35': { maxReps: 46, minReps: 23, maxPts: 70, minPts: 40 },
      '36-40': { maxReps: 42, minReps: 19, maxPts: 70, minPts: 40 },
      '41-45': { maxReps: 38, minReps: 15, maxPts: 70, minPts: 40 },
      '46-50': { maxReps: 34, minReps: 11, maxPts: 70, minPts: 40 },
      '51+':   { maxReps: 30, minReps: 7,  maxPts: 70, minPts: 40 }
    }
  },

  // Plank scoring (same for all ages/genders)
  // Time in seconds, linear interpolation between thresholds
  PLANK: {
    thresholds: [
      { time: 225, points: 100 }, // 3:45
      { time: 210, points: 95 },  // 3:30
      { time: 195, points: 90 },  // 3:15
      { time: 180, points: 85 },  // 3:00
      { time: 165, points: 80 },  // 2:45
      { time: 150, points: 75 },  // 2:30
      { time: 135, points: 70 },  // 2:15
      { time: 120, points: 65 },  // 2:00
      { time: 105, points: 60 },  // 1:45
      { time: 90,  points: 55 },  // 1:30
      { time: 80,  points: 50 },  // 1:20
      { time: 75,  points: 45 },  // 1:15
      { time: 70,  points: 40 },  // 1:10
      { time: 0,   points: 0 }    // Below 1:10 = fail
    ]
  },

  // 3-Mile Run (times in seconds)
  RUN_3MILE: {
    male: {
      '17-20': { maxTime: 1080, minTime: 1660, maxPts: 100, minPts: 40 }, // 18:00 - 27:40
      '21-25': { maxTime: 1080, minTime: 1660, maxPts: 100, minPts: 40 }, // 18:00 - 27:40
      '26-30': { maxTime: 1080, minTime: 1680, maxPts: 100, minPts: 40 }, // 18:00 - 28:00
      '31-35': { maxTime: 1080, minTime: 1700, maxPts: 100, minPts: 40 }, // 18:00 - 28:20
      '36-40': { maxTime: 1080, minTime: 1720, maxPts: 100, minPts: 40 }, // 18:00 - 28:40
      '41-45': { maxTime: 1110, minTime: 1760, maxPts: 100, minPts: 40 }, // 18:30 - 29:20
      '46-50': { maxTime: 1140, minTime: 1800, maxPts: 100, minPts: 40 }, // 19:00 - 30:00
      '51+':   { maxTime: 1170, minTime: 1980, maxPts: 100, minPts: 40 }  // 19:30 - 33:00
    },
    female: {
      '17-20': { maxTime: 1260, minTime: 1850, maxPts: 100, minPts: 40 }, // 21:00 - 30:50
      '21-25': { maxTime: 1260, minTime: 1850, maxPts: 100, minPts: 40 }, // 21:00 - 30:50
      '26-30': { maxTime: 1290, minTime: 1880, maxPts: 100, minPts: 40 }, // 21:30 - 31:20
      '31-35': { maxTime: 1320, minTime: 1920, maxPts: 100, minPts: 40 }, // 22:00 - 32:00
      '36-40': { maxTime: 1350, minTime: 1950, maxPts: 100, minPts: 40 }, // 22:30 - 32:30
      '41-45': { maxTime: 1380, minTime: 1980, maxPts: 100, minPts: 40 }, // 23:00 - 33:00
      '46-50': { maxTime: 1410, minTime: 2040, maxPts: 100, minPts: 40 }, // 23:30 - 34:00
      '51+':   { maxTime: 1440, minTime: 2160, maxPts: 100, minPts: 40 }  // 24:00 - 36:00
    },
    // Altitude adjustment: +30 sec to max, +60 sec to min
    altitudeAdjustment: { maxTime: 30, minTime: 60 }
  },

  // 5k Row (available for 46+ or medical waiver)
  ROW_5K: {
    male: {
      '46-50': { maxTime: 1200, minTime: 1680, maxPts: 100, minPts: 40 }, // 20:00 - 28:00
      '51+':   { maxTime: 1260, minTime: 1800, maxPts: 100, minPts: 40 }  // 21:00 - 30:00
    },
    female: {
      '46-50': { maxTime: 1380, minTime: 1860, maxPts: 100, minPts: 40 }, // 23:00 - 31:00
      '51+':   { maxTime: 1440, minTime: 1980, maxPts: 100, minPts: 40 }  // 24:00 - 33:00
    }
  },

  // CFT - Movement to Contact (880 yards, times in seconds)
  MTC: {
    male: {
      '17-20': { maxTime: 158, minTime: 253, maxPts: 100, minPts: 40 }, // 2:38 - 4:13
      '21-25': { maxTime: 158, minTime: 253, maxPts: 100, minPts: 40 }, // 2:38 - 4:13
      '26-30': { maxTime: 159, minTime: 261, maxPts: 100, minPts: 40 }, // 2:39 - 4:21
      '31-35': { maxTime: 162, minTime: 273, maxPts: 100, minPts: 40 }, // 2:42 - 4:33
      '36-40': { maxTime: 168, minTime: 291, maxPts: 100, minPts: 40 }, // 2:48 - 4:51
      '41-45': { maxTime: 174, minTime: 303, maxPts: 100, minPts: 40 }, // 2:54 - 5:03
      '46-50': { maxTime: 180, minTime: 318, maxPts: 100, minPts: 40 }, // 3:00 - 5:18
      '51+':   { maxTime: 192, minTime: 341, maxPts: 100, minPts: 40 }  // 3:12 - 5:41
    },
    female: {
      '17-20': { maxTime: 188, minTime: 307, maxPts: 100, minPts: 40 }, // 3:08 - 5:07
      '21-25': { maxTime: 190, minTime: 311, maxPts: 100, minPts: 40 }, // 3:10 - 5:11
      '26-30': { maxTime: 195, minTime: 321, maxPts: 100, minPts: 40 }, // 3:15 - 5:21
      '31-35': { maxTime: 203, minTime: 337, maxPts: 100, minPts: 40 }, // 3:23 - 5:37
      '36-40': { maxTime: 212, minTime: 356, maxPts: 100, minPts: 40 }, // 3:32 - 5:56
      '41-45': { maxTime: 222, minTime: 374, maxPts: 100, minPts: 40 }, // 3:42 - 6:14
      '46-50': { maxTime: 230, minTime: 390, maxPts: 100, minPts: 40 }, // 3:50 - 6:30
      '51+':   { maxTime: 242, minTime: 413, maxPts: 100, minPts: 40 }  // 4:02 - 6:53
    }
  },

  // CFT - Ammunition Lift (30lb ammo can, 2 minutes)
  AMMO_LIFT: {
    male: {
      '17-20': { maxReps: 106, minReps: 45, maxPts: 100, minPts: 40 },
      '21-25': { maxReps: 106, minReps: 45, maxPts: 100, minPts: 40 },
      '26-30': { maxReps: 103, minReps: 45, maxPts: 100, minPts: 40 },
      '31-35': { maxReps: 99,  minReps: 41, maxPts: 100, minPts: 40 },
      '36-40': { maxReps: 93,  minReps: 38, maxPts: 100, minPts: 40 },
      '41-45': { maxReps: 88,  minReps: 34, maxPts: 100, minPts: 40 },
      '46-50': { maxReps: 80,  minReps: 30, maxPts: 100, minPts: 40 },
      '51+':   { maxReps: 72,  minReps: 25, maxPts: 100, minPts: 40 }
    },
    female: {
      '17-20': { maxReps: 66, minReps: 25, maxPts: 100, minPts: 40 },
      '21-25': { maxReps: 66, minReps: 25, maxPts: 100, minPts: 40 },
      '26-30': { maxReps: 65, minReps: 25, maxPts: 100, minPts: 40 },
      '31-35': { maxReps: 63, minReps: 23, maxPts: 100, minPts: 40 },
      '36-40': { maxReps: 60, minReps: 22, maxPts: 100, minPts: 40 },
      '41-45': { maxReps: 57, minReps: 19, maxPts: 100, minPts: 40 },
      '46-50': { maxReps: 52, minReps: 16, maxPts: 100, minPts: 40 },
      '51+':   { maxReps: 46, minReps: 12, maxPts: 100, minPts: 40 }
    }
  },

  // CFT - Maneuver Under Fire (300 yards, times in seconds)
  MANUF: {
    male: {
      '17-20': { maxTime: 134, minTime: 245, maxPts: 100, minPts: 40 }, // 2:14 - 4:05
      '21-25': { maxTime: 134, minTime: 245, maxPts: 100, minPts: 40 }, // 2:14 - 4:05
      '26-30': { maxTime: 136, minTime: 254, maxPts: 100, minPts: 40 }, // 2:16 - 4:14
      '31-35': { maxTime: 141, minTime: 269, maxPts: 100, minPts: 40 }, // 2:21 - 4:29
      '36-40': { maxTime: 148, minTime: 289, maxPts: 100, minPts: 40 }, // 2:28 - 4:49
      '41-45': { maxTime: 156, minTime: 303, maxPts: 100, minPts: 40 }, // 2:36 - 5:03
      '46-50': { maxTime: 164, minTime: 323, maxPts: 100, minPts: 40 }, // 2:44 - 5:23
      '51+':   { maxTime: 176, minTime: 350, maxPts: 100, minPts: 40 }  // 2:56 - 5:50
    },
    female: {
      '17-20': { maxTime: 181, minTime: 330, maxPts: 100, minPts: 40 }, // 3:01 - 5:30
      '21-25': { maxTime: 182, minTime: 333, maxPts: 100, minPts: 40 }, // 3:02 - 5:33
      '26-30': { maxTime: 188, minTime: 347, maxPts: 100, minPts: 40 }, // 3:08 - 5:47
      '31-35': { maxTime: 198, minTime: 369, maxPts: 100, minPts: 40 }, // 3:18 - 6:09
      '36-40': { maxTime: 210, minTime: 396, maxPts: 100, minPts: 40 }, // 3:30 - 6:36
      '41-45': { maxTime: 222, minTime: 420, maxPts: 100, minPts: 40 }, // 3:42 - 7:00
      '46-50': { maxTime: 235, minTime: 446, maxPts: 100, minPts: 40 }, // 3:55 - 7:26
      '51+':   { maxTime: 253, minTime: 480, maxPts: 100, minPts: 40 }  // 4:13 - 8:00
    }
  },

  // Height/Weight Standards
  WEIGHT_STANDARDS: {
    male: {
      58: { '17-20': 131, '21-27': 136, '28-39': 139, '40+': 141 },
      59: { '17-20': 136, '21-27': 141, '28-39': 144, '40+': 146 },
      60: { '17-20': 141, '21-27': 146, '28-39': 149, '40+': 151 },
      61: { '17-20': 146, '21-27': 151, '28-39': 154, '40+': 156 },
      62: { '17-20': 150, '21-27': 156, '28-39': 159, '40+': 161 },
      63: { '17-20': 155, '21-27': 161, '28-39': 164, '40+': 166 },
      64: { '17-20': 160, '21-27': 166, '28-39': 169, '40+': 172 },
      65: { '17-20': 165, '21-27': 171, '28-39': 175, '40+': 177 },
      66: { '17-20': 170, '21-27': 176, '28-39': 180, '40+': 183 },
      67: { '17-20': 175, '21-27': 181, '28-39': 185, '40+': 188 },
      68: { '17-20': 181, '21-27': 187, '28-39': 191, '40+': 194 },
      69: { '17-20': 186, '21-27': 193, '28-39': 197, '40+': 200 },
      70: { '17-20': 191, '21-27': 199, '28-39': 203, '40+': 206 },
      71: { '17-20': 197, '21-27': 205, '28-39': 209, '40+': 212 },
      72: { '17-20': 202, '21-27': 210, '28-39': 215, '40+': 218 },
      73: { '17-20': 208, '21-27': 216, '28-39': 221, '40+': 224 },
      74: { '17-20': 214, '21-27': 222, '28-39': 227, '40+': 230 },
      75: { '17-20': 220, '21-27': 228, '28-39': 233, '40+': 237 },
      76: { '17-20': 226, '21-27': 235, '28-39': 240, '40+': 243 },
      77: { '17-20': 232, '21-27': 241, '28-39': 246, '40+': 250 },
      78: { '17-20': 238, '21-27': 247, '28-39': 253, '40+': 256 },
      79: { '17-20': 244, '21-27': 254, '28-39': 259, '40+': 263 },
      80: { '17-20': 250, '21-27': 260, '28-39': 266, '40+': 270 }
    },
    female: {
      58: { '17-20': 120, '21-27': 124, '28-39': 126, '40+': 127 },
      59: { '17-20': 124, '21-27': 128, '28-39': 130, '40+': 131 },
      60: { '17-20': 128, '21-27': 132, '28-39': 134, '40+': 135 },
      61: { '17-20': 132, '21-27': 136, '28-39': 139, '40+': 140 },
      62: { '17-20': 136, '21-27': 141, '28-39': 143, '40+': 145 },
      63: { '17-20': 141, '21-27': 145, '28-39': 148, '40+': 149 },
      64: { '17-20': 145, '21-27': 150, '28-39': 152, '40+': 154 },
      65: { '17-20': 150, '21-27': 155, '28-39': 157, '40+': 159 },
      66: { '17-20': 155, '21-27': 160, '28-39': 163, '40+': 164 },
      67: { '17-20': 159, '21-27': 165, '28-39': 168, '40+': 169 },
      68: { '17-20': 164, '21-27': 170, '28-39': 173, '40+': 174 },
      69: { '17-20': 169, '21-27': 175, '28-39': 178, '40+': 180 },
      70: { '17-20': 174, '21-27': 180, '28-39': 183, '40+': 185 },
      71: { '17-20': 179, '21-27': 185, '28-39': 189, '40+': 191 },
      72: { '17-20': 184, '21-27': 191, '28-39': 194, '40+': 196 },
      73: { '17-20': 189, '21-27': 196, '28-39': 200, '40+': 202 },
      74: { '17-20': 194, '21-27': 202, '28-39': 205, '40+': 208 },
      75: { '17-20': 200, '21-27': 207, '28-39': 211, '40+': 214 },
      76: { '17-20': 205, '21-27': 213, '28-39': 217, '40+': 219 },
      77: { '17-20': 210, '21-27': 219, '28-39': 223, '40+': 225 },
      78: { '17-20': 216, '21-27': 225, '28-39': 229, '40+': 232 },
      79: { '17-20': 221, '21-27': 230, '28-39': 235, '40+': 238 },
      80: { '17-20': 227, '21-27': 236, '28-39': 241, '40+': 244 }
    }
  },

  // Body fat limits
  BODY_FAT_LIMITS: {
    male: 18,
    female: 26
  },

  // Get weight age bracket
  getWeightAgeBracket(age) {
    if (age <= 20) return '17-20';
    if (age <= 27) return '21-27';
    if (age <= 39) return '28-39';
    return '40+';
  },

  // Rank options for proctor mode
  RANKS: [
    'Pvt', 'PFC', 'LCpl', 'Cpl', 'Sgt', 'SSgt', 'GySgt', 'MSgt', 'MGySgt',
    '1stSgt', 'SgtMaj', '2ndLt', '1stLt', 'Capt', 'Maj', 'LtCol', 'Col',
    'BGen', 'MajGen', 'LtGen', 'Gen'
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoringTables;
}
