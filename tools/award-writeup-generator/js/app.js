/**
 * Award Write-Up Generator - Main Application
 * Handles UI interactions, form management, and citation building
 */

// Preview Manager State
let previewDebounceTimer = null;
let previewEnabled = false;

// PWA Install prompt handling
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';
  }
});

function installPWA() {
  if (!deferredInstallPrompt) {
    showToast('Use your browser menu to install this app');
    return;
  }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      showToast('App installed successfully!');
    }
    deferredInstallPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  });
}

// Application State
const App = {
  currentAwardType: 'NAM',
  selectedAttributes: [],
  achievementCount: 1,
  previewOpen: false,

  // PWA install method
  installPWA,

  // Initialize the application
  init() {
    this.bindFormEvents();
    this.initializeTheme();
    this.renderAttributes();
    this.renderActionVerbs();
    this.updateApprovalAuthority();
    this.loadDraft();
    this.updateStatusBadges();
    this.restorePreviewState();
  },

  // Restore preview state from localStorage
  restorePreviewState() {
    const saved = localStorage.getItem('livePreviewEnabled');
    if (saved === 'true') {
      toggleLivePreview();
    }
  },

  // Bind form input events
  bindFormEvents() {
    // Form inputs - update preview on change
    const formInputs = ['rank', 'name', 'gender', 'billet', 'unit', 'start-date', 'end-date'];
    formInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => schedulePreviewUpdate());
        element.addEventListener('change', () => {
          schedulePreviewUpdate();
          this.saveDraft();
        });
      }
    });

    // Citation body changes
    const citationBody = document.getElementById('citationBody');
    if (citationBody) {
      citationBody.addEventListener('input', () => {
        this.updateStatusBadges();
        schedulePreviewUpdate();
        this.saveDraft();
      });
    }

    // SOA input changes
    ['soaIntro', 'soaImpact', 'soaRecommendation'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.updateSOAPreview());
      }
    });

    // First achievement textarea
    const firstAchievement = document.querySelector('.achievement-text');
    if (firstAchievement) {
      firstAchievement.addEventListener('input', () => this.updateSOAPreview());
    }

    // Auto-save on changes
    document.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('change', () => this.saveDraft());
    });
  },

  // Initialize theme
  initializeTheme() {
    ThemeManager.init();
  },

  // Update approval authority display
  updateApprovalAuthority() {
    const authority = Awards.getApprovalAuthority(this.currentAwardType);
    const display = document.getElementById('approvalAuthority');
    if (display) {
      display.textContent = authority;
    }
  },

  // Get current awardee info
  getAwardeeInfo() {
    return {
      rank: document.getElementById('rank')?.value || 'CORPORAL',
      name: document.getElementById('name')?.value || '',
      gender: document.getElementById('gender')?.value || 'M',
      billet: document.getElementById('billet')?.value || '',
      unit: document.getElementById('unit')?.value || '',
      startDate: document.getElementById('start-date')?.value || '',
      endDate: document.getElementById('end-date')?.value || ''
    };
  },

  // Build full citation text
  buildCitationText() {
    const info = this.getAwardeeInfo();
    const bodyText = document.getElementById('citationBody')?.value || '';

    // Generate opening
    const startDate = Formatter.formatDate(info.startDate);
    const endDate = Formatter.formatDate(info.endDate);
    const opening = Awards.generateOpening(
      this.currentAwardType,
      info.gender,
      info.billet || '[BILLET]',
      info.unit || '[UNIT]',
      startDate,
      endDate
    );

    // Format body
    const formattedBody = bodyText.toUpperCase().replace(/\s+/g, ' ').trim();

    // Generate closing
    const closing = Attributes.generateClosing(
      info.rank || 'CORPORAL',
      info.name || '[NAME]',
      info.gender,
      this.selectedAttributes
    );

    // Combine
    let fullText = opening;
    if (formattedBody) {
      fullText += ' ' + formattedBody;
    }
    fullText += ' ' + closing;

    return { info, fullText };
  },

  // Update status badges
  updateStatusBadges() {
    const { fullText } = this.buildCitationText();
    const limits = Formatter.checkLimits(fullText, this.currentAwardType);

    // Update character badge
    const charBadge = document.getElementById('charBadge');
    if (charBadge) {
      charBadge.textContent = `${limits.currentChars}/${limits.maxChars || '∞'}`;
      charBadge.className = 'status-badge';
      if (limits.isOverCharLimit) {
        charBadge.classList.add('error');
      } else if (limits.percentUsed > 90) {
        charBadge.classList.add('warning');
      }
    }

    // Update line badge
    const lineBadge = document.getElementById('lineBadge');
    if (lineBadge) {
      lineBadge.textContent = `${limits.currentLines}/${limits.maxLines || '∞'} lines`;
      lineBadge.className = 'status-badge secondary';
      if (limits.isOverLineLimit) {
        lineBadge.className = 'status-badge error';
      }
    }
  },

  // Render attributes grid
  renderAttributes() {
    const allAttributes = Attributes.getAll();
    const grid = document.getElementById('attributesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    allAttributes.forEach(attr => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'attribute-chip';
      chip.textContent = attr;
      chip.onclick = () => this.toggleAttribute(attr, chip);
      grid.appendChild(chip);
    });

    this.updateAttributeStatus();
  },

  // Toggle attribute selection
  toggleAttribute(attr, chip) {
    // Extra safety check - don't allow more than 3
    if (this.selectedAttributes.length >= 3 && !this.selectedAttributes.includes(attr)) {
      showToast('Maximum 3 attributes - deselect one first');
      chip.blur();
      return;
    }

    const index = this.selectedAttributes.indexOf(attr);

    if (index > -1) {
      // Deselect
      this.selectedAttributes.splice(index, 1);
      chip.classList.remove('selected');
    } else {
      // Select (max 3)
      if (this.selectedAttributes.length < 3) {
        this.selectedAttributes.push(attr);
        chip.classList.add('selected');
      }
    }

    // Remove focus to prevent blue outline confusion
    chip.blur();

    this.updateAttributeStatus();
    schedulePreviewUpdate();
  },

  // Update attribute status text and chip states
  updateAttributeStatus() {
    const status = document.getElementById('attributeStatus');
    const chips = document.querySelectorAll('.attribute-chip');
    const atMax = this.selectedAttributes.length >= 3;

    // Update status text
    if (status) {
      if (this.selectedAttributes.length === 3) {
        status.textContent = '3 attributes selected';
        status.className = 'attribute-status complete';
      } else if (this.selectedAttributes.length === 0) {
        status.textContent = 'Select 3 attributes (0/3)';
        status.className = 'attribute-status';
      } else {
        status.textContent = `Select ${3 - this.selectedAttributes.length} more (${this.selectedAttributes.length}/3)`;
        status.className = 'attribute-status';
      }
    }

    // Disable/enable chips based on selection count
    chips.forEach(chip => {
      const isSelected = chip.classList.contains('selected');
      if (atMax && !isSelected) {
        chip.disabled = true;
        chip.classList.add('disabled');
      } else {
        chip.disabled = false;
        chip.classList.remove('disabled');
      }
    });
  },

  // Render action verbs
  renderActionVerbs() {
    const categories = ActionVerbs.getAllCategories();
    const container = document.getElementById('verbCategories');
    if (!container) return;

    container.innerHTML = '';

    categories.forEach(category => {
      const verbs = ActionVerbs.getVerbsByCategory(category);
      const description = ActionVerbs.getCategoryDescription(category);

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'verb-category';
      categoryDiv.innerHTML = `
        <h3 class="verb-category-title">${category}</h3>
        <p class="verb-category-desc">${description}</p>
        <div class="verb-list">
          ${verbs.map(verb => `
            <button type="button" class="verb-chip" onclick="copyVerbToClipboard('${verb}')">${verb}</button>
          `).join('')}
        </div>
      `;

      container.appendChild(categoryDiv);
    });
  },

  // Get achievements data
  getAchievements() {
    const blocks = document.querySelectorAll('.achievement-block');
    const achievements = [];

    blocks.forEach(block => {
      achievements.push({
        text: block.querySelector('.achievement-text')?.value || '',
        howMany: block.querySelector('.quant-howmany')?.value || '',
        percent: block.querySelector('.quant-percent')?.value || '',
        dollars: block.querySelector('.quant-dollars')?.value || ''
      });
    });

    return achievements;
  },

  // Update SOA preview
  updateSOAPreview() {
    // SOA preview would go in the live preview when SOA tab is active
    // For now, just save the draft
    this.saveDraft();
  },

  // Save draft to storage
  saveDraft() {
    const draft = {
      awardType: this.currentAwardType,
      rank: document.getElementById('rank')?.value,
      name: document.getElementById('name')?.value,
      gender: document.getElementById('gender')?.value,
      billet: document.getElementById('billet')?.value,
      unit: document.getElementById('unit')?.value,
      startDate: document.getElementById('start-date')?.value,
      endDate: document.getElementById('end-date')?.value,
      citationBody: document.getElementById('citationBody')?.value,
      selectedAttributes: this.selectedAttributes,
      soaIntro: document.getElementById('soaIntro')?.value,
      soaImpact: document.getElementById('soaImpact')?.value,
      soaRecommendation: document.getElementById('soaRecommendation')?.value,
      achievements: this.getAchievements()
    };

    Storage.saveDraft(draft);
  },

  // Load draft from storage
  loadDraft() {
    const draft = Storage.loadDraft();
    if (!draft) return;

    // Restore form values
    if (draft.awardType) {
      this.currentAwardType = draft.awardType;
      document.getElementById('awardType').value = draft.awardType;
      selectAwardType(draft.awardType, true);
    }
    if (draft.rank) document.getElementById('rank').value = draft.rank;
    if (draft.name) document.getElementById('name').value = draft.name;
    if (draft.gender) document.getElementById('gender').value = draft.gender;
    if (draft.billet) document.getElementById('billet').value = draft.billet;
    if (draft.unit) document.getElementById('unit').value = draft.unit;
    if (draft.startDate) document.getElementById('start-date').value = draft.startDate;
    if (draft.endDate) document.getElementById('end-date').value = draft.endDate;
    if (draft.citationBody) document.getElementById('citationBody').value = draft.citationBody;
    if (draft.soaIntro) document.getElementById('soaIntro').value = draft.soaIntro;
    if (draft.soaImpact) document.getElementById('soaImpact').value = draft.soaImpact;
    if (draft.soaRecommendation) document.getElementById('soaRecommendation').value = draft.soaRecommendation;

    // Restore selected attributes
    if (draft.selectedAttributes && draft.selectedAttributes.length > 0) {
      this.selectedAttributes = draft.selectedAttributes;
      draft.selectedAttributes.forEach(attr => {
        const chips = document.querySelectorAll('.attribute-chip');
        chips.forEach(chip => {
          if (chip.textContent === attr) {
            chip.classList.add('selected');
          }
        });
      });
      this.updateAttributeStatus();
    }

    // Restore achievements
    if (draft.achievements && draft.achievements.length > 0) {
      const firstBlock = document.querySelector('.achievement-block');
      if (firstBlock && draft.achievements[0]) {
        const textArea = firstBlock.querySelector('.achievement-text');
        if (textArea) textArea.value = draft.achievements[0].text || '';
        const howMany = firstBlock.querySelector('.quant-howmany');
        if (howMany) howMany.value = draft.achievements[0].howMany || '';
        const percent = firstBlock.querySelector('.quant-percent');
        if (percent) percent.value = draft.achievements[0].percent || '';
        const dollars = firstBlock.querySelector('.quant-dollars');
        if (dollars) dollars.value = draft.achievements[0].dollars || '';
      }

      for (let i = 1; i < draft.achievements.length; i++) {
        if (draft.achievements[i].text) {
          addAchievement();
          const blocks = document.querySelectorAll('.achievement-block');
          const block = blocks[blocks.length - 1];
          if (block) {
            block.querySelector('.achievement-text').value = draft.achievements[i].text || '';
            block.querySelector('.quant-howmany').value = draft.achievements[i].howMany || '';
            block.querySelector('.quant-percent').value = draft.achievements[i].percent || '';
            block.querySelector('.quant-dollars').value = draft.achievements[i].dollars || '';
          }
        }
      }
    }

    // Update displays
    this.updateApprovalAuthority();
    this.updateStatusBadges();
  }
};

