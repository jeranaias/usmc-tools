/**
 * Statement Templates for Common Counseling Scenarios
 */

const Templates = {
  // Template definitions
  templates: {
    promotion: {
      name: 'Promotion Statement',
      description: 'Standard format for promotion recommendation counselings',
      proficiency: `[Marine] demonstrates [level] performance in all assigned duties. [He/She] displays [technical proficiency description] and [leadership qualities]. [Specific achievement or example]. [PFT/CFT performance if notable].`,
      conduct: `[Marine] maintains [level] conduct and military bearing. [He/She] [conduct description] and serves as a [positive/negative] influence on [peers/subordinates]. [Specific example of conduct if applicable].`
    },
    semiannual: {
      name: 'Semi-Annual Counseling',
      description: 'Standard format for regular semi-annual performance reviews',
      proficiency: `During the marking period, [Marine] demonstrated [level] performance in assigned duties. [He/She] [specific performance observations]. [Areas of strength]. [Areas for continued development if applicable].`,
      conduct: `[Marine]'s conduct during this period was [level]. [He/She] [conduct observations]. [Positive behaviors or areas requiring attention].`
    },
    adverse: {
      name: 'Adverse Counseling',
      description: 'Format for documenting performance or conduct deficiencies',
      proficiency: `[Marine] has displayed [specific deficiency] requiring formal counseling. [Description of pattern or incident]. This has impacted [unit readiness/mission accomplishment/etc.]. [Marine] is directed to [specific corrective actions]. Failure to improve may result in [consequences].`,
      conduct: `[Marine]'s conduct has been [below standard/unsatisfactory]. [Specific incident or pattern description]. This behavior is [contrary to regulations/detrimental to unit]. [Marine] must [corrective action required]. Continued deficiencies will result in [administrative/disciplinary action].`
    }
  },

  /**
   * Get a template by ID
   * @param {string} templateId - Template identifier
   * @returns {Object|null} Template object or null
   */
  getTemplate(templateId) {
    return this.templates[templateId] || null;
  },

  /**
   * Get all template options for display
   * @returns {Array} Array of template info objects
   */
  getTemplateOptions() {
    return Object.entries(this.templates).map(([id, template]) => ({
      id,
      name: template.name,
      description: template.description
    }));
  },

  /**
   * Apply template to current form
   * @param {string} templateId - Template identifier
   * @returns {Object} Object with proficiency and conduct text
   */
  applyTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { proficiency: '', conduct: '' };
    }
    return {
      proficiency: template.proficiency,
      conduct: template.conduct
    };
  },

  /**
   * Get suggested marks for a template type
   * @param {string} templateId - Template identifier
   * @returns {Object} Suggested pro/con marks
   */
  getSuggestedMarks(templateId) {
    switch (templateId) {
      case 'promotion':
        return { pro: '4.3', con: '4.4' };
      case 'semiannual':
        return { pro: '4.0', con: '4.0' };
      case 'adverse':
        return { pro: '2.5', con: '2.5' };
      default:
        return { pro: '4.0', con: '4.0' };
    }
  }
};

// Make available globally
window.Templates = Templates;
