/**
 * Report generation for restriction tracker
 * Generates PDF reports using jsPDF
 */
const Reports = {
  /**
   * Generate daily muster log PDF
   * @param {string} date - Date in ISO format
   * @param {string} unitName - Unit name for header
   */
  generateDailyReport(date, unitName = '') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const restrictees = Roster.getAll(true);
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESTRICTION MUSTER LOG', pageWidth / 2, yPos, { align: 'center' });

    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(DateUtils.formatMilitary(date), pageWidth / 2, yPos, { align: 'center' });

    if (unitName) {
      yPos += 6;
      doc.setFontSize(10);
      doc.text(unitName, pageWidth / 2, yPos, { align: 'center' });
    }

    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // Each restrictee
    for (const restrictee of restrictees) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const dailyLog = Muster.buildDailyLog(restrictee, date);

      // Person header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(Roster.getDisplayName(restrictee), 20, yPos);
      yPos += 5;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Restriction: ${DateUtils.formatMilitary(restrictee.startDate)} - ${DateUtils.formatMilitary(restrictee.endDate)}`,
        20, yPos
      );
      yPos += 8;

      // Table header
      const colWidths = [25, 30, 25, 90];
      const startX = 20;

      doc.setFillColor(240, 240, 240);
      doc.rect(startX, yPos - 4, pageWidth - 40, 6, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TIME', startX + 2, yPos);
      doc.text('STATUS', startX + colWidths[0] + 2, yPos);
      doc.text('ACTUAL', startX + colWidths[0] + colWidths[1] + 2, yPos);
      doc.text('RECORDED BY', startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos);
      yPos += 6;

      // Table rows
      doc.setFont('helvetica', 'normal');
      for (const muster of dailyLog.musters) {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const statusDisplay = muster.status === 'pending' || muster.status === 'unrecorded'
          ? { text: 'PENDING' }
          : Muster.getStatusDisplay(muster.status);

        doc.text(DateUtils.formatTimeDisplay(muster.time), startX + 2, yPos);
        doc.text(statusDisplay.text.toUpperCase(), startX + colWidths[0] + 2, yPos);
        doc.text(muster.actualTime ? DateUtils.formatTimeDisplay(muster.actualTime) : '-', startX + colWidths[0] + colWidths[1] + 2, yPos);
        doc.text(muster.recordedBy || '-', startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos);

        yPos += 5;

        // Notes if present
        if (muster.notes) {
          doc.setFontSize(7);
          doc.setTextColor(100);
          doc.text(`Note: ${muster.notes}`, startX + 10, yPos);
          doc.setTextColor(0);
          doc.setFontSize(8);
          yPos += 5;
        }
      }

      yPos += 10;
    }

    // Footer
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DUTY SUPERVISOR:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.line(70, yPos, 140, yPos);

    doc.text('DATE:', 150, yPos);
    doc.line(165, yPos, pageWidth - 20, yPos);

    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('REMARKS:', 20, yPos);
    yPos += 5;
    doc.setLineWidth(0.3);
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    doc.line(20, yPos + 12, pageWidth - 20, yPos + 12);
    doc.line(20, yPos + 19, pageWidth - 20, yPos + 19);

    // Save
    const filename = `muster-log-${DateUtils.formatNumeric(date)}.pdf`;
    doc.save(filename);
  },

  /**
   * Generate individual restrictee history report
   * @param {string} restricteeId - Restrictee ID
   */
  generateIndividualReport(restricteeId) {
    const restrictee = Roster.getById(restricteeId);
    if (!restrictee) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESTRICTION HISTORY REPORT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Person info
    doc.setFontSize(12);
    doc.text(Roster.getDisplayName(restrictee), 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const infoLines = [
      `Type: ${Roster.getTypeDisplayName(restrictee.restrictionType)}`,
      `Period: ${DateUtils.formatMilitary(restrictee.startDate)} - ${DateUtils.formatMilitary(restrictee.endDate)}`,
      `Days Awarded: ${restrictee.daysAwarded}`,
      `Muster Times: ${restrictee.musterTimes.map(t => DateUtils.formatTimeDisplay(t)).join(', ')}`
    ];

    if (restrictee.unit) {
      infoLines.push(`Unit: ${restrictee.unit}`);
    }

    for (const line of infoLines) {
      doc.text(line, 20, yPos);
      yPos += 5;
    }

    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // Statistics
    const stats = Muster.getStats(restricteeId);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Musters: ${stats.total}`, 20, yPos);
    doc.text(`Present: ${stats.present}`, 70, yPos);
    doc.text(`Late: ${stats.late}`, 110, yPos);
    doc.text(`Missed: ${stats.missed}`, 140, yPos);
    doc.text(`Excused: ${stats.excused}`, 175, yPos);
    yPos += 7;
    doc.text(`Compliance Rate: ${stats.complianceRate}%`, 20, yPos);
    yPos += 10;

    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // Muster log by date
    doc.setFont('helvetica', 'bold');
    doc.text('MUSTER LOG', 20, yPos);
    yPos += 10;

    const recordsByDate = Muster.getRecordsGroupedByDate(restricteeId, 30);
    const dates = Object.keys(recordsByDate).sort().reverse();

    for (const date of dates) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      // Date header
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 4, pageWidth - 40, 6, 'F');
      doc.text(DateUtils.formatMilitary(date), 22, yPos);
      yPos += 8;

      // Records for this date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const records = recordsByDate[date];
      for (const record of records) {
        const statusDisplay = Muster.getStatusDisplay(record.status);
        doc.text(
          `${DateUtils.formatTimeDisplay(record.scheduledTime)} - ${statusDisplay.text.toUpperCase()} at ${DateUtils.formatTimeDisplay(record.actualTime)} (${record.recordedBy || 'Unknown'})`,
          25, yPos
        );
        yPos += 4;

        if (record.notes) {
          doc.setTextColor(100);
          doc.text(`Note: ${record.notes}`, 30, yPos);
          doc.setTextColor(0);
          yPos += 4;
        }
      }

      yPos += 3;
    }

    // Save
    const filename = `restriction-history-${restrictee.lastName}-${DateUtils.formatNumeric(new Date())}.pdf`;
    doc.save(filename);
  },

  /**
   * Generate weekly summary report
   * @param {string} startDate - Start date in ISO format
   * @param {string} unitName - Unit name for header
   */
  generateWeeklyReport(startDate, unitName = '') {
    const endDate = DateUtils.addDays(startDate, 6);
    const dates = DateUtils.getDateRange(startDate, DateUtils.formatISO(endDate));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('WEEKLY RESTRICTION MUSTER SUMMARY', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${DateUtils.formatMilitary(startDate)} - ${DateUtils.formatMilitary(endDate)}`,
      pageWidth / 2, yPos, { align: 'center' }
    );

    if (unitName) {
      yPos += 5;
      doc.text(unitName, pageWidth / 2, yPos, { align: 'center' });
    }

    yPos += 10;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // Get all active restrictees
    const restrictees = Roster.getAll(true);

    for (const restrictee of restrictees) {
      if (yPos > 180) {
        doc.addPage('landscape');
        yPos = 20;
      }

      // Person header
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(Roster.getDisplayName(restrictee), 20, yPos);
      yPos += 8;

      // Column headers (dates)
      const colWidth = 35;
      const startX = 25;

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 3, pageWidth - 40, 5, 'F');

      doc.text('Time', 20, yPos);
      for (let i = 0; i < dates.length; i++) {
        const d = new Date(dates[i]);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
        doc.text(`${dayName} ${d.getDate()}`, startX + (i * colWidth), yPos);
      }
      yPos += 6;

      // Rows (muster times)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);

      for (const time of restrictee.musterTimes) {
        doc.text(DateUtils.formatTimeDisplay(time), 20, yPos);

        for (let i = 0; i < dates.length; i++) {
          const record = Muster.getRecord(restrictee.id, dates[i], time);
          let status = '-';

          if (record) {
            const display = Muster.getStatusDisplay(record.status);
            status = display.text.charAt(0); // First letter: P, L, M, E
          } else if (dates[i] < DateUtils.today()) {
            status = 'M'; // Missed if past and no record
          }

          doc.text(status, startX + (i * colWidth), yPos);
        }

        yPos += 4;
      }

      yPos += 8;
    }

    // Legend
    if (yPos > 170) {
      doc.addPage('landscape');
      yPos = 20;
    }

    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Legend:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('P = Present    L = Late    M = Missed    E = Excused    - = Pending', 45, yPos);

    // Save
    const filename = `weekly-summary-${DateUtils.formatNumeric(startDate)}.pdf`;
    doc.save(filename);
  },

  /**
   * Build HTML content for daily report preview
   * @param {string} date - Date in ISO format
   * @param {string} unitName - Unit name for header
   * @returns {string} - HTML content
   */
  buildDailyReportHTML(date, unitName = '') {
    const restrictees = Roster.getAll(true);
    let html = '';

    // Header
    html += '<div class="report-header">';
    html += '<h2 class="report-header__title">RESTRICTION MUSTER LOG</h2>';
    html += `<p class="report-header__date">${DateUtils.formatMilitary(date)}</p>`;
    if (unitName) {
      html += `<p class="report-header__unit">${unitName}</p>`;
    }
    html += '</div>';

    // Each restrictee
    for (const restrictee of restrictees) {
      const dailyLog = Muster.buildDailyLog(restrictee, date);

      html += '<div class="report-person">';
      html += `<h3 class="report-person__name">${Roster.getDisplayName(restrictee)}</h3>`;
      html += `<p class="report-person__dates">Restriction: ${DateUtils.formatMilitary(restrictee.startDate)} - ${DateUtils.formatMilitary(restrictee.endDate)}</p>`;

      html += '<table class="report-table">';
      html += '<thead><tr><th>TIME</th><th>STATUS</th><th>ACTUAL</th><th>RECORDED BY</th></tr></thead>';
      html += '<tbody>';

      for (const muster of dailyLog.musters) {
        const statusDisplay = muster.status === 'pending' || muster.status === 'unrecorded'
          ? { icon: '⏳', text: 'Pending' }
          : Muster.getStatusDisplay(muster.status);

        html += '<tr>';
        html += `<td>${DateUtils.formatTimeDisplay(muster.time)}</td>`;
        html += `<td>${statusDisplay.icon} ${statusDisplay.text}</td>`;
        html += `<td>${muster.actualTime ? DateUtils.formatTimeDisplay(muster.actualTime) : '-'}</td>`;
        html += `<td>${muster.recordedBy || '-'}</td>`;
        html += '</tr>';

        if (muster.notes) {
          html += `<tr><td colspan="4" style="font-size: 0.75rem; color: var(--warning); padding-left: 2rem;">Note: ${muster.notes}</td></tr>`;
        }
      }

      html += '</tbody></table>';
      html += '</div>';
    }

    // Footer
    html += '<div class="report-footer">';
    html += '<div class="report-signature">';
    html += '<div class="report-signature__line">DUTY SUPERVISOR: ___________________________</div>';
    html += '<div class="report-signature__line">DATE: _______________</div>';
    html += '</div>';
    html += '<div class="report-remarks">';
    html += '<p class="report-remarks__label">REMARKS:</p>';
    html += '<div class="report-remarks__lines"></div>';
    html += '</div>';
    html += '</div>';

    return html;
  }
};

// Make available globally
window.Reports = Reports;
