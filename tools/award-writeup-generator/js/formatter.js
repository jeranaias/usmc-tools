/**
 * Award Write-Up Generator - Formatting Utilities
 * Citation formatting, character counting, and validation
 */

const Formatter = {
  // Format date as MONTH YYYY (e.g., JANUARY 2024)
  formatDate(dateString) {
    if (!dateString) return '[DATE]';

    const date = new Date(dateString + '-01');
    const months = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  },

  // Format text to all caps and clean whitespace
  formatCitation(text) {
    if (!text) return '';

    return text
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Count lines based on characters per line
  countLines(text, charsPerLine = 80) {
    if (!text) return 0;
    const cleanText = text.replace(/\s+/g, ' ').trim();
    return Math.ceil(cleanText.length / charsPerLine);
  },

  // Check citation limits
  checkLimits(text, awardType) {
    const limits = Awards.getLimits(awardType);
    const cleanText = this.formatCitation(text);
    const lines = this.countLines(cleanText, limits.charsPerLine);
    const chars = cleanText.length;

    const result = {
      currentLines: lines,
      maxLines: limits.maxLines,
      currentChars: chars,
      maxChars: limits.maxChars,
      isOverLineLimit: limits.maxLines ? lines > limits.maxLines : false,
      isOverCharLimit: limits.maxChars ? chars > limits.maxChars : false,
      isOverLimit: false,
      percentUsed: 0,
      status: 'valid'
    };

    result.isOverLimit = result.isOverLineLimit || result.isOverCharLimit;

    if (limits.maxChars) {
      result.percentUsed = Math.round((chars / limits.maxChars) * 100);

      if (result.percentUsed > 100) {
        result.status = 'error';
      } else if (result.percentUsed > 90) {
        result.status = 'warning';
      }
    }

    return result;
  },

  // Build complete citation
  buildCitation(awardType, awardeeInfo, bodyText, selectedAttributes) {
    const { rank, name, gender, billet, unit, startDate, endDate } = awardeeInfo;

    // Generate opening
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const opening = Awards.generateOpening(
      awardType,
      gender,
      billet || '[BILLET]',
      unit || '[UNIT]',
      formattedStartDate,
      formattedEndDate
    );

    // Format body
    const formattedBody = this.formatCitation(bodyText);

    // Generate closing
    const closing = Attributes.generateClosing(
      rank || '[RANK]',
      name || '[NAME]',
      gender,
      selectedAttributes
    );

    // Combine all parts
    const fullCitation = [opening, formattedBody, closing]
      .filter(part => part && part.trim())
      .join(' ');

    return this.formatCitation(fullCitation);
  },

  // Build name block for citation header
  buildNameBlock(rank, name) {
    if (!rank || !name) return '';

    return [
      rank.toUpperCase(),
      name.toUpperCase(),
      'UNITED STATES MARINE CORPS'
    ].join('\n');
  },

  // Format SOA structure
  buildSOA(awardeeInfo, intro, achievements, impact, recommendation) {
    const { rank, name, gender, billet, unit, startDate, endDate } = awardeeInfo;
    const pronoun = gender === 'M' ? 'he' : 'she';
    const possessive = gender === 'M' ? 'his' : 'her';
    const reflexive = gender === 'M' ? 'himself' : 'herself';

    const formattedStart = this.formatDate(startDate);
    const formattedEnd = this.formatDate(endDate);

    let soa = '1. INTRODUCTION\n\n';

    // Use provided intro or generate default
    if (intro && intro.trim()) {
      soa += intro.trim();
    } else {
      soa += `${rank} ${name} served as ${billet || '[Billet]'} for ${unit || '[Unit]'} from ${formattedStart} to ${formattedEnd}. During this period, ${pronoun} distinguished ${reflexive} through exceptional performance of duty.`;
    }

    soa += '\n\n2. SPECIFIC ACHIEVEMENTS\n\n';

    // Add achievements
    if (achievements && achievements.length > 0) {
      achievements.forEach((achievement, index) => {
        const letter = String.fromCharCode(97 + index); // a, b, c, etc.
        if (achievement.text && achievement.text.trim()) {
          soa += `${letter}. ${achievement.text.trim()}`;

          // Add quantification if available
          const quants = [];
          if (achievement.howMany) quants.push(achievement.howMany);
          if (achievement.percent) quants.push(`${achievement.percent} improvement`);
          if (achievement.dollars) quants.push(`$${achievement.dollars} impact`);

          if (quants.length > 0) {
            soa += ` (${quants.join(', ')})`;
          }

          soa += '\n\n';
        }
      });
    } else {
      soa += 'a. [Achievement 1 - Action verb + specific accomplishment + quantified impact]\n\n';
      soa += 'b. [Achievement 2 - Action verb + specific accomplishment + quantified impact]\n\n';
    }

    soa += '3. IMPACT\n\n';

    if (impact && impact.trim()) {
      soa += impact.trim();
    } else {
      soa += `${rank} ${name}'s efforts directly contributed to mission accomplishment and unit readiness. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} exceptional performance ensured [specific positive outcome].`;
    }

    soa += '\n\n4. RECOMMENDATION\n\n';

    if (recommendation && recommendation.trim()) {
      soa += recommendation.trim();
    } else {
      soa += `Based on the above, ${rank} ${name} is recommended for the [Award Name].`;
    }

    return soa;
  },

  // Clean text for copying (remove extra whitespace but preserve structure)
  cleanForCopy(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
};
