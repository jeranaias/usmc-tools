/**
 * Preview Manager
 * Live PDF preview with debounced updates
 */
const PreviewManager = {
  enabled: false,
  debounceTimer: null,
  debounceDelay: 750,
  currentBlobUrl: null,

  init() {
    // Restore preference
    const saved = localStorage.getItem('usmc-spb-preview-enabled');
    if (saved === 'true') {
      this.toggle();
    }

    // Bind toggle button
    const toggleBtn = document.getElementById('preview-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const pane = document.getElementById('live-preview-pane');
    const container = document.querySelector('.container');
    const toggleBtn = document.getElementById('preview-toggle');

    if (this.enabled) {
      pane?.classList.add('show');
      container?.classList.add('preview-active');
      if (toggleBtn) toggleBtn.innerHTML = '&#128065; Hide Preview';
      this.update();
    } else {
      pane?.classList.remove('show');
      container?.classList.remove('preview-active');
      if (toggleBtn) toggleBtn.innerHTML = '&#128065; Live Preview';
    }

    localStorage.setItem('usmc-spb-preview-enabled', this.enabled);
  },

  scheduleUpdate() {
    if (!this.enabled) return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => this.update(), this.debounceDelay);
  },

  async update() {
    if (!this.enabled) return;

    const frame = document.getElementById('preview-frame');
    const loading = document.getElementById('preview-loading');

    if (!frame) return;

    try {
      if (loading) loading.style.display = 'flex';

      const blob = await this.generatePreviewPDF();

      if (blob) {
        // Revoke old blob URL to prevent memory leaks
        if (this.currentBlobUrl) {
          URL.revokeObjectURL(this.currentBlobUrl);
        }

        this.currentBlobUrl = URL.createObjectURL(blob);
        frame.src = this.currentBlobUrl;
      }
    } catch (error) {
      console.error('Preview generation error:', error);
    } finally {
      if (loading) loading.style.display = 'none';
    }
  },

  async generatePreviewPDF() {
    // Get current package from App
    const pkg = App?.currentPackage;
    if (!pkg) return null;

    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      console.warn('jsPDF not loaded');
      return null;
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
    doc.text(`${template?.name || pkg.packageName} PACKAGE`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.text('CHECKLIST', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Applicant info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (pkg.applicantName) {
      doc.text(`Applicant: ${pkg.applicantRank || ''} ${pkg.applicantName}`, margin, y);
      y += 6;
    }
    doc.text(`Progress: ${progress.percentage}% Complete (${progress.complete}/${progress.required} required)`, margin, y);
    y += 6;
    doc.text(`Date: ${DateUtils.formatMilitary(new Date())}`, margin, y);
    y += 10;

    // Line
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Group documents by category
    const grouped = pkg.documents.reduce((acc, docItem) => {
      const cat = docItem.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(docItem);
      return acc;
    }, {});

    // Render each category
    for (const [category, docs] of Object.entries(grouped)) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(category.toUpperCase(), margin, y);
      y += 8;

      doc.setFontSize(9);
      docs.forEach(docItem => {
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

        if (!docItem.required) {
          doc.setFontSize(7);
          doc.text('(Optional)', margin + doc.getTextWidth(line) + 3, y);
          doc.setFontSize(9);
        }

        y += 5;

        doc.setFontSize(8);
        doc.setTextColor(100);
        const descLines = doc.splitTextToSize(docItem.description || '', contentWidth - 20);
        descLines.forEach(descLine => {
          doc.text(descLine, margin + 10, y);
          y += 4;
        });

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

    // Legend
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
    doc.text('[X] Complete   [ ] Incomplete   [--] N/A   [!] Waiver Required', margin, y);

    return doc.output('blob');
  },

  close() {
    if (this.enabled) {
      this.toggle();
    }
  }
};
