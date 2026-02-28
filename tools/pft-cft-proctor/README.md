# PFT/CFT PROCTOR

**MCO 6100.13A Compliant NAVMC 11622 Generator**

Free, mobile-first PFT/CFT calculator and proctor worksheet for Marine Corps fitness test monitoring. Generate official NAVMC 11622 Performance Worksheets directly from your phone or computer.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://jeranaias.github.io/pft-cft-proctor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Features

### PFT Calculator
- **Upper Body Events**: Pull-ups (100 pts max) or Push-ups (70 pts max)
- **Core Event**: Plank hold with real-time scoring
- **Cardio Events**: 3-Mile Run or 5K Row (for 46+ / medical waiver)
- **Altitude Adjustment**: Automatic time adjustment for 4,500ft+
- **Live Scoring**: See points update as you enter performance data

### CFT Calculator
- **Movement to Contact (MTC)**: 880-yard sprint
- **Ammunition Lift (AL)**: 30lb ammo can lifts in 2 minutes
- **Maneuver Under Fire (MANUF)**: 300-yard combat course

### NAVMC 11622 Generator
- **Exact Form Match**: PDF output matches official NAVMC 11622 (Rev. 01-20)
- **Privacy Act Statement**: Includes complete page 1 legal text
- **Batch Processing**: Add multiple Marines to a single worksheet
- **Live Preview**: See PDF updates in real-time as you enter data

### Proctor Worksheet
- Track multiple Marines in a single session
- Auto-calculate points and classification (1st/2nd/3rd Class)
- Export session data for backup
- Load example roster for testing

---

## Theme Support

Three display modes optimized for different environments:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Dark** | Light text on dark background | Indoor/office use |
| **Light** | Dark text on light background | Bright environments |
| **Night** | Red on black (tactical) | Field use, preserves night vision |

---

## Installation

### Use Online (Recommended)
Visit **[jeranaias.github.io/pft-cft-proctor](https://jeranaias.github.io/pft-cft-proctor)**

### Install as App (PWA)
1. Visit the site in Chrome, Edge, or Safari
2. Click "Install" in the address bar (desktop) or use Share > "Add to Home Screen" (mobile)
3. App works completely offline after first visit

### Run Locally
```bash
git clone https://github.com/jeranaias/pft-cft-proctor.git
cd pft-cft-proctor
# Open index.html in any browser
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+D` | Download PDF |
| `Ctrl+P` | Print PDF |
| `Ctrl+S` | Export session |
| `Ctrl+L` | Toggle live preview |
| `Escape` | Close preview/modal |

---

## References

- **MCO 6100.13A w/CH-4** - Physical Fitness and Combat Fitness Tests (March 2022)
- **MCO 6110.3A w/CH-4** - Marine Corps Body Composition and Military Appearance Program
- **NAVMC 11622 (Rev. 01-20)** - PFT/CFT Performance Worksheet

---

## Screenshots

### Dark Mode (Default)
Mobile-optimized interface with gold accent bars and high-contrast text.

### Live Preview
Side-by-side PDF preview updates in real-time as you enter Marine data.

### NAVMC 11622 Output
Pixel-perfect recreation of the official form with all 27 columns.

---

## Tech Stack

- **Vanilla JavaScript** - No frameworks, fast loading
- **jsPDF** - Client-side PDF generation
- **CSS Custom Properties** - Full theme support
- **Service Worker** - Offline capability (PWA)

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **BigEarn86** | r/USMC | Original idea for mobile PFT/CFT proctor app |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Disclaimer

This is an **unofficial tool** for reference purposes only. Not an official DoD product. Always verify scores against official Marine Corps scoring tables and consult your unit's fitness coordinator for official results.

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

## Part of USMC Tools Suite

This tool is part of the [USMC Tools](https://jeranaias.github.io/usmc-tools/) suite of free, open-source administrative tools for Marines.

**Other tools in the suite:**
- [OSMEAC Generator](https://jeranaias.github.io/osmeac-generator/) - Operations order builder
- [Award Write-Up Generator](https://jeranaias.github.io/award-writeup-generator/) - NAM/NCM/MSM citation builder
- [Naval Letter Format](https://jeranaias.github.io/navalletterformat/) - Official correspondence formatter

---

*Semper Fidelis*
