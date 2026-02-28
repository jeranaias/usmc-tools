/**
 * Package Registry
 * Central registry of all available package types
 */
const PackageRegistry = {
  // Available package types
  types: {
    warrant_officer: WarrantOfficerPackage,
    recruiting: RecruitingPackage
  },

  // Coming soon packages (display only)
  comingSoon: [
    {
      id: 'drill_instructor',
      name: 'Drill Instructor',
      shortName: 'DI',
      icon: '&#127913;', // tophat
      description: 'Coming Soon',
      reference: 'MCO 1326.6'
    },
    {
      id: 'msg',
      name: 'Marine Security Guard',
      shortName: 'MSG',
      icon: '&#128737;', // shield
      description: 'Coming Soon',
      reference: 'MCO 5510.18A'
    },
    {
      id: 'mecep',
      name: 'MECEP',
      shortName: 'MECEP',
      icon: '&#127891;', // graduation cap
      description: 'Coming Soon',
      reference: 'MCO 1560.15M'
    }
  ],

  // Get package template by ID
  getTemplate(packageTypeId) {
    return this.types[packageTypeId] || null;
  },

  // Get all available package types
  getAvailableTypes() {
    return Object.values(this.types);
  },

  // Get all coming soon types
  getComingSoonTypes() {
    return this.comingSoon;
  },

  // Create a new package of given type
  createPackage(packageTypeId, applicantInfo = {}) {
    const template = this.getTemplate(packageTypeId);
    if (!template) {
      throw new Error(`Unknown package type: ${packageTypeId}`);
    }
    return template.createPackage(applicantInfo);
  },

  // Calculate progress for a package
  calculateProgress(pkg) {
    if (!pkg || !pkg.documents) {
      return { percentage: 0, complete: 0, required: 0, missing: [], waiverNeeded: [] };
    }

    const required = pkg.documents.filter(d => d.required);
    const complete = required.filter(d =>
      d.status === 'complete' || d.status === 'na'
    );
    const missing = required.filter(d => d.status === 'incomplete');
    const waiverNeeded = pkg.documents.filter(d => d.status === 'waiver_needed');

    return {
      percentage: required.length > 0 ? Math.round((complete.length / required.length) * 100) : 0,
      complete: complete.length,
      required: required.length,
      missing: missing,
      waiverNeeded: waiverNeeded
    };
  },

  // Get routing progress
  getRoutingProgress(pkg) {
    if (!pkg || !pkg.routing) {
      return { signed: 0, total: 0, pending: [] };
    }

    const signed = pkg.routing.filter(r => r.status === 'signed').length;
    const pending = pkg.routing.filter(r => r.status !== 'signed');

    return {
      signed: signed,
      total: pkg.routing.length,
      pending: pending
    };
  }
};
