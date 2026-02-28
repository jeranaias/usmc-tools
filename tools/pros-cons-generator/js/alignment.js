/**
 * Mark/Language Alignment Checker
 * Ensures statement language matches the assigned mark
 */

const Alignment = {
  // Words/phrases indicating positive performance
  positiveWords: [
    'outstanding', 'exceptional', 'superior', 'excellent', 'exemplary',
    'exceeds', 'expert', 'flawless', 'impeccable', 'highest',
    'best', 'top', 'above average', 'well above', 'strong',
    'role model', 'mentor', 'leader', 'initiative', 'proactive'
  ],

  // Words/phrases indicating negative performance
  negativeWords: [
    'fails', 'failing', 'lacking', 'deficient', 'poor', 'inadequate',
    'requires improvement', 'below average', 'below standard', 'unsatisfactory',
    'inconsistent', 'unable', 'does not', 'has not', 'struggles',
    'deficiencies', 'issues', 'problems', 'counseling', 'njp',
    'disciplinary', 'negative influence', 'detrimental', 'constant supervision'
  ],

  // Words indicating average performance
  averageWords: [
    'satisfactory', 'adequate', 'acceptable', 'meets minimum',
    'meets standards', 'generally', 'occasional', 'basic'
  ],

  /**
   * Check if statement language aligns with mark
   * @param {string} statement - The statement text
   * @param {number} mark - The assigned mark (0.0-5.0)
   * @param {string} type - 'proficiency' or 'conduct'
   * @returns {Object} Alignment result with status and message
   */
  checkAlignment(statement, mark, type = 'proficiency') {
    if (!statement || statement.trim().length < 10) {
      return { status: 'neutral', message: '' };
    }

    const lowerStatement = statement.toLowerCase();
    const markFloat = parseFloat(mark);

    // Count positive and negative indicators
    const positiveCount = this.positiveWords.filter(word =>
      lowerStatement.includes(word.toLowerCase())
    ).length;

    const negativeCount = this.negativeWords.filter(word =>
      lowerStatement.includes(word.toLowerCase())
    ).length;

    const averageCount = this.averageWords.filter(word =>
      lowerStatement.includes(word.toLowerCase())
    ).length;

    // Determine statement tone
    let tone = 'neutral';
    if (positiveCount > negativeCount && positiveCount > averageCount) {
      tone = 'positive';
    } else if (negativeCount > positiveCount) {
      tone = 'negative';
    } else if (averageCount > 0) {
      tone = 'average';
    }

    // Check alignment based on mark level
    if (markFloat >= 4.5) {
      // High marks should have positive language
      if (negativeCount > 0) {
        return {
          status: 'warning',
          message: `Statement contains negative language ("${this.findMatchingWord(lowerStatement, this.negativeWords)}") but mark is ${mark}. Consider adjusting the language or mark.`,
          type: 'mismatch'
        };
      }
      if (tone === 'positive') {
        return {
          status: 'good',
          message: 'Mark and language align well.',
          type: 'aligned'
        };
      }
    } else if (markFloat >= 4.0) {
      // Above average - should be mostly positive
      if (negativeCount > positiveCount) {
        return {
          status: 'warning',
          message: `Statement leans negative but mark is above average (${mark}). Consider adjusting.`,
          type: 'mismatch'
        };
      }
      return {
        status: 'good',
        message: 'Mark and language align.',
        type: 'aligned'
      };
    } else if (markFloat >= 3.0) {
      // Average marks
      if (positiveCount > 2 && negativeCount === 0) {
        return {
          status: 'warning',
          message: `Statement is very positive but mark is average (${mark}). Consider a higher mark or adjust language.`,
          type: 'mismatch'
        };
      }
      return {
        status: 'good',
        message: 'Mark and language align.',
        type: 'aligned'
      };
    } else {
      // Below average marks - should have negative language
      if (positiveCount > negativeCount && positiveCount > 0) {
        return {
          status: 'warning',
          message: `Statement is positive but mark is below average (${mark}). Consider adjusting the mark or language.`,
          type: 'mismatch'
        };
      }
      if (negativeCount > 0) {
        return {
          status: 'good',
          message: 'Mark and language align.',
          type: 'aligned'
        };
      }
    }

    return {
      status: 'neutral',
      message: 'Add more detail to the statement for better alignment feedback.',
      type: 'insufficient'
    };
  },

  /**
   * Find first matching word in statement
   * @param {string} statement - Statement text (lowercase)
   * @param {Array} wordList - List of words to check
   * @returns {string} First matching word found
   */
  findMatchingWord(statement, wordList) {
    for (const word of wordList) {
      if (statement.includes(word.toLowerCase())) {
        return word;
      }
    }
    return '';
  },

  /**
   * Get mark recommendation based on statement language
   * @param {string} statement - The statement text
   * @returns {Object} Recommended mark range
   */
  getMarkRecommendation(statement) {
    if (!statement || statement.trim().length < 10) {
      return { min: 3.0, max: 5.0, suggested: 4.0 };
    }

    const lowerStatement = statement.toLowerCase();

    const positiveCount = this.positiveWords.filter(word =>
      lowerStatement.includes(word.toLowerCase())
    ).length;

    const negativeCount = this.negativeWords.filter(word =>
      lowerStatement.includes(word.toLowerCase())
    ).length;

    // Strong positive language
    if (positiveCount >= 3 && negativeCount === 0) {
      return { min: 4.5, max: 5.0, suggested: 4.7 };
    }

    // Moderate positive language
    if (positiveCount >= 1 && negativeCount === 0) {
      return { min: 4.0, max: 4.6, suggested: 4.3 };
    }

    // Mixed or average language
    if (positiveCount > 0 && negativeCount > 0) {
      return { min: 3.0, max: 4.0, suggested: 3.5 };
    }

    // Negative language
    if (negativeCount >= 2) {
      return { min: 1.0, max: 2.5, suggested: 2.0 };
    }

    if (negativeCount === 1) {
      return { min: 2.0, max: 3.0, suggested: 2.5 };
    }

    // Default average
    return { min: 3.0, max: 4.0, suggested: 3.5 };
  },

  /**
   * Check both statements and return combined alignment
   * @param {string} proStatement - Proficiency statement
   * @param {number} proMark - Proficiency mark
   * @param {string} conStatement - Conduct statement
   * @param {number} conMark - Conduct mark
   * @returns {Object} Combined alignment result
   */
  checkBothStatements(proStatement, proMark, conStatement, conMark) {
    const proAlignment = this.checkAlignment(proStatement, proMark, 'proficiency');
    const conAlignment = this.checkAlignment(conStatement, conMark, 'conduct');

    const warnings = [];

    if (proAlignment.status === 'warning') {
      warnings.push(`Proficiency: ${proAlignment.message}`);
    }

    if (conAlignment.status === 'warning') {
      warnings.push(`Conduct: ${conAlignment.message}`);
    }

    if (warnings.length > 0) {
      return {
        status: 'warning',
        messages: warnings,
        proAlignment,
        conAlignment
      };
    }

    if (proAlignment.status === 'good' || conAlignment.status === 'good') {
      return {
        status: 'good',
        messages: ['Mark and language align.'],
        proAlignment,
        conAlignment
      };
    }

    return {
      status: 'neutral',
      messages: [],
      proAlignment,
      conAlignment
    };
  }
};

// Make available globally
window.Alignment = Alignment;
