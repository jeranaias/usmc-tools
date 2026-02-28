# Changelog

All notable changes to the Restriction Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-01-01

### Changed
- **New Design Pattern** - Updated to match OSMEAC/Award Write-up design language
- **Centered Header** - Gradient header with centered title, gold subtitle
- **Top Tabs Navigation** - Replaced bottom nav with underlined top tabs
- **Gold Accent Cards** - Section cards now have gold/yellow left border indicator
- **Section Titles** - ALL CAPS styling with gold color and helper text
- **Theme Toggle** - Moved to top-right corner of header
- **Tagline** - Added "Free tool for Marines" with documentation link

### Technical
- Added `.top-tabs` and `.top-tabs__tab` CSS components
- Added `.tagline` component for documentation link
- Updated `.header` with centered layout and theme toggle positioning
- Updated `.card` with gold left border accent
- Updated `.view__title` with gold color and uppercase styling
- Hidden bottom navigation bar (legacy code preserved for compatibility)
- Service worker version bumped to 1.5.0

---

## [1.4.0] - 2026-01-01

### Added
- **PWA Install Guide** - Collapsible section with platform-specific install instructions
- **One-Click Install** - "Install App" button appears when browser supports PWA installation
- Handles `beforeinstallprompt` event for seamless app installation

### Fixed
- Welcome modal button event handling with `preventDefault` and null checks

### Technical
- Added `installPWA()` function and `deferredInstallPrompt` handling
- Service worker version bumped to 1.4.0

---

## [1.3.0] - 2025-12-31

### Added
- **Pending Muster Badge** - Sign In nav shows count of musters due within the hour
- **Progress Bars** - Visual progress indicator on roster cards showing days served
- **Card Urgency States** - Cards highlight with colored borders for urgent/soon musters
- **Scroll Shadow** - Header gains shadow effect when scrolling

### Changed
- **Enhanced Animations** - Smooth view transitions, staggered card animations, modal slide-up
- **Touch Feedback** - Active states on mobile for buttons and cards
- **Hover Effects** - Cards lift on hover with border color change
- **Button Ripples** - Subtle ripple effect on button clicks
- **Toast Animations** - Slide-in effect for notifications

### Technical
- Added CSS micro-interactions and polish layer
- Implemented `updatePendingMusterBadge()` for real-time badge updates
- Added `setupScrollDetection()` for header shadow on scroll
- Respects `prefers-reduced-motion` for accessibility
- Service worker version bumped to 1.3.0

---

## [1.2.0] - 2025-12-31

### Added
- **Bottom Navigation Bar** - Fixed navigation with Roster, Sign In, Reports, and Settings tabs
- **Quick Sign-In** - Auto-selects next due muster when tapping Sign In tab
- **S1 Implementation Guide** - Comprehensive README section for unit deployment
- **Practical Workflow Documentation** - Daily, weekly, and turnover procedures

### Changed
- **Improved Navigation** - Clear visual hierarchy with persistent bottom nav
- **Streamlined UX** - Faster access to common tasks via bottom bar
- **Updated README** - S1-focused implementation guide with setup options

### Technical
- Added `showQuickSignIn()` method for intelligent muster selection
- Bottom nav active state updates with view changes
- Form view hides bottom nav for cleaner editing experience
- Service worker version bumped to 1.2.0

---

## [1.1.0] - 2025-12-31

### Added
- **Welcome Modal** - First-run experience with option to load demo data
- **Demo Mode** - Sample restrictees and muster data for training/evaluation
- **Data Export** - Download all app data as JSON backup file
- **Data Import** - Restore data from previously exported JSON file
- **Keyboard Shortcuts** - Full keyboard navigation for power users
  - `N` - Add new person
  - `R` - Go to roster view
  - `S` - Open settings
  - `T` - Toggle theme
  - `?` - Show keyboard shortcuts
  - `Esc` - Close modal / Go back
- **Help Modal** - In-app keyboard shortcuts reference
- **Offline Indicator** - Visual notification when app goes offline
- **SEO Files** - robots.txt and sitemap.xml for search engines

### Changed
- **Bundled jsPDF Locally** - PDF generation now works fully offline (no CDN dependency)
- **Enhanced Service Worker** - Improved cache-first strategy with version management
- **Updated README** - Comprehensive documentation with FAQ, keyboard shortcuts, and usage guide
- **Better Settings Panel** - Added export/import buttons and help link

### Technical
- Service worker version bumped to 1.1.0
- Added preload hints for critical resources
- Added Open Graph meta tags for better link previews
- Improved modal management system
- Added CSS animations (fadeIn, pulse, spin)
- Added kbd element styling for keyboard shortcuts display

---

## [1.0.0] - 2025-12-31

### Added
- Initial release of Restriction Tracker
- Roster management for personnel on restriction, EPD, or correctional custody
- Configurable muster times per person (standard + custom times)
- One-tap sign-in interface with large mobile-friendly buttons
- Status options: Present, Late, Missed, Excused
- Automatic timestamp logging for all musters
- Notes field for late/missed/excused entries
- Days remaining counter with automatic calculation
- Visual status indicators (icons and colors)
- Muster alert system showing upcoming and overdue musters
- Individual log view with history grouped by date
- Daily report view with all restrictees
- PDF export for daily logs
- PDF export for individual restriction history
- Settings panel for unit name and default recorder
- Theme support: Light, Dark, and Night (Tactical red-on-black)
- PWA with service worker for offline functionality
- LocalStorage persistence for all data
- Completed restrictions archive section
- Print-friendly report format
- Responsive design optimized for mobile devices
- Full accessibility support (keyboard navigation, ARIA labels)

### Technical
- Pure vanilla JavaScript implementation (no frameworks)
- Follows USMC Tools shared design system
- jsPDF integration for PDF generation
- UUID generation for unique record IDs
- Comprehensive date/time utility functions
- Modular code architecture

---

*Part of the USMC Admin Tools Suite*
