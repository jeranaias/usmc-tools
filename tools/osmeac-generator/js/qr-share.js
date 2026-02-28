/**
 * QR Share Module for OSMEAC Generator
 * Enables offline order sharing via QR codes
 *
 * Works completely offline - no network required for:
 * - Generating QR codes
 * - Scanning QR codes (uses device camera)
 * - Importing shared orders
 */

const QRShare = {
  // Max QR code version to use (affects data capacity)
  // Version 15 = ~550 alphanumeric chars, good balance of size/scanability
  MAX_QR_VERSION: 25,

  // Error correction level: L=7%, M=15%, Q=25%, H=30%
  // Using M for balance between data capacity and error recovery
  ERROR_CORRECTION: 'M',

  /**
   * Compress order data for QR encoding
   * @param {Object} orderData - The order data object
   * @returns {string} - Compressed, URL-safe string
   */
  compress(orderData) {
    // Convert to JSON and compress
    const json = JSON.stringify(orderData);
    return LZString.compressToEncodedURIComponent(json);
  },

  /**
   * Decompress order data from QR/URL
   * @param {string} compressed - Compressed string
   * @returns {Object|null} - Order data object or null if invalid
   */
  decompress(compressed) {
    try {
      const json = LZString.decompressFromEncodedURIComponent(compressed);
      if (!json) return null;
      return JSON.parse(json);
    } catch (e) {
      console.error('QRShare: Failed to decompress data', e);
      return null;
    }
  },

  /**
   * Generate a shareable URL with embedded order data
   * @param {Object} orderData - The order data object
   * @returns {string} - Full URL with compressed data
   */
  generateShareURL(orderData) {
    const compressed = this.compress(orderData);
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?order=${compressed}`;
  },

  /**
   * Generate QR code SVG for the order
   * @param {Object} orderData - The order data object
   * @param {number} cellSize - Size of each QR cell in pixels
   * @returns {Object} - { success: boolean, svg?: string, error?: string, dataSize?: number }
   */
  generateQR(orderData, cellSize = 4) {
    try {
      const url = this.generateShareURL(orderData);
      const dataSize = url.length;

      // Check if data is too large
      if (dataSize > 2953) { // Max for version 40, M correction
        return {
          success: false,
          error: `Order data too large (${dataSize} chars). Max is ~2900. Try removing some detail.`,
          dataSize
        };
      }

      // Find appropriate QR version
      let version = this.findQRVersion(dataSize);
      if (version > this.MAX_QR_VERSION) {
        version = this.MAX_QR_VERSION;
      }

      // Generate QR code
      const qr = qrcode(version, this.ERROR_CORRECTION);
      qr.addData(url);
      qr.make();

      return {
        success: true,
        svg: qr.createSvgTag(cellSize, 0),
        dataSize,
        version
      };
    } catch (e) {
      console.error('QRShare: Failed to generate QR code', e);
      return {
        success: false,
        error: 'Failed to generate QR code: ' + e.message
      };
    }
  },

  /**
   * Find minimum QR version needed for data size
   * @param {number} dataSize - Length of data string
   * @returns {number} - QR version (1-40)
   */
  findQRVersion(dataSize) {
    // Approximate capacity for alphanumeric at M error correction
    // These are conservative estimates
    const capacities = [
      { version: 1, chars: 20 },
      { version: 2, chars: 38 },
      { version: 3, chars: 61 },
      { version: 4, chars: 90 },
      { version: 5, chars: 122 },
      { version: 6, chars: 154 },
      { version: 7, chars: 178 },
      { version: 8, chars: 221 },
      { version: 9, chars: 262 },
      { version: 10, chars: 311 },
      { version: 15, chars: 520 },
      { version: 20, chars: 858 },
      { version: 25, chars: 1286 },
      { version: 30, chars: 1732 },
      { version: 35, chars: 2188 },
      { version: 40, chars: 2953 }
    ];

    for (const cap of capacities) {
      if (dataSize <= cap.chars) {
        return cap.version;
      }
    }
    return 40; // Max version
  },

  /**
   * Check URL for shared order data on page load
   * @returns {Object|null} - Order data if found in URL
   */
  checkURLForOrder() {
    const params = new URLSearchParams(window.location.search);
    const orderParam = params.get('order');

    if (orderParam) {
      return this.decompress(orderParam);
    }
    return null;
  },

  /**
   * Clear the order parameter from URL without reload
   */
  clearURLParam() {
    const url = new URL(window.location);
    url.searchParams.delete('order');
    window.history.replaceState({}, '', url);
  },

  /**
   * Show the QR share modal
   * @param {Object} orderData - The order data to share
   */
  showShareModal(orderData) {
    const modal = document.getElementById('qr-share-modal');
    const qrContainer = document.getElementById('qr-code-container');
    const errorEl = document.getElementById('qr-error');
    const sizeEl = document.getElementById('qr-data-size');

    if (!modal || !qrContainer) {
      console.error('QRShare: Modal elements not found');
      return;
    }

    // Generate QR code
    const result = this.generateQR(orderData, 5);

    if (result.success) {
      qrContainer.innerHTML = result.svg;
      if (errorEl) errorEl.style.display = 'none';
      if (sizeEl) {
        sizeEl.textContent = `Data: ${result.dataSize} chars | QR Version: ${result.version}`;
        sizeEl.style.display = 'block';
      }
    } else {
      qrContainer.innerHTML = '<div class="qr-placeholder">QR Code Generation Failed</div>';
      if (errorEl) {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
      if (sizeEl) sizeEl.style.display = 'none';
    }

    // Show modal
    modal.classList.add('modal-overlay--active');
  },

  /**
   * Hide the QR share modal
   */
  hideShareModal() {
    const modal = document.getElementById('qr-share-modal');
    if (modal) {
      modal.classList.remove('modal-overlay--active');
    }
  },

  /**
   * Copy share URL to clipboard
   * @param {Object} orderData - The order data
   * @returns {Promise<boolean>} - Success status
   */
  async copyShareURL(orderData) {
    try {
      const url = this.generateShareURL(orderData);
      await navigator.clipboard.writeText(url);
      return true;
    } catch (e) {
      console.error('QRShare: Failed to copy to clipboard', e);
      return false;
    }
  },

  /**
   * Initialize QR sharing - check for incoming shared order
   * @param {Function} onOrderReceived - Callback when shared order is found
   */
  init(onOrderReceived) {
    const sharedOrder = this.checkURLForOrder();

    if (sharedOrder) {
      // Clean URL
      this.clearURLParam();

      // Notify app of received order
      if (typeof onOrderReceived === 'function') {
        onOrderReceived(sharedOrder);
      }
    }

    // Set up modal event listeners
    this.setupModalListeners();
  },

  /**
   * Set up modal close listeners
   */
  setupModalListeners() {
    const modal = document.getElementById('qr-share-modal');
    const closeBtn = document.getElementById('qr-modal-close');
    const copyBtn = document.getElementById('qr-copy-url');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideShareModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideShareModal();
        }
      });
    }

    // Copy URL button is handled in app.js since it needs orderData
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QRShare;
}