// ============================================
// PDF Preview Functions
// ============================================

// Schedule preview update with debounce
function schedulePreviewUpdate() {
  if (!previewEnabled) return;

  if (previewDebounceTimer) {
    clearTimeout(previewDebounceTimer);
  }

  previewDebounceTimer = setTimeout(updateLivePreview, 750);
}

// Generate PDF blob using jsPDF
async function generatePDFBlob() {
  try {
    // Check if jsPDF is loaded
    if (!window.jspdf) {
      console.warn('jsPDF not loaded yet');
      return null;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    const { info, fullText } = App.buildCitationText();

    // Set font
    doc.setFont('times', 'normal');
    doc.setFontSize(10);

    // Page dimensions
    const pageWidth = 8.5;
    const leftMargin = 0.7;
    const rightMargin = 0.5;
    const topMargin = 2;
    const textWidth = pageWidth - leftMargin - rightMargin;

    // Name block (centered)
    const rank = info.rank || 'CORPORAL';
    const name = (info.name || 'JOHN A. SMITH').toUpperCase();
    const branch = 'UNITED STATES MARINE CORPS';

    // Center name block
    const centerX = pageWidth / 2;
    let y = topMargin;

    doc.text(rank, centerX, y, { align: 'center' });
    y += 0.15;
    doc.text(name, centerX, y, { align: 'center' });
    y += 0.15;
    doc.text(branch, centerX, y, { align: 'center' });

    // Citation text (justified)
    y += 0.4;

    // Split text into lines that fit the width
    const lines = doc.splitTextToSize(fullText, textWidth);

    // Draw each line
    lines.forEach(line => {
      if (y > 10) {
        doc.addPage();
        y = 1;
      }
      doc.text(line, leftMargin, y);
      y += 0.15;
    });

    return doc.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    return null;
  }
}

// Update the live preview
async function updateLivePreview() {
  if (!previewEnabled) return;

  const previewFrame = document.getElementById('previewFrame');
  const previewLoading = document.getElementById('previewLoading');

  if (!previewFrame) return;

  try {
    if (previewLoading) {
      previewLoading.classList.add('show');
    }

    const pdfBlob = await generatePDFBlob();

    if (pdfBlob) {
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Revoke old blob URL to prevent memory leaks
      if (previewFrame.dataset.blobUrl) {
        URL.revokeObjectURL(previewFrame.dataset.blobUrl);
      }

      previewFrame.src = blobUrl;
      previewFrame.dataset.blobUrl = blobUrl;
    }
  } catch (error) {
    console.error('Preview generation error:', error);
  } finally {
    if (previewLoading) {
      previewLoading.classList.remove('show');
    }
  }
}

// ============================================
// Global Functions
// ============================================

// Select award type
function selectAwardType(type, skipSave = false) {
  App.currentAwardType = type;
  document.getElementById('awardType').value = type;

  // Update visual selection
  document.querySelectorAll('.award-type-option').forEach(opt => {
    const isSelected = opt.dataset.type === type;
    opt.classList.toggle('selected', isSelected);
    opt.setAttribute('aria-checked', isSelected);
  });

  // Hide other awards panel if not "other"
  if (type !== 'other') {
    const panel = document.getElementById('otherAwardsPanel');
    if (panel) panel.style.display = 'none';
  }

  // Update line limit display
  const limits = Awards.getLimits(type);
  const options = document.querySelectorAll('.award-type-option');
  options.forEach(opt => {
    if (opt.dataset.type === type) {
      const limitSpan = opt.querySelector('.award-limit');
      if (limitSpan && limits.maxLines) {
        limitSpan.textContent = `${limits.maxLines} lines max`;
      }
    }
  });

  App.updateApprovalAuthority();
  App.updateStatusBadges();
  schedulePreviewUpdate();
  if (!skipSave) App.saveDraft();
}

// Toggle other awards panel
function toggleOtherAwards() {
  const panel = document.getElementById('otherAwardsPanel');
  const otherOption = document.querySelector('.award-type-option[data-type="other"]');

  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    otherOption.classList.add('selected');
    otherOption.setAttribute('aria-checked', 'true');

    // Deselect other options
    document.querySelectorAll('.award-type-option:not([data-type="other"])').forEach(opt => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-checked', 'false');
    });
  } else {
    panel.style.display = 'none';
    otherOption.classList.remove('selected');
    otherOption.setAttribute('aria-checked', 'false');
    selectAwardType('NAM');
  }
}

