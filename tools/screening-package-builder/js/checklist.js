/**
 * Checklist Manager
 * Handles document checklist display with step-by-step guidance
 */
const ChecklistManager = {
  currentPackage: null,
  filterStatus: 'all',
  viewMode: 'phases', // 'phases' or 'list'
  expandedDoc: null,

  init(pkg) {
    this.currentPackage = pkg;
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('checklist-container');
    if (!container || !this.currentPackage) return;

    const template = PackageRegistry.getTemplate(this.currentPackage.packageType);

    let html = '';

    // View mode toggle and filter controls
    html += `
      <div class="checklist-controls">
        <div class="view-toggle">
          <button class="view-toggle__btn ${this.viewMode === 'phases' ? 'active' : ''}" data-view="phases">
            &#128203; Step-by-Step
          </button>
          <button class="view-toggle__btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list">
            &#128220; Full List
          </button>
        </div>
        <div class="checklist-filter">
          <select id="checklist-filter" class="input select">
            <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>All Documents</option>
            <option value="incomplete" ${this.filterStatus === 'incomplete' ? 'selected' : ''}>Incomplete Only</option>
            <option value="complete" ${this.filterStatus === 'complete' ? 'selected' : ''}>Complete Only</option>
            <option value="waiver_needed" ${this.filterStatus === 'waiver_needed' ? 'selected' : ''}>Waiver Needed</option>
          </select>
        </div>
      </div>
    `;

    // Regulation reference banner
    if (template?.referenceUrl) {
      html += `
        <div class="regulation-banner">
          <div class="regulation-banner__content">
            <strong>Governing Reference:</strong> ${template.reference}
          </div>
          <a href="${template.referenceUrl}" target="_blank" rel="noopener" class="btn btn--sm btn--outline">
            View Order &#8599;
          </a>
        </div>
      `;
    }

    if (this.viewMode === 'phases' && template?.phases) {
      html += this.renderPhaseView(template);
    } else {
      html += this.renderListView();
    }

    container.innerHTML = html;
    this.bindItemEvents();
  },

  // Render step-by-step phase view
  renderPhaseView(template) {
    let html = '<div class="phases-container">';

    const phases = template.phases || [];

    phases.forEach((phase, idx) => {
      const phaseDocs = this.currentPackage.documents.filter(d =>
        phase.documents?.includes(d.id)
      );

      const phaseComplete = phaseDocs.length > 0 && phaseDocs.every(d =>
        d.status === 'complete' || d.status === 'na'
      );
      const phaseInProgress = phaseDocs.some(d => d.status === 'complete') && !phaseComplete;

      const phaseStatus = phaseComplete ? 'complete' : (phaseInProgress ? 'in-progress' : 'pending');
      const isCurrentPhase = !phases.slice(0, idx).every((p, i) => {
        const docs = this.currentPackage.documents.filter(d => p.documents?.includes(d.id));
        return docs.length === 0 || docs.every(d => d.status === 'complete' || d.status === 'na');
      }) ? false : !phaseComplete;

      html += `
        <div class="phase-card ${phaseStatus} ${isCurrentPhase ? 'current' : ''}">
          <div class="phase-card__header">
            <div class="phase-card__number">${phase.id}</div>
            <div class="phase-card__info">
              <h4 class="phase-card__title">${phase.name}</h4>
              <p class="phase-card__description">${phase.description}</p>
              ${phase.estimatedDuration ? `<span class="phase-card__duration">${phase.estimatedDuration}</span>` : ''}
            </div>
            <div class="phase-card__status">
              ${phaseComplete ? '&#9989;' : (phaseInProgress ? '&#9203;' : '&#11036;')}
            </div>
          </div>
          ${phase.warning ? `<div class="phase-warning">&#9888; ${phase.warning}</div>` : ''}
          ${phase.critical ? `<div class="phase-critical">CRITICAL: Start this phase first!</div>` : ''}
      `;

      if (phaseDocs.length > 0) {
        html += '<div class="phase-documents">';
        phaseDocs.forEach(doc => {
          if (this.filterStatus === 'all' || doc.status === this.filterStatus) {
            html += this.renderDocumentItem(doc, true);
          }
        });
        html += '</div>';
      } else if (phase.documents?.length === 0) {
        html += `<div class="phase-documents"><p class="text-sm text-secondary">No documents in this phase - action items only.</p></div>`;
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  },

  // Render traditional list view
  renderListView() {
    const documents = this.getFilteredDocuments();
    const groupedDocs = this.groupByCategory(documents);

    let html = '';

    for (const [category, docs] of Object.entries(groupedDocs)) {
      html += `
        <div class="checklist-category">
          <h3 class="checklist-category__title">${category}</h3>
        </div>
        <div class="checklist">
      `;

      docs.forEach(doc => {
        html += this.renderDocumentItem(doc, false);
      });

      html += '</div>';
    }

    if (documents.length === 0) {
      html = `
        <div class="empty-state">
          <div class="empty-state__icon">&#128196;</div>
          <h3 class="empty-state__title">No documents match filter</h3>
          <p class="empty-state__description">Try changing the filter to see more documents.</p>
        </div>
      `;
    }

    return html;
  },

  // Render a single document item with enhanced details
  renderDocumentItem(doc, compact = false) {
    const statusClass = `checklist-item--${doc.status === 'waiver_needed' ? 'waiver' : doc.status}`;
    const statusIcon = this.getStatusIcon(doc.status);
    const isExpanded = this.expandedDoc === doc.id;

    let html = `
      <div class="checklist-item ${statusClass} ${compact ? 'compact' : ''} ${isExpanded ? 'expanded' : ''}" data-doc-id="${doc.id}">
        <div class="checklist-item__header" data-action="toggle-expand" data-doc-id="${doc.id}">
          <div class="checklist-item__info">
            <span class="checklist-item__number">${doc.id}.</span>
            <div class="checklist-item__name">${doc.name}</div>
            <div class="checklist-item__badges">
              ${doc.required ? '<span class="badge badge--primary">Required</span>' : '<span class="badge badge--secondary">Optional</span>'}
              ${doc.formUrl || doc.systemUrl ? '<span class="badge badge--info">&#128279; Link</span>' : ''}
            </div>
          </div>
          <div class="checklist-item__actions">
            <span class="checklist-item__icon">${statusIcon}</span>
            <button class="btn btn--sm btn--ghost expand-btn" title="Expand details">
              ${isExpanded ? '&#9650;' : '&#9660;'}
            </button>
          </div>
        </div>
    `;

    // Expanded details
    html += `
      <div class="checklist-item__details ${isExpanded ? 'show' : ''}">
        <div class="doc-details">
          <p class="doc-details__description">${doc.description}</p>

          <div class="doc-details__reference">
            <strong>Reference:</strong> ${doc.reference || 'N/A'}
          </div>
    `;

    // Form/System links
    if (doc.formUrl || doc.systemUrl) {
      html += '<div class="doc-details__links">';
      if (doc.formUrl) {
        html += `<a href="${doc.formUrl}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">
          &#128196; Download Form
        </a>`;
      }
      if (doc.systemUrl) {
        html += `<a href="${doc.systemUrl}" target="_blank" rel="noopener" class="btn btn--sm btn--outline">
          &#128279; Open System
        </a>`;
      }
      html += '</div>';
    }

    // Instructions
    if (doc.instructions?.length > 0) {
      html += `
        <div class="doc-details__section">
          <h5>Instructions:</h5>
          <ol class="doc-instructions">
            ${doc.instructions.map(inst => `<li>${inst}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    // Format requirements
    if (doc.format) {
      html += `
        <div class="doc-details__section">
          <h5>Format Requirements:</h5>
          <ul class="doc-format">
            ${Object.entries(doc.format).map(([key, val]) =>
              `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</li>`
            ).join('')}
          </ul>
        </div>
      `;
    }

    // Tips
    if (doc.tips?.length > 0) {
      html += `
        <div class="doc-details__section doc-tips">
          <h5>&#128161; Tips:</h5>
          <ul>
            ${doc.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Status and notes section
    html += `
          <div class="doc-details__status">
            <div class="status-row">
              <span>Status: <strong>${this.getStatusLabel(doc.status)}</strong></span>
              ${doc.dateCompleted ? `<span>Completed: ${DateUtils.formatMilitary(doc.dateCompleted)}</span>` : ''}
            </div>
            ${doc.notes ? `<div class="doc-notes"><strong>Notes:</strong> ${doc.notes}</div>` : ''}
            <button class="btn btn--sm btn--primary" data-action="edit" data-doc-id="${doc.id}">
              &#9998; Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    return html;
  },

  getFilteredDocuments() {
    if (!this.currentPackage) return [];

    let docs = [...this.currentPackage.documents];

    if (this.filterStatus !== 'all') {
      docs = docs.filter(d => d.status === this.filterStatus);
    }

    return docs;
  },

  groupByCategory(documents) {
    return documents.reduce((groups, doc) => {
      const category = doc.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(doc);
      return groups;
    }, {});
  },

  getStatusIcon(status) {
    const icons = {
      complete: '&#9989;',
      incomplete: '&#11036;',
      na: '&#10134;',
      waiver_needed: '&#9888;'
    };
    return icons[status] || icons.incomplete;
  },

  getStatusLabel(status) {
    const labels = {
      complete: 'Complete',
      incomplete: 'Incomplete',
      na: 'N/A',
      waiver_needed: 'Waiver Needed'
    };
    return labels[status] || 'Unknown';
  },

  bindEvents() {
    const filterSelect = document.getElementById('checklist-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.render();
      });
    }
  },

  bindItemEvents() {
    // View mode toggle
    document.querySelectorAll('.view-toggle__btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.viewMode = e.target.dataset.view;
        this.render();
      });
    });

    // Expand/collapse
    document.querySelectorAll('[data-action="toggle-expand"]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="edit"]')) return;
        const docId = parseInt(el.dataset.docId);
        this.expandedDoc = this.expandedDoc === docId ? null : docId;
        this.render();
      });
    });

    // Edit buttons
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const docId = parseInt(e.target.dataset.docId);
        this.openEditModal(docId);
      });
    });
  },

  openEditModal(docId) {
    const doc = this.currentPackage.documents.find(d => d.id === docId);
    if (!doc) return;

    const modal = document.getElementById('document-modal');
    const overlay = document.getElementById('modal-overlay');

    document.getElementById('modal-doc-title').textContent = doc.name;
    document.getElementById('modal-doc-description').textContent = doc.description;
    document.getElementById('modal-doc-reference').textContent = doc.reference || 'N/A';
    document.getElementById('modal-doc-id').value = doc.id;

    document.querySelectorAll('input[name="doc-status"]').forEach(radio => {
      radio.checked = radio.value === doc.status;
    });

    document.getElementById('modal-doc-notes').value = doc.notes || '';
    document.getElementById('modal-doc-date').value = doc.dateCompleted
      ? DateUtils.formatISO(doc.dateCompleted)
      : '';

    overlay.classList.add('modal-overlay--active');
  },

  saveDocument() {
    const docId = parseInt(document.getElementById('modal-doc-id').value);
    const status = document.querySelector('input[name="doc-status"]:checked')?.value;
    const notes = document.getElementById('modal-doc-notes').value;
    const date = document.getElementById('modal-doc-date').value;

    const docIndex = this.currentPackage.documents.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    this.currentPackage.documents[docIndex].status = status;
    this.currentPackage.documents[docIndex].notes = notes;
    this.currentPackage.documents[docIndex].dateCompleted = date || null;
    this.currentPackage.lastUpdated = new Date().toISOString();

    Storage.save(this.currentPackage.id, this.currentPackage);

    this.closeModal();
    this.render();

    if (typeof App !== 'undefined') {
      App.updateDashboardStats();
      App.showToast('Document updated', 'success');
      if (typeof PreviewManager !== 'undefined') {
        PreviewManager.scheduleUpdate();
      }
    }
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('modal-overlay--active');
  }
};
