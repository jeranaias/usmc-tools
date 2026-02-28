/**
 * Award Write-Up Generator - Awards Configuration
 * Contains award types, limits, openings, and approval authorities
 */

const Awards = {
  // Award type configurations
  types: {
    NAM: {
      name: 'Navy and Marine Corps Achievement Medal',
      abbreviation: 'NAM',
      approvalAuthority: 'O-6 and above',
      maxLines: 8,
      maxChars: 650,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `FOR PROFESSIONAL ACHIEVEMENT IN THE SUPERIOR PERFORMANCE OF ${gender === 'M' ? 'HIS' : 'HER'} DUTIES WHILE SERVING AS ${billet} FOR ${unit} FROM ${startDate} TO ${endDate}.`
    },
    NCM: {
      name: 'Navy and Marine Corps Commendation Medal',
      abbreviation: 'NCM',
      approvalAuthority: 'O-6 and above',
      maxLines: 8,
      maxChars: 650,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `FOR MERITORIOUS SERVICE WHILE SERVING AS ${billet} FOR ${unit} FROM ${startDate} TO ${endDate}.`
    },
    MSM: {
      name: 'Meritorious Service Medal',
      abbreviation: 'MSM',
      approvalAuthority: 'Flag/General Officer',
      maxLines: 23,
      maxChars: 1850,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `FOR OUTSTANDING MERITORIOUS SERVICE WHILE SERVING AS ${billet} FOR ${unit} FROM ${startDate} TO ${endDate}.`
    },
    BSM: {
      name: 'Bronze Star Medal',
      abbreviation: 'BSM',
      approvalAuthority: 'General Officer',
      maxLines: 23,
      maxChars: 1850,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `FOR MERITORIOUS SERVICE IN CONNECTION WITH COMBAT OPERATIONS WHILE SERVING AS ${billet} FOR ${unit} FROM ${startDate} TO ${endDate}.`
    },
    LOM: {
      name: 'Legion of Merit',
      abbreviation: 'LOM',
      approvalAuthority: 'SECNAV',
      maxLines: 23,
      maxChars: 1850,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `FOR EXCEPTIONALLY MERITORIOUS CONDUCT IN THE PERFORMANCE OF OUTSTANDING SERVICES WHILE SERVING AS ${billet} FOR ${unit} FROM ${startDate} TO ${endDate}.`
    },
    LoA: {
      name: 'Letter of Appreciation',
      abbreviation: 'LoA',
      approvalAuthority: 'Any Officer/SNCO',
      maxLines: null,
      maxChars: null,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `For ${gender === 'M' ? 'his' : 'her'} exceptional performance of duty while serving as ${billet} for ${unit} from ${startDate} to ${endDate}.`
    },
    LoC: {
      name: 'Letter of Commendation',
      abbreviation: 'LoC',
      approvalAuthority: 'Commanding Officer',
      maxLines: null,
      maxChars: null,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `For superior performance of duty while serving as ${billet} for ${unit} from ${startDate} to ${endDate}.`
    },
    CoC: {
      name: 'Certificate of Commendation',
      abbreviation: 'CoC',
      approvalAuthority: 'Unit Commander',
      maxLines: null,
      maxChars: null,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `For meritorious service while serving as ${billet} for ${unit} from ${startDate} to ${endDate}.`
    },
    MM: {
      name: 'Meritorious Mast',
      abbreviation: 'MM',
      approvalAuthority: 'Commanding Officer',
      maxLines: null,
      maxChars: null,
      charsPerLine: 80,
      opening: (gender, billet, unit, startDate, endDate) =>
        `For outstanding performance of duty while serving as ${billet} for ${unit} from ${startDate} to ${endDate}.`
    }
  },

  // Get award configuration by type
  getConfig(awardType) {
    return this.types[awardType] || this.types.NAM;
  },

  // Get approval authority
  getApprovalAuthority(awardType) {
    const config = this.getConfig(awardType);
    return config.approvalAuthority;
  },

  // Get character/line limits
  getLimits(awardType) {
    const config = this.getConfig(awardType);
    return {
      maxLines: config.maxLines,
      maxChars: config.maxChars,
      charsPerLine: config.charsPerLine
    };
  },

  // Generate opening sentence
  generateOpening(awardType, gender, billet, unit, startDate, endDate) {
    const config = this.getConfig(awardType);
    return config.opening(gender, billet.toUpperCase(), unit.toUpperCase(), startDate, endDate);
  },

  // Check if award requires formal citation format (all caps, strict limits)
  isFormalCitation(awardType) {
    return ['NAM', 'NCM', 'MSM', 'BSM', 'LOM'].includes(awardType);
  },

  // Get limits description for display
  getLimitsDescription(awardType) {
    const limits = this.getLimits(awardType);
    if (!limits.maxLines && !limits.maxChars) {
      return 'No strict character limits';
    }
    return `Max ${limits.maxLines} lines | ~${limits.maxChars} characters | All Caps`;
  }
};