// Select other award from dropdown
function selectOtherAward(type) {
  if (type) {
    App.currentAwardType = type;
    document.getElementById('awardType').value = type;
    App.updateApprovalAuthority();
    App.updateStatusBadges();
    schedulePreviewUpdate();
    App.saveDraft();
  }
}

// Toggle live preview
function toggleLivePreview() {
  const container = document.querySelector('.container');
  const previewPane = document.getElementById('livePreviewPane');
  const toggleBtn = document.getElementById('previewToggle');

  previewEnabled = !previewEnabled;

  if (previewEnabled) {
    container.classList.add('preview-active');
    previewPane.classList.add('show');
    toggleBtn.textContent = 'Hide Preview';
    toggleBtn.classList.add('active');
    updateLivePreview();
  } else {
    container.classList.remove('preview-active');
    previewPane.classList.remove('show');
    toggleBtn.textContent = 'Live Preview';
    toggleBtn.classList.remove('active');
  }

  localStorage.setItem('livePreviewEnabled', previewEnabled);
}

// Switch tabs
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabId}-tab`);
  });
}

// Insert verb into citation body
function insertVerb(verb) {
  const textarea = document.getElementById('citationBody');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const insertText = verb + ' ';
  textarea.value = text.substring(0, start) + insertText + text.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
  textarea.focus();

  App.updateStatusBadges();
  schedulePreviewUpdate();
  showToast(`Inserted: ${verb}`);
}

// Copy verb to clipboard
async function copyVerbToClipboard(verb) {
  try {
    await navigator.clipboard.writeText(verb);
    showToast(`Copied: ${verb}`);
  } catch (err) {
    showToast('Failed to copy');
  }
}

// Add achievement block
function addAchievement() {
  App.achievementCount++;
  const container = document.getElementById('achievementsContainer');
  const letter = String.fromCharCode(96 + App.achievementCount);

  const block = document.createElement('div');
  block.className = 'achievement-block';
  block.dataset.index = App.achievementCount - 1;
  block.innerHTML = `
    <button type="button" class="remove-btn" onclick="removeAchievement(this)" aria-label="Remove achievement">&times;</button>
    <div class="achievement-header">
      <span class="achievement-letter">${letter}.</span>
    </div>
    <textarea class="input textarea achievement-text" rows="3" placeholder="Action verb + specific accomplishment + quantified impact..."></textarea>
    <div class="quant-row">
      <input type="text" class="input input-sm quant-howmany" placeholder="How many? (50 Marines)">
      <input type="text" class="input input-sm quant-percent" placeholder="% improvement?">
      <input type="text" class="input input-sm quant-dollars" placeholder="$ value?">
    </div>
  `;

  block.querySelector('.achievement-text').addEventListener('input', () => App.updateSOAPreview());

  container.appendChild(block);
}

// Remove achievement block
function removeAchievement(btn) {
  btn.closest('.achievement-block').remove();
  App.updateSOAPreview();
}

// Copy citation to clipboard
async function copyCitation() {
  const { fullText } = App.buildCitationText();

  try {
    await navigator.clipboard.writeText(fullText);
    showToast('Citation copied to clipboard');
  } catch (err) {
    showToast('Failed to copy citation');
  }
}

// Print citation
function printCitation() {
  if (!previewEnabled) {
    toggleLivePreview();
  }
  // Give the PDF time to generate, then use browser print
  setTimeout(() => {
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentWindow) {
      previewFrame.contentWindow.print();
    }
  }, 500);
}

// Clear citation
function clearCitation() {
  if (confirm('Clear all citation content?')) {
    document.getElementById('citationBody').value = '';
    App.selectedAttributes = [];

    document.querySelectorAll('.attribute-chip').forEach(chip => {
      chip.classList.remove('selected');
    });

    App.updateAttributeStatus();
    App.updateStatusBadges();
    schedulePreviewUpdate();
    Storage.clearDraft();
    showToast('Citation cleared');
  }
}

// Copy SOA to clipboard
async function copySOA() {
  const info = App.getAwardeeInfo();
  const intro = document.getElementById('soaIntro')?.value || '';
  const achievements = App.getAchievements();
  const impact = document.getElementById('soaImpact')?.value || '';
  const recommendation = document.getElementById('soaRecommendation')?.value || '';

  const soa = Formatter.buildSOA(info, intro, achievements, impact, recommendation);

  try {
    await navigator.clipboard.writeText(soa);
    showToast('Summary of Action copied to clipboard');
  } catch (err) {
    showToast('Failed to copy SOA');
  }
}

// Print SOA
function printSOA() {
  switchTab('soa');
  setTimeout(() => window.print(), 100);
}

// Clear SOA
function clearSOA() {
  if (confirm('Clear all SOA content?')) {
    document.getElementById('soaIntro').value = '';
    document.getElementById('soaImpact').value = '';
    document.getElementById('soaRecommendation').value = '';

    const blocks = document.querySelectorAll('.achievement-block');
    blocks.forEach((block, index) => {
      if (index === 0) {
        block.querySelector('.achievement-text').value = '';
        block.querySelectorAll('input').forEach(input => input.value = '');
      } else {
        block.remove();
      }
    });

    App.achievementCount = 1;
    showToast('SOA cleared');
  }
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
