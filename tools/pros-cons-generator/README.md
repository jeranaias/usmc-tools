# Pros/Cons Generator

**Generate professional proficiency and conduct marking statements for USMC counselings.**

A free, offline-capable tool with phrase banks, templates, live PDF preview, and mark alignment checking.

[**Try it Live**](https://jeranaias.github.io/pros-cons-generator/) | [USMC Tools Suite](https://jeranaias.github.io/usmc-tools/)

---

## Features

### Statement Building
- **Phrase Banks** - Extensive library of approved phrases organized by performance level (5.0-1.0)
- **Quick Phrases** - One-click insertion of common statements
- **MOS-Specific Phrases** - Tailored language for Admin, Combat Arms, Aviation, Logistics, Comms, Intel, and Motor-T
- **Statement Templates** - Pre-formatted templates for promotion, semi-annual, and adverse counselings

### Smart Assistance
- **Mark Alignment Checker** - Warnings when statement language doesn't match the assigned mark
- **Character Counter** - Real-time counting with limit warnings
- **Performance Level Sync** - Phrase suggestions automatically adjust to selected level

### Export & Preview
- **Live PDF Preview** - Real-time side-by-side preview as you type
- **PDF Export** - Generate counseling worksheets or compact statement cards
- **Copy to Clipboard** - Quick copy for pasting into MOL
- **Draft Saving** - Save and load drafts locally

### Offline & Themes
- **Works Offline** - Install as PWA, use without internet
- **Dark Mode** - Default dark theme, easy on the eyes
- **Light Mode** - Traditional light theme
- **Night Mode** - Red-on-black tactical theme for low-light environments

---

## Quick Start

1. **Set Marine Info** (optional) - Name, rank, unit, marking period
2. **Configure Evaluation** - Select performance level and MOS type
3. **Build Statements** - Use quick phrases or open the phrase bank
4. **Set Marks** - Select proficiency and conduct marks
5. **Export** - Copy to clipboard or generate PDF

---

## Mark Scale Reference

| Mark | Proficiency | Conduct |
|:----:|-------------|---------|
| 5.0 | Outstanding performance, exceeds all standards | Exemplary conduct, role model for all |
| 4.5 | Excellent performance | Excellent conduct, positive influence |
| 4.0 | Above average, reliable | Above average, no issues |
| 3.5 | Slightly above average | Minor issues only |
| 3.0 | Average, meets minimum standards | Acceptable conduct |
| 2.5 | Below average | Below average, requires counseling |
| 2.0 | Poor performance | Conduct issues noted |
| 1.5 | Very poor, not improving | Serious conduct deficiencies |
| 1.0 | Failing, detrimental to unit | Major misconduct |

---

## References

- **MCO P1070.12K** - Individual Records Administration Manual (IRAM), Chapter 4
- **MCO P1610.7** - Performance Evaluation System
- **MCO P1400.32D** - Enlisted Promotions Manual

---

## Installation

### Use Online
Visit [jeranaias.github.io/pros-cons-generator](https://jeranaias.github.io/pros-cons-generator/)

### Install as App (PWA)
- **Desktop**: Click the install icon in your browser's address bar
- **iPhone/iPad**: Tap Share → "Add to Home Screen"
- **Android**: Tap menu → "Add to Home Screen" or "Install App"

### Self-Host
```bash
git clone https://github.com/jeranaias/pros-cons-generator.git
cd pros-cons-generator
# Serve with any static file server
python -m http.server 8000
```

---

## File Structure

```
pros-cons-generator/
├── index.html           # Main application
├── manifest.json        # PWA manifest
├── service-worker.js    # Offline caching
├── css/
│   └── styles.css       # OSMEAC design system
├── js/
│   ├── app.js           # Application logic
│   ├── phrases.js       # Phrase banks by level
│   ├── templates.js     # Statement templates
│   ├── alignment.js     # Mark alignment checker
│   └── storage.js       # LocalStorage utilities
└── assets/
    ├── icon-192.png     # PWA icon
    └── icon-512.png     # PWA icon (large)
```

---

## Community

This tool was built based on feedback from the Marine community:

| Contributor | Contribution |
|-------------|--------------|
| **peternemr** | Requested Pros/Cons generator with keyword/statement bank |
| **jj26meu** | Confirmed format requirements, offered testing support |

*This tool exists because Marines took the time to share their pain points. Semper Fi.*

---

## Part of USMC Tools

This is one of several free tools in the [USMC Tools](https://jeranaias.github.io/usmc-tools/) suite:

- **Naval Letter Format Generator** - Official correspondence
- **OSMEAC Generator** - 5-paragraph order builder
- **Award Write-up Generator** - NAM/LOA citations
- **Pros/Cons Generator** - Proficiency & conduct statements

---

## License

MIT License - Free to use, modify, and distribute.
