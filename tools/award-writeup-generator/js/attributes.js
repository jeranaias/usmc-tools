/**
 * Award Write-Up Generator - Closing Attributes
 * Personal qualities and action-based attributes for closing sentences
 */

const Attributes = {
  // Personal quality attributes
  personalQualities: [
    'exceptional professionalism',
    'outstanding dedication to duty',
    'superior technical expertise',
    'tireless devotion',
    'unwavering commitment',
    'remarkable initiative',
    'extraordinary leadership',
    'selfless service',
    'meticulous attention to detail',
    'exemplary performance',
    'consummate professionalism',
    'unparalleled dedication',
    'sterling character',
    'resolute determination',
    'unflagging enthusiasm'
  ],

  // Action-based attributes
  actionBased: [
    'managerial ability',
    'personal initiative',
    'unswerving dedication to duty',
    'superb organizational skills',
    'keen analytical abilities',
    'sound judgment',
    'technical acumen',
    'tactical proficiency',
    'operational excellence',
    'leadership ability',
    'professional competence',
    'diligent efforts',
    'perseverance',
    'resourcefulness',
    'innovative thinking'
  ],

  // Get all attributes
  getAll() {
    return [...this.personalQualities, ...this.actionBased];
  },

  // Get by category
  getByCategory(category) {
    if (category === 'personal') {
      return this.personalQualities;
    } else if (category === 'action') {
      return this.actionBased;
    }
    return this.getAll();
  },

  // Generate closing sentence with selected attributes
  generateClosing(rank, name, gender, selectedAttributes, style = 'attributesFirst') {
    const pronoun = gender === 'M' ? 'HIM' : 'HER';
    const possessive = gender === 'M' ? 'HIS' : 'HER';

    // Ensure we have exactly 3 attributes
    const attrs = selectedAttributes.slice(0, 3);
    if (attrs.length < 3) {
      return 'Please select 3 attributes for the closing sentence.';
    }

    // Format attributes with proper capitalization
    const formattedAttrs = attrs.map(a => a.toUpperCase());

    // Format name
    const fullName = `${rank.toUpperCase()} ${name.toUpperCase()}`;

    if (style === 'nameFirst') {
      return `${fullName}'S ${formattedAttrs[0]}, ${formattedAttrs[1]}, AND ${formattedAttrs[2]} REFLECTED CREDIT UPON ${pronoun}SELF AND WERE IN KEEPING WITH THE HIGHEST TRADITIONS OF THE UNITED STATES NAVAL SERVICE.`;
    } else {
      return `BY ${possessive} ${formattedAttrs[0]}, ${formattedAttrs[1]}, AND ${formattedAttrs[2]}, ${fullName} REFLECTED CREDIT UPON ${pronoun}SELF AND UPHELD THE HIGHEST TRADITIONS OF THE UNITED STATES NAVAL SERVICE.`;
    }
  },

  // Validate attribute selection
  validateSelection(selectedAttributes) {
    return {
      valid: selectedAttributes.length === 3,
      count: selectedAttributes.length,
      message: selectedAttributes.length === 3
        ? 'Valid selection'
        : `Select ${3 - selectedAttributes.length} more attribute(s)`
    };
  }
};
