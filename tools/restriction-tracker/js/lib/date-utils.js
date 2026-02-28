/**
 * Date utility functions for military date formatting and calculations
 */
const DateUtils = {
  MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  /**
   * Format date in military style: DD Mon YYYY
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  formatMilitary(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = this.MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  },

  /**
   * Format date as YYYY-MM-DD for input elements
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  formatISO(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Format date as YYYYMMDD (numeric)
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  formatNumeric(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  },

  /**
   * Get today's date in ISO format
   * @returns {string} - Today's date as YYYY-MM-DD
   */
  today() {
    return this.formatISO(new Date());
  },

  /**
   * Add days to a date
   * @param {Date|string} date - Starting date
   * @param {number} days - Number of days to add
   * @returns {Date} - New date
   */
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Calculate days remaining until end date
   * @param {Date|string} endDate - End date
   * @returns {number} - Days remaining (can be negative)
   */
  daysRemaining(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    // Reset times to midnight for accurate day count
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Calculate days elapsed since start date
   * @param {Date|string} startDate - Start date
   * @returns {number} - Days elapsed
   */
  daysElapsed(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Calculate end date from start date and days awarded
   * @param {Date|string} startDate - Start date
   * @param {number} daysAwarded - Number of days
   * @returns {Date} - End date
   */
  calculateEndDate(startDate, daysAwarded) {
    return this.addDays(startDate, daysAwarded - 1);
  },

  /**
   * Parse time string (HHMM or HH:MM) to minutes since midnight
   * @param {string} timeStr - Time string
   * @returns {number} - Minutes since midnight
   */
  parseTimeToMinutes(timeStr) {
    const cleaned = timeStr.replace(':', '');
    const hours = parseInt(cleaned.substring(0, 2), 10);
    const minutes = parseInt(cleaned.substring(2, 4), 10) || 0;
    return hours * 60 + minutes;
  },

  /**
   * Format minutes since midnight to HHMM string
   * @param {number} minutes - Minutes since midnight
   * @returns {string} - Time string in HHMM format
   */
  formatMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}${String(mins).padStart(2, '0')}`;
  },

  /**
   * Get current time as HHMM string
   * @returns {string} - Current time in HHMM format
   */
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}${minutes}`;
  },

  /**
   * Get current time as HH:MM string
   * @returns {string} - Current time in HH:MM format
   */
  getCurrentTimeFormatted() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Format time string from HHMM to HH:MM
   * @param {string} time - Time in HHMM format
   * @returns {string} - Time in HH:MM format
   */
  formatTimeDisplay(time) {
    if (!time) return '';
    const cleaned = time.replace(':', '');
    if (cleaned.length < 4) return time;
    return `${cleaned.substring(0, 2)}:${cleaned.substring(2, 4)}`;
  },

  /**
   * Check if a time is overdue
   * @param {string} scheduledTime - Scheduled time in HHMM format
   * @param {number} gracePeriodMinutes - Grace period in minutes
   * @returns {boolean} - True if overdue
   */
  isOverdue(scheduledTime, gracePeriodMinutes = 15) {
    const scheduled = this.parseTimeToMinutes(scheduledTime);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > scheduled + gracePeriodMinutes;
  },

  /**
   * Get muster status based on scheduled time
   * @param {string} scheduledTime - Scheduled time in HHMM format
   * @param {boolean} hasRecord - Whether a record exists
   * @returns {string} - Status: upcoming, soon, due, overdue
   */
  getMusterTimeStatus(scheduledTime, hasRecord = false) {
    if (hasRecord) return 'recorded';

    const scheduled = this.parseTimeToMinutes(scheduledTime);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const diff = scheduled - currentMinutes;

    if (diff > 30) return 'upcoming';
    if (diff > 0) return 'soon';
    if (diff > -15) return 'due';
    return 'overdue';
  },

  /**
   * Get the next muster time for a person
   * @param {string[]} musterTimes - Array of muster times in HHMM format
   * @param {Object[]} todayRecords - Today's muster records
   * @returns {Object|null} - Next muster info or null
   */
  getNextMuster(musterTimes, todayRecords = []) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const recordedTimes = todayRecords.map(r => r.scheduledTime);

    // Sort muster times
    const sortedTimes = [...musterTimes].sort((a, b) =>
      this.parseTimeToMinutes(a) - this.parseTimeToMinutes(b)
    );

    // Find next unrecorded muster
    for (const time of sortedTimes) {
      if (!recordedTimes.includes(time)) {
        const scheduled = this.parseTimeToMinutes(time);
        const diff = scheduled - currentMinutes;

        return {
          time,
          status: this.getMusterTimeStatus(time, false),
          minutesUntil: diff
        };
      }
    }

    return null;
  },

  /**
   * Format minutes until as human readable
   * @param {number} minutes - Minutes until
   * @returns {string} - Human readable string
   */
  formatMinutesUntil(minutes) {
    if (minutes < -60) {
      const hours = Math.abs(Math.floor(minutes / 60));
      return `${hours}h overdue`;
    }
    if (minutes < 0) {
      return `${Math.abs(minutes)} min overdue`;
    }
    if (minutes < 60) {
      return `in ${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `in ${hours}h`;
    }
    return `in ${hours}h ${mins}m`;
  },

  /**
   * Get dates for a range (for reports)
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {string[]} - Array of date strings in ISO format
   */
  getDateRange(startDate, endDate) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const current = new Date(start);
    while (current <= end) {
      dates.push(this.formatISO(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
};

// Make available globally
window.DateUtils = DateUtils;
