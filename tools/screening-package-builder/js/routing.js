/**
 * Routing Manager
 * Manages routing/endorsement tracking for packages
 */
const RoutingManager = {
  currentPackage: null,

  // Initialize routing view
  init(pkg) {
    this.currentPackage = pkg;
    this.render();
  },

  // Render the routing timeline
  render() {
    const container = document.getElementById('routing-container');
    if (!container || !this.currentPackage) return;

    const pkg = this.currentPackage;
    const progress = PackageRegistry.getRoutingProgress(pkg);

    container.innerHTML = `
      <div class="card mb-6">
        <div class="card__header">
          <h3 class="card__title">Routing Progress</h3>
          <p class="card__subtitle">${progress.signed} of ${progress.total} endorsements complete</p>
        </div>

        <div class="progress mb-4">
          <div class="progress__bar ${progress.signed === progress.total ? 'progress__bar--success' : ''}"
               style="width: ${progress.total > 0 ? (progress.signed / progress.total) * 100 : 0}%"></div>
        </div>
      </div>

      <div class="routing-timeline">
        ${pkg.routing.map((step, index) => this.renderRoutingStep(step, index)).join('')}
      </div>

      <div class="mt-6">
        <button id="btn-print-routing" class="btn btn--outline btn--full">
          &#128424; Print Routing Sheet
        </button>
      </div>
    `;

    this.bindEvents();
  },

  // Render a single routing step
  renderRoutingStep(step, index) {
    const statusClass = step.status === 'signed' ? 'routing-step--complete' :
                       step.status === 'pending' ? 'routing-step--pending' : '';

    const statusIcon = step.status === 'signed' ? '&#10003;' :
                      step.status === 'pending' ? '&#8987;' : (index + 1);

    const statusText = step.status === 'signed' ? `Signed: ${DateUtils.formatMilitary(step.date)}` :
                      step.status === 'returned' ? 'Returned for correction' :
                      step.status === 'pending' ? 'Pending' : 'Not started';

    const recommendsText = step.recommends === true ? '&#9989; Recommends' :
                          step.recommends === false ? '&#10060; Does not recommend' : '';

    return `
      <div class="routing-step ${statusClass}" data-step-id="${step.id}">
        <div class="routing-step__marker">${statusIcon}</div>
        <div class="routing-step__content">
          <div class="routing-step__title">${index + 1}. ${step.level}</div>
          ${step.name ? `<div class="routing-step__name">${step.name}</div>` : ''}
          <div class="routing-step__status">
            <span>${statusText}</span>
            ${recommendsText ? `<span class="ml-2">${recommendsText}</span>` : ''}
          </div>
          ${step.description ? `<div class="text-sm text-secondary mt-2">${step.description}</div>` : ''}

          <div class="mt-4 flex gap-2">
            <button class="btn btn--sm btn--outline" data-action="edit-step" data-step-id="${step.id}">
              Edit
            </button>
            ${step.status !== 'signed' ? `
              <button class="btn btn--sm btn--success" data-action="mark-signed" data-step-id="${step.id}">
                Mark Signed
              </button>
            ` : `
              <button class="btn btn--sm btn--ghost" data-action="mark-unsigned" data-step-id="${step.id}">
                Undo
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  // Bind events
  bindEvents() {
    // Print routing sheet
    document.getElementById('btn-print-routing')?.addEventListener('click', () => {
      this.printRoutingSheet();
    });

    // Edit step buttons
    document.querySelectorAll('[data-action="edit-step"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepId = parseInt(e.target.dataset.stepId);
        this.openEditModal(stepId);
      });
    });

    // Mark signed buttons
    document.querySelectorAll('[data-action="mark-signed"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepId = parseInt(e.target.dataset.stepId);
        this.markSigned(stepId);
      });
    });

    // Mark unsigned buttons
    document.querySelectorAll('[data-action="mark-unsigned"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepId = parseInt(e.target.dataset.stepId);
        this.markUnsigned(stepId);
      });
    });
  },

  // Mark step as signed
  markSigned(stepId) {
    const step = this.currentPackage.routing.find(s => s.id === stepId);
    if (!step) return;

    step.status = 'signed';
    step.date = new Date().toISOString();

    this.currentPackage.lastUpdated = new Date().toISOString();
    Storage.save(this.currentPackage.id, this.currentPackage);

    this.render();

    // Update dashboard if visible
    if (typeof App !== 'undefined' && App.updateDashboardStats) {
      App.updateDashboardStats();
    }
  },

  // Mark step as unsigned (undo)
  markUnsigned(stepId) {
    const step = this.currentPackage.routing.find(s => s.id === stepId);
    if (!step) return;

    step.status = 'pending';
    step.date = null;

    this.currentPackage.lastUpdated = new Date().toISOString();
    Storage.save(this.currentPackage.id, this.currentPackage);

    this.render();

    // Update dashboard if visible
    if (typeof App !== 'undefined' && App.updateDashboardStats) {
      App.updateDashboardStats();
    }
  },

  // Open edit modal for routing step
  openEditModal(stepId) {
    const step = this.currentPackage.routing.find(s => s.id === stepId);
    if (!step) return;

    const modal = document.getElementById('routing-modal');
    const overlay = document.getElementById('modal-overlay');

    // Populate modal
    document.getElementById('routing-modal-title').textContent = step.level;
    document.getElementById('routing-step-id').value = step.id;
    document.getElementById('routing-name').value = step.name || '';
    document.getElementById('routing-date').value = step.date
      ? DateUtils.formatISO(step.date)
      : '';

    // Set status
    document.querySelectorAll('input[name="routing-status"]').forEach(radio => {
      radio.checked = radio.value === step.status;
    });

    // Set recommendation
    document.querySelectorAll('input[name="routing-recommends"]').forEach(radio => {
      if (step.recommends === null && radio.value === '') {
        radio.checked = true;
      } else if (step.recommends === true && radio.value === 'yes') {
        radio.checked = true;
      } else if (step.recommends === false && radio.value === 'no') {
        radio.checked = true;
      }
    });

    // Show modal
    overlay.classList.add('modal-overlay--active');
    document.getElementById('document-modal').classList.add('hidden');
    modal.classList.remove('hidden');
  },

  // Save routing step changes
  saveStep() {
    const stepId = parseInt(document.getElementById('routing-step-id').value);
    const step = this.currentPackage.routing.find(s => s.id === stepId);
    if (!step) return;

    step.name = document.getElementById('routing-name').value;
    step.status = document.querySelector('input[name="routing-status"]:checked')?.value || 'pending';
    step.date = document.getElementById('routing-date').value || null;

    const recommends = document.querySelector('input[name="routing-recommends"]:checked')?.value;
    step.recommends = recommends === 'yes' ? true : recommends === 'no' ? false : null;

    this.currentPackage.lastUpdated = new Date().toISOString();
    Storage.save(this.currentPackage.id, this.currentPackage);

    this.closeModal();
    this.render();

    // Update dashboard if visible
    if (typeof App !== 'undefined' && App.updateDashboardStats) {
      App.updateDashboardStats();
    }
  },

  // Close modal
  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('modal-overlay--active');
    document.getElementById('routing-modal')?.classList.add('hidden');
    document.getElementById('document-modal')?.classList.remove('hidden');
  },

  // Print routing sheet
  printRoutingSheet() {
    const pkg = this.currentPackage;
    const template = PackageRegistry.getTemplate(pkg.packageType);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Routing Sheet - ${pkg.applicantName || 'Package'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            padding: 20px;
            max-width: 8.5in;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
            font-size: 16pt;
            text-transform: uppercase;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .info-section {
            margin-bottom: 20px;
            display: flex;
            gap: 40px;
          }
          .info-field {
            display: flex;
            gap: 10px;
          }
          .info-label {
            font-weight: bold;
            min-width: 60px;
          }
          .routing-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .routing-table th,
          .routing-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
          }
          .routing-table th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            min-height: 40px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${template?.name || pkg.packageName} Package<br>Routing Sheet</h1>

        <div class="info-section">
          <div class="info-field">
            <span class="info-label">Rank:</span>
            <span>${pkg.applicantRank || '_____'}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Name:</span>
            <span>${pkg.applicantName || '_____________________'}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Date:</span>
            <span>${DateUtils.formatMilitary(new Date())}</span>
          </div>
        </div>

        <table class="routing-table">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 25%;">Endorser Level</th>
              <th style="width: 25%;">Name/Rank</th>
              <th style="width: 15%;">Recommends</th>
              <th style="width: 20%;">Signature</th>
              <th style="width: 10%;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${pkg.routing.map((step, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${step.level}</td>
                <td>${step.name || ''}</td>
                <td>
                  &#9744; Yes &nbsp; &#9744; No
                </td>
                <td class="signature-line"></td>
                <td>${step.date ? DateUtils.formatMilitary(step.date) : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px;">
          <p><strong>Instructions:</strong></p>
          <ol style="font-size: 10pt;">
            <li>Review the package for completeness and accuracy</li>
            <li>Indicate recommendation (Yes/No)</li>
            <li>Sign and date in the appropriate blocks</li>
            <li>Forward to next endorser in the chain</li>
          </ol>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
