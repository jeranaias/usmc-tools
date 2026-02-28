/**
 * PFT/CFT Proctor - Preview Manager
 * Live PDF preview with side-by-side pane (desktop) or modal (mobile)
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const PreviewManager = {
  // Preview state
  previewEnabled: false,
  previewDebounceTimer: null,
  mobilePreviewUrl: null,
  currentBlobUrl: null,

  // Debounce delay for preview updates
  DEBOUNCE_DELAY: 750,

  /**
   * Initialize preview manager
   */
  init() {
    // Listen for score/marine updates
    document.addEventListener('scoresUpdated', () => this.schedulePreviewUpdate());
    document.addEventListener('marinesUpdated', () => this.schedulePreviewUpdate());

    // Restore preview state
    this.restoreState();

    console.log('PreviewManager initialized');
  },

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Toggle the live preview pane
   */
  toggle() {
    // On mobile, open modal instead of side panel
    if (this.isMobile()) {
      this.openMobilePreview();
      return;
    }

    this.previewEnabled = !this.previewEnabled;

    const container = Utils.$('mainContainer');
    const previewPane = Utils.$('livePreviewPane');
    const toggleBtn = Utils.$('preview-toggle');

    if (this.previewEnabled) {
      if (container) container.classList.add('preview-active');
      if (previewPane) previewPane.classList.add('show');
      if (toggleBtn) {
        toggleBtn.textContent = 'Hide Preview';
        toggleBtn.classList.add('active');
      }
      this.updatePreview();
    } else {
      if (container) container.classList.remove('preview-active');
      if (previewPane) previewPane.classList.remove('show');
      if (toggleBtn) {
        toggleBtn.textContent = 'Live Preview';
        toggleBtn.classList.remove('active');
      }
    }

    // Save preference
    localStorage.setItem('livePreviewEnabled', this.previewEnabled);
  },

  /**
   * Schedule debounced preview update
   */
  schedulePreviewUpdate() {
    if (!this.previewEnabled) return;

    clearTimeout(this.previewDebounceTimer);
    this.previewDebounceTimer = setTimeout(() => {
      this.updatePreview();
    }, this.DEBOUNCE_DELAY);
  },

  /**
   * Update the live preview
   */
  async updatePreview() {
    if (!this.previewEnabled && !this.isMobile()) return;

    const sessionData = SessionManager.getSessionData();
    if (sessionData.marines.length === 0) {
      this.showEmptyState();
      return;
    }

    const previewFrame = Utils.$('preview-frame');
    const previewLoading = Utils.$('preview-loading');

    try {
      // Show loading spinner
      if (previewLoading) {
        previewLoading.style.display = 'flex';
      }

      const doc = NAVMCGenerator.generate(sessionData);
      const pdfBlob = doc.output('blob');

      // Revoke old blob URL to prevent memory leaks
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }

      // Create new blob URL
      this.currentBlobUrl = URL.createObjectURL(pdfBlob);

      if (previewFrame) {
        previewFrame.src = this.currentBlobUrl;
      }
    } catch (e) {
      console.error('Preview generation failed:', e);
    } finally {
      // Hide loading spinner
      if (previewLoading) {
        previewLoading.style.display = 'none';
      }
    }
  },

  /**
   * Show empty state in preview
   */
  showEmptyState() {
    const previewFrame = Utils.$('preview-frame');
    if (previewFrame) {
      previewFrame.src = 'about:blank';
    }
  },

  /**
   * Open preview in full-screen modal for mobile
   */
  async openMobilePreview() {
    const sessionData = SessionManager.getSessionData();

    if (sessionData.marines.length === 0) {
      Utils.showStatus('error', 'No Marines in worksheet');
      return;
    }

    const modal = Utils.$('preview-modal');
    const content = Utils.$('preview-content');

    if (!modal || !content) return;

    // Show loading
    content.innerHTML = '<div class="loading"><div class="loading__spinner"></div> Generating preview...</div>';
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    try {
      const doc = NAVMCGenerator.generate(sessionData);
      const pdfDataUri = doc.output('datauristring');

      // Revoke old URL
      if (this.mobilePreviewUrl) {
        URL.revokeObjectURL(this.mobilePreviewUrl);
      }

      content.innerHTML = `
        <iframe
          src="${pdfDataUri}"
          style="width: 100%; height: 70vh; min-height: 400px; border: 1px solid var(--border-light); border-radius: var(--radius-md);"
        ></iframe>
        <div class="flex gap-3 mt-4 justify-center">
          <button class="btn btn--primary" onclick="PreviewManager.downloadPDF()">Download PDF</button>
          <button class="btn btn--secondary" onclick="PreviewManager.printPDF()">Print</button>
          <button class="btn btn--outline" onclick="PreviewManager.closeModal()">Close</button>
        </div>
      `;
    } catch (e) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⚠️</div>
          <div class="empty-state__text">Failed to generate preview</div>
        </div>
        <button class="btn btn--outline mt-4" onclick="PreviewManager.closeModal()">Close</button>
      `;
      console.error('Mobile preview failed:', e);
    }
  },

  /**
   * Close preview modal
   */
  closeModal() {
    const modal = Utils.$('preview-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  },

  /**
   * Close the side preview pane
   */
  closePane() {
    if (this.previewEnabled) {
      this.toggle();
    }
  },

  /**
   * Download PDF
   */
  downloadPDF() {
    const sessionData = SessionManager.getSessionData();
    if (sessionData.marines.length === 0) {
      Utils.showStatus('error', 'No Marines in worksheet');
      return;
    }

    const filename = `NAVMC_11622_${sessionData.date || 'draft'}.pdf`;
    NAVMCGenerator.downloadPDF(sessionData, filename);
    Utils.showStatus('success', 'PDF downloaded');
  },

  /**
   * Print PDF
   */
  printPDF() {
    const sessionData = SessionManager.getSessionData();
    if (sessionData.marines.length === 0) {
      Utils.showStatus('error', 'No Marines in worksheet');
      return;
    }

    NAVMCGenerator.printPDF(sessionData);
  },

  /**
   * Restore preview state from localStorage
   */
  restoreState() {
    // Don't restore on mobile
    if (this.isMobile()) return;

    const saved = localStorage.getItem('livePreviewEnabled');
    if (saved === 'true') {
      // Delay to ensure DOM is ready
      requestAnimationFrame(() => {
        this.toggle();
      });
    }
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreviewManager;
}
