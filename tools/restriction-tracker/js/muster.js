/**
 * Muster sign-in management
 * Handles recording and retrieving muster check-ins
 */
const Muster = {
  STATUSES: {
    PRESENT: 'present',
    LATE: 'late',
    MISSED: 'missed',
    EXCUSED: 'excused'
  },

  /**
   * Record a muster sign-in
   * @param {Object} record - Muster record data
   * @returns {Object} - Created record with ID
   */
  recordSignIn(record) {
    const data = Storage.getAppData();
    const newRecord = {
      id: Storage.generateId(),
      restricteeId: record.restricteeId,
      date: record.date || DateUtils.today(),
      scheduledTime: record.scheduledTime,
      actualTime: record.actualTime || DateUtils.getCurrentTime(),
      status: record.status,
      recordedBy: record.recordedBy || '',
      notes: record.notes || '',
      timestamp: new Date().toISOString()
    };

    data.musterRecords.push(newRecord);
    Storage.saveAppData(data);
    return newRecord;
  },

  /**
   * Get all records for a restrictee
   * @param {string} restricteeId - Restrictee ID
   * @returns {Object[]} - Array of muster records
   */
  getRecordsForRestrictee(restricteeId) {
    const data = Storage.getAppData();
    return data.musterRecords
      .filter(r => r.restricteeId === restricteeId)
      .sort((a, b) => {
        // Sort by date descending, then by time
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return DateUtils.parseTimeToMinutes(a.scheduledTime) - DateUtils.parseTimeToMinutes(b.scheduledTime);
      });
  },

  /**
   * Get records for a specific date
   * @param {string} restricteeId - Restrictee ID
   * @param {string} date - Date in ISO format
   * @returns {Object[]} - Array of muster records for that date
   */
  getRecordsForDate(restricteeId, date) {
    const data = Storage.getAppData();
    return data.musterRecords
      .filter(r => r.restricteeId === restricteeId && r.date === date)
      .sort((a, b) =>
        DateUtils.parseTimeToMinutes(a.scheduledTime) - DateUtils.parseTimeToMinutes(b.scheduledTime)
      );
  },

  /**
   * Get all records for a specific date (all restrictees)
   * @param {string} date - Date in ISO format
   * @returns {Object[]} - Array of muster records for that date
   */
  getAllRecordsForDate(date) {
    const data = Storage.getAppData();
    return data.musterRecords
      .filter(r => r.date === date)
      .sort((a, b) =>
        DateUtils.parseTimeToMinutes(a.scheduledTime) - DateUtils.parseTimeToMinutes(b.scheduledTime)
      );
  },

  /**
   * Get records grouped by date for a restrictee
   * @param {string} restricteeId - Restrictee ID
   * @param {number} limit - Maximum number of days to return
   * @returns {Object} - Records grouped by date
   */
  getRecordsGroupedByDate(restricteeId, limit = 7) {
    const records = this.getRecordsForRestrictee(restricteeId);
    const grouped = {};

    for (const record of records) {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    }

    // Sort dates descending and limit
    const sortedDates = Object.keys(grouped).sort().reverse().slice(0, limit);
    const result = {};
    for (const date of sortedDates) {
      result[date] = grouped[date].sort((a, b) =>
        DateUtils.parseTimeToMinutes(a.scheduledTime) - DateUtils.parseTimeToMinutes(b.scheduledTime)
      );
    }

    return result;
  },

  /**
   * Check if a specific muster has been recorded
   * @param {string} restricteeId - Restrictee ID
   * @param {string} date - Date in ISO format
   * @param {string} scheduledTime - Scheduled time in HHMM format
   * @returns {Object|null} - Muster record or null
   */
  getRecord(restricteeId, date, scheduledTime) {
    const data = Storage.getAppData();
    return data.musterRecords.find(r =>
      r.restricteeId === restricteeId &&
      r.date === date &&
      r.scheduledTime === scheduledTime
    ) || null;
  },

  /**
   * Update an existing muster record
   * @param {string} id - Record ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} - Updated record or null
   */
  updateRecord(id, updates) {
    const data = Storage.getAppData();
    const index = data.musterRecords.findIndex(r => r.id === id);
    if (index === -1) return null;

    data.musterRecords[index] = {
      ...data.musterRecords[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    Storage.saveAppData(data);
    return data.musterRecords[index];
  },

  /**
   * Delete a muster record
   * @param {string} id - Record ID
   * @returns {boolean} - Success status
   */
  deleteRecord(id) {
    const data = Storage.getAppData();
    const index = data.musterRecords.findIndex(r => r.id === id);
    if (index === -1) return false;

    data.musterRecords.splice(index, 1);
    Storage.saveAppData(data);
    return true;
  },

  /**
   * Get status display info
   * @param {string} status - Status code
   * @returns {Object} - Display info
   */
  getStatusDisplay(status) {
    const displays = {
      present: { icon: '✅', text: 'Present', class: 'status-good' },
      late: { icon: '⏰', text: 'Late', class: 'status-warning' },
      missed: { icon: '❌', text: 'Missed', class: 'status-danger' },
      excused: { icon: '📝', text: 'Excused', class: 'status-info' }
    };
    return displays[status] || displays.present;
  },

  /**
   * Get muster status icon for pending musters
   * @param {string} timeStatus - Time status (upcoming, soon, due, overdue)
   * @returns {string} - Icon
   */
  getPendingIcon(timeStatus) {
    switch (timeStatus) {
      case 'upcoming': return '⏳';
      case 'soon': return '🟡';
      case 'due': return '🟠';
      case 'overdue': return '🔴';
      default: return '⏳';
    }
  },

  /**
   * Build daily log for a restrictee
   * @param {Object} restrictee - Restrictee object
   * @param {string} date - Date in ISO format
   * @returns {Object} - Daily log with all musters
   */
  buildDailyLog(restrictee, date) {
    const records = this.getRecordsForDate(restrictee.id, date);
    const musters = [];

    for (const time of restrictee.musterTimes.sort((a, b) =>
      DateUtils.parseTimeToMinutes(a) - DateUtils.parseTimeToMinutes(b)
    )) {
      const record = records.find(r => r.scheduledTime === time);

      if (record) {
        musters.push({
          time,
          status: record.status,
          actualTime: record.actualTime,
          recordedBy: record.recordedBy,
          notes: record.notes,
          recordId: record.id
        });
      } else {
        // No record yet
        const timeStatus = date === DateUtils.today()
          ? DateUtils.getMusterTimeStatus(time, false)
          : 'missed'; // Past dates without record = missed

        musters.push({
          time,
          status: date === DateUtils.today() ? 'pending' : 'unrecorded',
          timeStatus,
          actualTime: null,
          recordedBy: null,
          notes: null,
          recordId: null
        });
      }
    }

    return {
      date,
      restricteeId: restrictee.id,
      musters
    };
  },

  /**
   * Get summary statistics for a restrictee
   * @param {string} restricteeId - Restrictee ID
   * @returns {Object} - Statistics
   */
  getStats(restricteeId) {
    const records = this.getRecordsForRestrictee(restricteeId);

    const stats = {
      total: records.length,
      present: 0,
      late: 0,
      missed: 0,
      excused: 0
    };

    for (const record of records) {
      if (stats.hasOwnProperty(record.status)) {
        stats[record.status]++;
      }
    }

    stats.complianceRate = stats.total > 0
      ? Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100)
      : 100;

    return stats;
  }
};

// Make available globally
window.Muster = Muster;
