# Restriction Tracker

[![USMC Tools](https://img.shields.io/badge/USMC-Tools-8B0000?style=flat-square)](https://jeranaias.github.io/usmc-tools/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5C1A1A?style=flat-square)](https://jeranaias.github.io/restriction-tracker/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Digital muster log for personnel on restriction or EPD punishment. A mobile-friendly sign-in tracking tool for USMC units.

**[Launch App](https://jeranaias.github.io/restriction-tracker/)** · **[Report Issue](https://github.com/jeranaias/restriction-tracker/issues)** · **[USMC Tools Suite](https://jeranaias.github.io/usmc-tools/)**

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Roster Management** | Add, edit, and track personnel on restriction, EPD, or correctional custody |
| **One-Tap Sign-In** | Large, mobile-friendly buttons for quick muster check-ins |
| **Automatic Timestamps** | Records exact sign-in times with timezone support |
| **Status Tracking** | Visual indicators for present, late, missed, and excused status |
| **Days Remaining** | Automatic calculation of restriction period progress |
| **Muster Alerts** | Visual warnings for upcoming and overdue musters |
| **PDF Export** | Generate daily logs and individual history reports (works offline) |

### Progressive Web App

- **Works Offline** - Full functionality without internet connection
- **Install to Home Screen** - Works like a native app on mobile devices
- **Automatic Updates** - Seamless background updates when online
- **Data Persistence** - All data stored locally in browser

### Theme Support

| Theme | Use Case |
|-------|----------|
| **Dark Mode** | Default - optimal for most environments |
| **Light Mode** | High-contrast for bright office settings |
| **Night Mode** | Tactical red-on-black for light discipline |

---

## Quick Start

1. **Open the app** - Go to [restriction-tracker](https://jeranaias.github.io/restriction-tracker/)
2. **Install for offline use** - Add to home screen (mobile) or install as app (desktop)
3. **Configure settings** - Set your unit name and default recorder
4. **Add restrictees** - Enter personnel from NJP paperwork
5. **Start tracking** - Use Sign In tab for muster check-ins

---

## S1 Implementation Guide

### Who Should Use This Tool

- **S1 Admin Clerks** - Primary operators who maintain the roster and run reports
- **Duty NCOs/Officers** - Personnel conducting restriction musters
- **Legal/Adjutant** - Reviewing muster compliance for NJP documentation

### Recommended Setup

#### Option A: Shared Duty Device (Recommended)
1. Use a dedicated duty phone or tablet
2. Install the app to the home screen
3. All duty personnel use the same device
4. Export data weekly as backup

#### Option B: Desktop in S1
1. Open the app in Chrome/Edge on the S1 duty computer
2. Bookmark or install for quick access
3. All restriction musters recorded on this single machine

#### Option C: Multiple Devices
1. Designate one device as the "master"
2. Other devices can be used during the day
3. At end of day, export from all devices and import to master

### Initial Setup

1. **Open the app** and configure settings:
   - Unit name (e.g., "1st Bn, 5th Marines")
   - Default recorder name (e.g., "Duty NCO")
2. **Add your restrictees** from Page 11/NJP paperwork
3. **Set muster times** per their restriction order

---

## Navigation

The app uses **tab navigation** at the top:

| Tab | Purpose |
|-----|---------|
| **Roster** | View all restrictees, add new people, see muster status |
| **Sign In** | Quick sign-in for next due muster |
| **Reports** | Daily muster reports with PDF export |
| **Settings** | Unit configuration, data backup, theme selection |

---

## Daily Workflow

### Morning
- Check the roster - cards show who needs to muster and when
- Badge on Sign In tab shows count of pending musters

### At Each Muster Time
1. Tap **Sign In** (auto-selects next due muster)
2. When restrictee arrives, select status:

| Status | When to Use | Notes Required |
|--------|-------------|----------------|
| **Present** | On time | No |
| **Late** | After scheduled time | Yes |
| **Missed** | No-show | Yes |
| **Excused** | Authorized absence | Yes |

3. Enter recorder name and submit

### End of Day
1. Go to **Reports** tab
2. Review the daily log
3. **Export PDF** for official records

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new person |
| `R` | Go to daily report |
| `S` | Open settings |
| `T` | Toggle theme (Dark → Light → Night) |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modal / Go back |

---

## Data Management

### Storage
All data is stored locally in your browser. Data does **not** sync between devices and is **not** transmitted over the internet.

### Backup & Restore
- **Export**: Settings → Export Data (downloads JSON file)
- **Import**: Settings → Import Data (select JSON file)

> **Important**: Export data regularly. Browser data can be lost by clearing history or device issues.

### Turnover Procedures
1. Export all data from Settings
2. Save the JSON file to unit shared drive
3. Brief the relief on current restrictees
4. New device: Import the JSON file

---

## Legal References

| Reference | Description |
|-----------|-------------|
| 10 USC 815 | Article 15, UCMJ - NJP Punishments |
| JAGINST 5800.7G | Manual of the Judge Advocate General |
| MCM Part V | Rules for Courts-Martial, Non-Judicial Punishment |
| MCO 5800.16 | Legal Support and Administration Manual |

---

## FAQ

### For S1 Shops

**Q: Can multiple clerks use this at the same time?**
A: If on different devices, each has separate data. Designate one device as master. Use export/import to merge data.

**Q: How do I print a log for Legal?**
A: Reports → Select date → Export PDF. Creates a printable PDF with all muster entries and timestamps.

**Q: What happens when restriction ends?**
A: Tap the person's card → End Restriction. They move to the "Completed" section.

### General

**Q: Does my data sync between devices?**
A: No. All data is stored locally. Use Export/Import to transfer.

**Q: Can I use this offline?**
A: Yes. After first visit, works completely offline.

**Q: Is my data secure?**
A: Data never leaves your device. No servers, no accounts, no transmission.

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Contribution |
|-------------|--------------|
| **quickdraw_** | Requested restriction sign-in tracker - noted 2016 Excel sheets still in use |

*This tool exists because Marines took the time to share their pain points.*

---

## Related Tools

- **[Naval Letter Format](https://jeranaias.github.io/navalletterformat/)** - Official correspondence generator
- **[OSMEAC Generator](https://jeranaias.github.io/osmeac-generator/)** - Operations order generator
- **[Award Write-up Generator](https://jeranaias.github.io/award-writeup-generator/)** - Award recommendation generator
- **[USMC Tools Suite](https://jeranaias.github.io/usmc-tools/)** - Complete admin tools collection

---

## License

MIT License - Free to use, modify, and distribute.

---

*Part of the [USMC Admin Tools Suite](https://jeranaias.github.io/usmc-tools/) · Free tool for Marines*
