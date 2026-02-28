/**
 * Cover Sheet Generator
 * Generates cover sheets for screening packages
 */
const CoverSheetGenerator = {
  currentPackage: null,

  // Initialize with package data
  init(pkg) {
    this.currentPackage = pkg;
    this.render();
    this.bindEvents();
  },

  // Render the cover sheet form and preview
  render() {
    const container = document.getElementById('coversheet-container');
    if (!container || !this.currentPackage) return;

    const pkg = this.currentPackage;
    const template = PackageRegistry.getTemplate(pkg.packageType);

    container.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Form Section -->
        <div class="card">
          <div class="card__header">
            <h3 class="card__title">Applicant Information</h3>
          </div>

          <div class="form-group">
            <label class="label label--required">Rank</label>
            <select id="cs-rank" class="input select">
              <option value="">Select Rank</option>
              <option value="Pvt" ${pkg.applicantRank === 'Pvt' ? 'selected' : ''}>Pvt</option>
              <option value="PFC" ${pkg.applicantRank === 'PFC' ? 'selected' : ''}>PFC</option>
              <option value="LCpl" ${pkg.applicantRank === 'LCpl' ? 'selected' : ''}>LCpl</option>
              <option value="Cpl" ${pkg.applicantRank === 'Cpl' ? 'selected' : ''}>Cpl</option>
              <option value="Sgt" ${pkg.applicantRank === 'Sgt' ? 'selected' : ''}>Sgt</option>
              <option value="SSgt" ${pkg.applicantRank === 'SSgt' ? 'selected' : ''}>SSgt</option>
              <option value="GySgt" ${pkg.applicantRank === 'GySgt' ? 'selected' : ''}>GySgt</option>
              <option value="MSgt" ${pkg.applicantRank === 'MSgt' ? 'selected' : ''}>MSgt</option>
              <option value="1stSgt" ${pkg.applicantRank === '1stSgt' ? 'selected' : ''}>1stSgt</option>
              <option value="MGySgt" ${pkg.applicantRank === 'MGySgt' ? 'selected' : ''}>MGySgt</option>
              <option value="SgtMaj" ${pkg.applicantRank === 'SgtMaj' ? 'selected' : ''}>SgtMaj</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label label--required">Full Name (Last, First MI)</label>
            <input type="text" id="cs-name" class="input" placeholder="SMITH, John A."
                   value="${pkg.applicantName || ''}">
          </div>

          <div class="form-group">
            <label class="label label--required">EDIPI</label>
            <input type="text" id="cs-edipi" class="input" placeholder="1234567890"
                   value="${pkg.applicantEDIPI || ''}" maxlength="10">
          </div>

          <div class="form-group">
            <label class="label label--required">MOS</label>
            <input type="text" id="cs-mos" class="input" placeholder="0311"
                   value="${pkg.applicantMOS || ''}" maxlength="4">
          </div>

          <div class="form-group">
            <label class="label label--required">Unit</label>
            <input type="text" id="cs-unit" class="input" placeholder="1st Bn, 1st Marines"
                   value="${pkg.applicantUnit || ''}">
          </div>

          ${pkg.packageType === 'warrant_officer' ? `
            <div class="form-group">
              <label class="label">Target Board</label>
              <input type="text" id="cs-target-board" class="input" placeholder="FY26"
                     value="${pkg.targetBoard || ''}">
            </div>

            <div class="form-group">
              <label class="label">Target MOS</label>
              <input type="text" id="cs-target-mos" class="input" placeholder="0306 - Infantry Weapons Officer"
                     value="${pkg.targetMOS || ''}">
            </div>
          ` : ''}

          ${pkg.packageType === 'recruiting' ? `
            <div class="form-group">
              <label class="label">Preferred District</label>
              <input type="text" id="cs-preferred-district" class="input" placeholder="8th MCD"
                     value="${pkg.preferredDistrict || ''}">
            </div>
          ` : ''}

          <div class="mt-6">
            <button id="btn-update-coversheet" class="btn btn--primary btn--full">
              Update Cover Sheet
            </button>
          </div>
        </div>

        <!-- Preview Section -->
        <div>
          <div class="card mb-4">
            <div class="card__header">
              <h3 class="card__title">Preview</h3>
            </div>
            <div id="coversheet-preview" class="cover-sheet">
              ${this.generateCoverSheetHTML()}
            </div>
          </div>

          <div class="flex gap-3">
            <button id="btn-print-coversheet" class="btn btn--outline flex-1">
              &#128424; Print
            </button>
            <button id="btn-export-coversheet" class="btn btn--primary flex-1">
              &#128196; Export PDF
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  // Generate cover sheet HTML
  generateCoverSheetHTML() {
    const pkg = this.currentPackage;
    const template = PackageRegistry.getTemplate(pkg.packageType);
    const progress = PackageRegistry.calculateProgress(pkg);

    // Get complete documents for enclosure list
    const enclosures = pkg.documents
      .filter(d => d.status === 'complete' || d.status === 'waiver_needed')
      .sort((a, b) => a.id - b.id);

    // Get waivers
    const waivers = pkg.waivers || [];

    return `
      <div class="cover-sheet__header">
        <div class="cover-sheet__title">${template?.name || pkg.packageName} APPLICATION</div>
        <div class="text-sm mt-2">COVER SHEET</div>
      </div>

      <div class="cover-sheet__section">
        <div class="cover-sheet__section-title">Applicant Information</div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">Rank:</span>
          <span class="cover-sheet__value">${pkg.applicantRank || '___________'}</span>
        </div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">Name:</span>
          <span class="cover-sheet__value">${pkg.applicantName || '___________'}</span>
        </div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">EDIPI:</span>
          <span class="cover-sheet__value">${pkg.applicantEDIPI || '___________'}</span>
        </div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">MOS:</span>
          <span class="cover-sheet__value">${pkg.applicantMOS || '___________'}</span>
        </div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">Unit:</span>
          <span class="cover-sheet__value">${pkg.applicantUnit || '___________'}</span>
        </div>
      </div>

      <div class="cover-sheet__section">
        <div class="cover-sheet__section-title">Package Information</div>
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">Program:</span>
          <span class="cover-sheet__value">${template?.name || pkg.packageName}</span>
        </div>
        ${pkg.targetBoard ? `
          <div class="cover-sheet__field">
            <span class="cover-sheet__label">Target Board:</span>
            <span class="cover-sheet__value">${pkg.targetBoard}</span>
          </div>
        ` : ''}
        ${pkg.targetMOS ? `
          <div class="cover-sheet__field">
            <span class="cover-sheet__label">Target MOS:</span>
            <span class="cover-sheet__value">${pkg.targetMOS}</span>
          </div>
        ` : ''}
        ${pkg.preferredDistrict ? `
          <div class="cover-sheet__field">
            <span class="cover-sheet__label">Preferred District:</span>
            <span class="cover-sheet__value">${pkg.preferredDistrict}</span>
          </div>
        ` : ''}
        <div class="cover-sheet__field">
          <span class="cover-sheet__label">Date Prepared:</span>
          <span class="cover-sheet__value">${DateUtils.formatMilitary(new Date())}</span>
        </div>
      </div>

      <div class="cover-sheet__section">
        <div class="cover-sheet__section-title">Enclosures (${enclosures.length})</div>
        <ol class="cover-sheet__enclosure-list">
          ${enclosures.map((doc, index) => `
            <li class="cover-sheet__enclosure-item">
              <span>(${index + 1})</span>
              <span>${doc.name}${doc.status === 'waiver_needed' ? ' *' : ''}</span>
            </li>
          `).join('')}
        </ol>
        ${enclosures.some(d => d.status === 'waiver_needed') ? `
          <div class="text-sm mt-2">* Waiver required</div>
        ` : ''}
      </div>

      ${waivers.length > 0 ? `
        <div class="cover-sheet__section">
          <div class="cover-sheet__section-title">Waivers Requested</div>
          <ul style="list-style: none; padding: 0;">
            ${waivers.map(w => `
              <li style="padding: 4px 0;">
                &#9744; ${w.type}: ${w.reason}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="cover-sheet__section" style="margin-top: 40px;">
        <div class="cover-sheet__section-title">Certification</div>
        <p class="text-sm">
          I certify that all documents in this package are complete, accurate, and current
          to the best of my knowledge.
        </p>
        <div style="margin-top: 40px; display: flex; gap: 40px;">
          <div style="flex: 1;">
            <div style="border-bottom: 1px solid #000; height: 30px;"></div>
            <div class="text-sm">Applicant Signature</div>
          </div>
          <div style="width: 150px;">
            <div style="border-bottom: 1px solid #000; height: 30px;"></div>
            <div class="text-sm">Date</div>
          </div>
        </div>
      </div>
    `;
  },

  // Bind events
  bindEvents() {
    const updateBtn = document.getElementById('btn-update-coversheet');
    const printBtn = document.getElementById('btn-print-coversheet');
    const exportBtn = document.getElementById('btn-export-coversheet');

    if (updateBtn) {
      updateBtn.addEventListener('click', () => this.updatePackageInfo());
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => this.printCoverSheet());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (typeof ExportManager !== 'undefined') {
          ExportManager.exportCoverSheet(this.currentPackage);
        }
      });
    }
  },

  // Update package info from form
  updatePackageInfo() {
    const pkg = this.currentPackage;

    pkg.applicantRank = document.getElementById('cs-rank')?.value || '';
    pkg.applicantName = document.getElementById('cs-name')?.value || '';
    pkg.applicantEDIPI = document.getElementById('cs-edipi')?.value || '';
    pkg.applicantMOS = document.getElementById('cs-mos')?.value || '';
    pkg.applicantUnit = document.getElementById('cs-unit')?.value || '';

    if (pkg.packageType === 'warrant_officer') {
      pkg.targetBoard = document.getElementById('cs-target-board')?.value || '';
      pkg.targetMOS = document.getElementById('cs-target-mos')?.value || '';
    }

    if (pkg.packageType === 'recruiting') {
      pkg.preferredDistrict = document.getElementById('cs-preferred-district')?.value || '';
    }

    pkg.lastUpdated = new Date().toISOString();
    Storage.save(pkg.id, pkg);

    // Update preview
    const preview = document.getElementById('coversheet-preview');
    if (preview) {
      preview.innerHTML = this.generateCoverSheetHTML();
    }

    // Show success message
    this.showToast('Cover sheet updated successfully');
  },

  // Print cover sheet
  printCoverSheet() {
    const preview = document.getElementById('coversheet-preview');
    if (!preview) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cover Sheet - ${this.currentPackage.applicantName || 'Package'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            padding: 20px;
            max-width: 8.5in;
            margin: 0 auto;
          }
          .cover-sheet__header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }
          .cover-sheet__title {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .cover-sheet__section {
            margin-bottom: 20px;
          }
          .cover-sheet__section-title {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #666;
          }
          .cover-sheet__field {
            display: flex;
            margin-bottom: 5px;
          }
          .cover-sheet__label {
            font-weight: 500;
            min-width: 120px;
          }
          .cover-sheet__enclosure-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .cover-sheet__enclosure-item {
            padding: 3px 0;
            display: flex;
            gap: 10px;
          }
          .text-sm {
            font-size: 10pt;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${preview.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  },

  // Show toast notification
  showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'alert alert--success';
    toast.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 1001; animation: fadeIn 0.2s;';
    toast.innerHTML = `&#9989; ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.2s';
      setTimeout(() => toast.remove(), 200);
    }, 2000);
  }
};
