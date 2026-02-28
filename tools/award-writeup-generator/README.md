# Award Write-Up Generator

**Free, offline-capable tool for building USMC award citations and Summary of Action narratives**

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-8B0000.svg)](https://jeranaias.github.io/award-writeup-generator/)
[![SECNAV M-1650.1](https://img.shields.io/badge/Format-SECNAV%20M--1650.1-333.svg)](#references)

---

## Features

| Feature | Description |
|---------|-------------|
| **Award Types** | NAM, NCM, MSM, BSM, LOM, LoA, LoC, CoC, Meritorious Mast |
| **Citation Builder** | Auto-generates opening/closing sentences per SECNAV M-1650.1 |
| **Live PDF Preview** | Real-time preview with native browser PDF viewer |
| **Character/Line Limits** | Visual tracking with warnings (8 lines for NAM/NCM, 23 for MSM) |
| **Summary of Action** | Structured SOA builder with quantification prompts |
| **Action Verb Bank** | 150+ categorized verbs (Leadership, Combat, Technical, etc.) |
| **Closing Attributes** | Select exactly 3 attributes for standard closing sentence |
| **Offline Capable** | Works without internet via PWA - install on any device |
| **Dark/Night Modes** | Including tactical red-on-black night mode |
| **Auto-Save** | Draft automatically saved to browser storage |

---

## Quick Start

1. **Select Award Type** - NAM, NCM, MSM, or other
2. **Enter Awardee Info** - Rank, name, billet, unit, service dates
3. **Write Achievement Narrative** - Use action verbs, quantify impact
4. **Select 3 Closing Attributes** - For the standard closing sentence
5. **Copy or Print** - Citation is formatted per SECNAV M-1650.1

---

## Award Types Supported

| Award | Abbrev | Authority | Max Lines | Format |
|-------|--------|-----------|-----------|--------|
| Navy & Marine Corps Achievement Medal | NAM | O-6+ | 8 | All Caps |
| Navy & Marine Corps Commendation Medal | NCM | O-6+ | 8 | All Caps |
| Meritorious Service Medal | MSM | Flag/GO | 23 | All Caps |
| Bronze Star Medal | BSM | GO | 23 | All Caps |
| Legion of Merit | LOM | SECNAV | 23 | All Caps |
| Letter of Appreciation | LoA | Any O/SNCO | — | Mixed |
| Letter of Commendation | LoC | CO | — | Mixed |
| Certificate of Commendation | CoC | Unit Cdr | — | Mixed |
| Meritorious Mast | MM | CO | — | Mixed |

---

## Installation

### Use Online
**[jeranaias.github.io/award-writeup-generator](https://jeranaias.github.io/award-writeup-generator/)**

### Install as App (PWA)
- **Desktop**: Click install icon in address bar (Chrome/Edge)
- **iPhone/iPad**: Tap Share → "Add to Home Screen"
- **Android**: Menu (⋮) → "Add to Home Screen"

Once installed, works completely offline.

### Run Locally
```bash
git clone https://github.com/jeranaias/award-writeup-generator.git
cd award-writeup-generator
# Open index.html in any browser
```

---

## References

- **SECNAVINST 1650.1J** - Navy and Marine Corps Awards Manual
- **SECNAV M-1650.1** - Awards Manual (detailed formatting guidance)
- **OPNAV 1650/3** - Personal Award Recommendation form

---

## Part of USMC Tools

This tool is part of the [USMC Admin Tools](https://jeranaias.github.io/usmc-tools/) collection — free, open-source tools built for Marines.

**Other tools in the suite:**
- [Naval Letter Format Generator](https://jeranaias.github.io/navalletterformat/)
- [Page 11 Generator](https://jeranaias.github.io/usmc-tools/)
- [Counseling Generator](https://jeranaias.github.io/usmc-tools/)

---

## Community Attribution

This tool was built based on feedback from the r/USMC community:

| Contributor | Contribution |
|-------------|--------------|
| **jj26meu** | Requested award write-up generator, confirmed formatting requirements per MCO 1650.19J |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Contributing

Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## License

[MIT License](LICENSE) — Free to use, modify, and distribute.

---

## Disclaimer

This is an unofficial tool not affiliated with or endorsed by the Department of Defense or United States Marine Corps. Always verify outputs against current regulations and unit SOPs.
