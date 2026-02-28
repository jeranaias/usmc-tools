/**
 * Export Manager
 * Handles PDF export functionality using jsPDF
 */
const ExportManager = {
  // Export checklist to PDF
  exportChecklist(pkg) {
    if (!pkg) return;

    // Check if jsPDF is available
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      this.showError('PDF export requires jsPDF library. Please check your connection and try again.');
      return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF();
    const template = PackageRegistry.getTemplate(pkg.packageType);
    const progress = PackageRegistry.calculateProgress(pkg);

    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${template?.name || pkg.packageName} PACKAGE CHECKLIST`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Applicant info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (pkg.applicantName) {
      doc.text(`Applicant: ${pkg.applicantRank} ${pkg.applicantName}`, margin, y);
      y += 6;
    }
    doc.text(`Date: ${DateUtils.formatMilitary(new Date())}`, margin, y);
    doc.text(`Progress: ${progress.percentage}% Complete (${progress.complete}/${progress.required} required docs)`, margin + 80, y);
    y += 10;

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Group documents by category
    const grouped = pkg.documents.reduce((acc, doc) => {
      const cat = doc.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    }, {});

    // Render each category
    for (const [category, docs] of Object.entries(grouped)) {
      // Check for page break
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // Category header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(category.toUpperCase(), margin, y);
      y += 8;

      // Documents in category
      doc.setFontSize(9);
      docs.forEach(docItem => {
        // Check for page break
        if (y > 275) {
          doc.addPage();
          y = 20;
        }

        const statusSymbol = docItem.status === 'complete' ? '[X]' :
                            docItem.status === 'na' ? '[--]' :
                            docItem.status === 'waiver_needed' ? '[!]' : '[ ]';

        doc.setFont('helvetica', 'normal');
        const line = `${statusSymbol} ${docItem.id}. ${docItem.name}`;
        doc.text(line, margin, y);

        // Add optional badge
        if (!docItem.required) {
          doc.setFontSize(7);
          doc.text('(Optional)', margin + doc.getTextWidth(line) + 3, y);
          doc.setFontSize(9);
        }

        y += 5;

        // Add description
        doc.setFontSize(8);
        doc.setTextColor(100);
        const descLines = doc.splitTextToSize(docItem.description || '', contentWidth - 20);
        descLines.forEach(descLine => {
          doc.text(descLine, margin + 10, y);
          y += 4;
        });

        // Add notes if present
        if (docItem.notes) {
          doc.setTextColor(0, 100, 0);
          doc.text(`Note: ${docItem.notes}`, margin + 10, y);
          y += 4;
        }

        doc.setTextColor(0);
        doc.setFontSize(9);
        y += 3;
      });

      y += 5;
    }

    // Add legend
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y += 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Legend:', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('[X] Complete   [ ] Incomplete   [--] Not Applicable   [!] Waiver Required', margin, y);

    // Save
    const filename = `${pkg.applicantName || 'package'}_checklist_${DateUtils.formatNumeric(new Date())}.pdf`;
    doc.save(filename.replace(/\s+/g, '_'));

    this.showSuccess('Checklist exported to PDF');
  },

  // Export cover sheet to PDF
  exportCoverSheet(pkg) {
    if (!pkg) return;

    // Check if jsPDF is available
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      this.showError('PDF export requires jsPDF library. Please check your connection and try again.');
      return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF();
    const template = PackageRegistry.getTemplate(pkg.packageType);

    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${template?.name || pkg.packageName} APPLICATION`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(14);
    doc.text('COVER SHEET', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Horizontal line
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Applicant Information section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICANT INFORMATION', margin, y);
    y += 2;
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const addField = (label, value) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value || '_______________', margin + 40, y);
      y += 7;
    };

    addField('Rank', pkg.applicantRank);
    addField('Name', pkg.applicantName);
    addField('EDIPI', pkg.applicantEDIPI);
    addField('MOS', pkg.applicantMOS);
    addField('Unit', pkg.applicantUnit);

    y += 5;

    // Package Information section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKAGE INFORMATION', margin, y);
    y += 2;
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFontSize(10);
    addField('Program', template?.name || pkg.packageName);

    if (pkg.targetBoard) addField('Target Board', pkg.targetBoard);
    if (pkg.targetMOS) addField('Target MOS', pkg.targetMOS);
    if (pkg.preferredDistrict) addField('Pref. District', pkg.preferredDistrict);
    addField('Date Prepared', DateUtils.formatMilitary(new Date()));

    y += 5;

    // Enclosures section
    const enclosures = pkg.documents.filter(d =>
      d.status === 'complete' || d.status === 'waiver_needed'
    ).sort((a, b) => a.id - b.id);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`ENCLOSURES (${enclosures.length})`, margin, y);
    y += 2;
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    enclosures.forEach((docItem, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const waiverMark = docItem.status === 'waiver_needed' ? ' *' : '';
      doc.text(`(${index + 1}) ${docItem.name}${waiverMark}`, margin, y);
      y += 5;
    });

    if (enclosures.some(d => d.status === 'waiver_needed')) {
      y += 3;
      doc.setFontSize(8);
      doc.text('* Waiver required', margin, y);
      y += 5;
    }

    // Waivers section if applicable
    if (pkg.waivers && pkg.waivers.length > 0) {
      y += 5;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('WAIVERS REQUESTED', margin, y);
      y += 2;
      doc.line(margin, y, margin + 60, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      pkg.waivers.forEach(waiver => {
        doc.text(`[ ] ${waiver.type}: ${waiver.reason}`, margin, y);
        y += 5;
      });
    }

    // Certification section
    y += 10;
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATION', margin, y);
    y += 2;
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const certText = 'I certify that all documents in this package are complete, accurate, and current to the best of my knowledge.';
    const certLines = doc.splitTextToSize(certText, pageWidth - (margin * 2));
    certLines.forEach(line => {
      doc.text(line, margin, y);
      y += 5;
    });

    y += 20;

    // Signature lines
    doc.line(margin, y, margin + 80, y);
    doc.line(pageWidth - margin - 50, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(8);
    doc.text('Applicant Signature', margin, y);
    doc.text('Date', pageWidth - margin - 50, y);

    // Save
    const filename = `${pkg.applicantName || 'package'}_coversheet_${DateUtils.formatNumeric(new Date())}.pdf`;
    doc.save(filename.replace(/\s+/g, '_'));

    this.showSuccess('Cover sheet exported to PDF');
  },

  // Export full package summary
  exportPackageSummary(pkg) {
    if (!pkg) return;

    // Check if jsPDF is available
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      this.showError('PDF export requires jsPDF library. Please check your connection and try again.');
      return;
    }

    // For simplicity, we'll call both export functions
    this.exportCoverSheet(pkg);

    // Small delay then export checklist
    setTimeout(() => {
      this.exportChecklist(pkg);
    }, 500);
  },

  // Show success message
  showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'alert alert--success';
    toast.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 1001;';
    toast.innerHTML = `&#9989; ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  // Show error message
  showError(message) {
    const toast = document.createElement('div');
    toast.className = 'alert alert--error';
    toast.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 1001;';
    toast.innerHTML = `&#9888; ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }
};
