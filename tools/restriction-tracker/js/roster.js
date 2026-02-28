/**
 * Roster management for restrictees
 * Handles CRUD operations for personnel on restriction
 */
const Roster = {
  /**
   * Get all restrictees
   * @param {boolean} activeOnly - Only return active restrictees
   * @returns {Object[]} - Array of restrictee objects
   */
  getAll(activeOnly = false) {
    const data = Storage.getAppData();
    if (activeOnly) {
      return data.restrictees.filter(r => r.active);
    }
    return data.restrictees;
  },

  /**
   * Get a single restrictee by ID
   * @param {string} id - Restrictee ID
   * @returns {Object|null} - Restrictee object or null
   */
  getById(id) {
    const data = Storage.getAppData();
    return data.restrictees.find(r => r.id === id) || null;
  },

  /**
   * Add a new restrictee
   * @param {Object} restrictee - Restrictee data
   * @returns {Object} - Created restrictee with ID
   */
  add(restrictee) {
    const data = Storage.getAppData();
    const newRestrictee = {
      ...restrictee,
      id: Storage.generateId(),
      active: true,
      createdAt: new Date().toISOString()
    };
    data.restrictees.push(newRestrictee);
    Storage.saveAppData(data);
    return newRestrictee;
  },

  /**
   * Update an existing restrictee
   * @param {string} id - Restrictee ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} - Updated restrictee or null
   */
  update(id, updates) {
    const data = Storage.getAppData();
    const index = data.restrictees.findIndex(r => r.id === id);
    if (index === -1) return null;

    data.restrictees[index] = {
      ...data.restrictees[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    Storage.saveAppData(data);
    return data.restrictees[index];
  },

  /**
   * Mark a restrictee as inactive (completed restriction)
   * @param {string} id - Restrictee ID
   * @returns {boolean} - Success status
   */
  complete(id) {
    return this.update(id, { active: false, completedAt: new Date().toISOString() }) !== null;
  },

  /**
   * Delete a restrictee and their muster records
   * @param {string} id - Restrictee ID
   * @returns {boolean} - Success status
   */
  delete(id) {
    const data = Storage.getAppData();
    const index = data.restrictees.findIndex(r => r.id === id);
    if (index === -1) return false;

    // Remove restrictee
    data.restrictees.splice(index, 1);

    // Remove associated muster records
    data.musterRecords = data.musterRecords.filter(r => r.restricteeId !== id);

    Storage.saveAppData(data);
    return true;
  },

  /**
   * Validate restrictee data
   * @param {Object} data - Restrictee data to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validate(data) {
    const errors = [];

    if (!data.rank) errors.push('Rank is required');
    if (!data.lastName) errors.push('Last name is required');
    if (!data.firstName) errors.push('First name is required');
    if (!data.startDate) errors.push('Start date is required');
    if (!data.daysAwarded || data.daysAwarded < 1 || data.daysAwarded > 60) {
      errors.push('Days awarded must be between 1 and 60');
    }
    if (!data.musterTimes || data.musterTimes.length === 0) {
      errors.push('At least one muster time is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Create restrictee from form data
   * @param {Object} formData - Form field values
   * @returns {Object} - Restrictee object
   */
  fromFormData(formData) {
    const startDate = new Date(formData.startDate);
    const endDate = DateUtils.calculateEndDate(startDate, parseInt(formData.daysAwarded, 10));

    return {
      rank: formData.rank,
      lastName: formData.lastName.toUpperCase(),
      firstName: formData.firstName,
      mi: formData.mi ? formData.mi.toUpperCase() : '',
      edipi: formData.edipi || '',
      unit: formData.unit || '',
      restrictionType: formData.restrictionType || 'restriction',
      startDate: DateUtils.formatISO(startDate),
      endDate: DateUtils.formatISO(endDate),
      daysAwarded: parseInt(formData.daysAwarded, 10),
      offense: formData.offense || '',
      musterTimes: formData.musterTimes,
      notes: formData.notes || ''
    };
  },

  /**
   * Get formatted display name
   * @param {Object} restrictee - Restrictee object
   * @returns {string} - Formatted name
   */
  getDisplayName(restrictee) {
    let name = `${restrictee.rank} ${restrictee.lastName}, ${restrictee.firstName}`;
    if (restrictee.mi) {
      name += ` ${restrictee.mi}.`;
    }
    return name;
  },

  /**
   * Get restriction type display name
   * @param {string} type - Restriction type
   * @returns {string} - Display name
   */
  getTypeDisplayName(type) {
    const types = {
      restriction: 'Restriction',
      epd: 'EPD',
      correctional_custody: 'Correctional Custody'
    };
    return types[type] || type;
  },

  /**
   * Get status info for a restrictee
   * @param {Object} restrictee - Restrictee object
   * @returns {Object} - Status info
   */
  getStatus(restrictee) {
    const daysRemaining = DateUtils.daysRemaining(restrictee.endDate);
    const todayRecords = Muster.getRecordsForDate(restrictee.id, DateUtils.today());
    const nextMuster = DateUtils.getNextMuster(restrictee.musterTimes, todayRecords);

    // Check for missed musters today
    const missedToday = this.hasMissedMusters(restrictee, todayRecords);

    let statusIcon = '✅';
    let statusClass = 'status-good';

    if (missedToday) {
      statusIcon = '🔴';
      statusClass = 'status-danger';
    } else if (nextMuster && nextMuster.status === 'overdue') {
      statusIcon = '🔴';
      statusClass = 'status-danger';
    } else if (nextMuster && nextMuster.status === 'soon') {
      statusIcon = '🟡';
      statusClass = 'status-warning';
    }

    return {
      daysRemaining,
      nextMuster,
      missedToday,
      statusIcon,
      statusClass
    };
  },

  /**
   * Check if restrictee has missed musters today
   * @param {Object} restrictee - Restrictee object
   * @param {Object[]} todayRecords - Today's muster records
   * @returns {boolean} - Has missed musters
   */
  hasMissedMusters(restrictee, todayRecords) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const recordedTimes = todayRecords.map(r => r.scheduledTime);

    for (const time of restrictee.musterTimes) {
      const scheduled = DateUtils.parseTimeToMinutes(time);
      // If muster time has passed (with grace period) and no record exists
      if (scheduled + 15 < currentMinutes && !recordedTimes.includes(time)) {
        return true;
      }
      // Check if any recorded muster is marked as missed
      const record = todayRecords.find(r => r.scheduledTime === time);
      if (record && record.status === 'missed') {
        return true;
      }
    }

    return false;
  },

  /**
   * Sort restrictees for display
   * @param {Object[]} restrictees - Array of restrictees
   * @returns {Object[]} - Sorted array
   */
  sortForDisplay(restrictees) {
    return [...restrictees].sort((a, b) => {
      // First by active status
      if (a.active !== b.active) return b.active ? 1 : -1;

      // Then by urgency (days remaining)
      const aDays = DateUtils.daysRemaining(a.endDate);
      const bDays = DateUtils.daysRemaining(b.endDate);
      if (aDays !== bDays) return aDays - bDays;

      // Then by name
      return a.lastName.localeCompare(b.lastName);
    });
  }
};

// Make available globally
window.Roster = Roster;
