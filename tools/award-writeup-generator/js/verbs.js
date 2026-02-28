/**
 * Award Write-Up Generator - Action Verb Banks
 * Categorized action verbs for award narratives
 */

const ActionVerbs = {
  categories: {
    Leadership: {
      description: 'For supervisory and command achievements',
      verbs: [
        'Directed', 'Led', 'Commanded', 'Supervised', 'Managed',
        'Coordinated', 'Organized', 'Orchestrated', 'Spearheaded',
        'Championed', 'Guided', 'Mentored', 'Developed', 'Trained',
        'Motivated', 'Inspired', 'Influenced', 'Delegated', 'Empowered',
        'Cultivated', 'Fostered', 'Instilled'
      ]
    },
    Achievement: {
      description: 'For accomplishment-focused narratives',
      verbs: [
        'Achieved', 'Accomplished', 'Attained', 'Completed', 'Delivered',
        'Exceeded', 'Produced', 'Generated', 'Created', 'Established',
        'Implemented', 'Executed', 'Realized', 'Secured', 'Won',
        'Earned', 'Obtained', 'Fulfilled', 'Surpassed', 'Mastered'
      ]
    },
    Technical: {
      description: 'For technical and operational achievements',
      verbs: [
        'Analyzed', 'Assessed', 'Evaluated', 'Identified', 'Diagnosed',
        'Resolved', 'Repaired', 'Maintained', 'Operated', 'Processed',
        'Streamlined', 'Optimized', 'Enhanced', 'Improved', 'Upgraded',
        'Engineered', 'Configured', 'Troubleshot', 'Calibrated', 'Integrated'
      ]
    },
    Administrative: {
      description: 'For admin and support achievements',
      verbs: [
        'Administered', 'Processed', 'Tracked', 'Monitored', 'Documented',
        'Prepared', 'Compiled', 'Reviewed', 'Audited', 'Verified',
        'Certified', 'Authorized', 'Approved', 'Validated', 'Reconciled',
        'Catalogued', 'Inventoried', 'Scheduled', 'Expedited', 'Facilitated'
      ]
    },
    Combat: {
      description: 'For combat and tactical achievements',
      verbs: [
        'Neutralized', 'Secured', 'Defended', 'Protected', 'Engaged',
        'Suppressed', 'Flanked', 'Maneuvered', 'Extracted', 'Evacuated',
        'Reconnoitered', 'Patrolled', 'Assaulted', 'Breached', 'Cleared',
        'Reinforced', 'Fortified', 'Seized', 'Held', 'Countered'
      ]
    },
    Support: {
      description: 'For support and enabling achievements',
      verbs: [
        'Supported', 'Facilitated', 'Enabled', 'Assisted', 'Provided',
        'Ensured', 'Maintained', 'Sustained', 'Reinforced', 'Bolstered',
        'Strengthened', 'Augmented', 'Supplemented', 'Contributed', 'Aided'
      ]
    },
    Innovation: {
      description: 'For creative problem-solving achievements',
      verbs: [
        'Pioneered', 'Innovated', 'Revolutionized', 'Transformed',
        'Redesigned', 'Conceptualized', 'Devised', 'Formulated',
        'Initiated', 'Launched', 'Introduced', 'Modernized', 'Revamped'
      ]
    },
    Training: {
      description: 'For training and education achievements',
      verbs: [
        'Trained', 'Instructed', 'Educated', 'Taught', 'Coached',
        'Certified', 'Qualified', 'Prepared', 'Developed', 'Groomed',
        'Drilled', 'Exercised', 'Evaluated', 'Assessed', 'Tested'
      ]
    }
  },

  // Get all categories
  getAllCategories() {
    return Object.keys(this.categories);
  },

  // Get verbs by category
  getVerbsByCategory(category) {
    return this.categories[category]?.verbs || [];
  },

  // Get category description
  getCategoryDescription(category) {
    return this.categories[category]?.description || '';
  },

  // Get all verbs as flat array
  getAllVerbs() {
    const allVerbs = [];
    Object.values(this.categories).forEach(cat => {
      allVerbs.push(...cat.verbs);
    });
    return [...new Set(allVerbs)].sort();
  },

  // Search verbs
  searchVerbs(query) {
    const normalizedQuery = query.toLowerCase();
    const results = [];

    Object.entries(this.categories).forEach(([category, data]) => {
      const matches = data.verbs.filter(verb =>
        verb.toLowerCase().includes(normalizedQuery)
      );
      if (matches.length > 0) {
        results.push({ category, verbs: matches });
      }
    });

    return results;
  }
};
