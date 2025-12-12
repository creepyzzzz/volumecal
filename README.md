# Volume Calculator - Civil Construction

A professional Progressive Web App (PWA) for calculating volumes of Wire Crates (Gabions) and DRSM (Dry Rubble Stone Masonry) used in river protection works.

## Features

- **Dynamic Data Table**: Add, delete, and manage multiple measurement rows
- **Smart Input Handling**: Spacebar shortcut to insert `+` symbol in Height and Top fields
- **Automatic Calculations**: Real-time volume calculations in both cubic feet (ft³) and cubic meters (m³)
- **Feet/Inches Parser**: Handles decimal notation (e.g., 5.6 = 5 feet 6 inches)
- **Engineering Averaging Rules**: Implements specific rules for calculating averages from multiple readings
- **Auto-Save**: Automatically saves all data to localStorage on every keystroke
- **PDF Export**: Generate professional measurement book style PDF reports
- **PWA Support**: Installable as a web app on mobile devices
- **Mobile-Optimized**: Perfect responsive design for on-site mobile use

## Tech Stack

- **React** (Vite)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **jsPDF** + **jspdf-autotable** for PDF generation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

### Input Format

- **Length & Bed**: Enter in feet.inches format (e.g., `5.6` = 5 feet 6 inches)
- **Height & Top**: Enter multiple readings separated by `+` (e.g., `5+5+5` or `4.6+5+5`)
  - Press **Spacebar** in these fields to quickly insert a `+` symbol

### Calculation Rules

The app uses specific engineering rules for averaging readings:

- **Rule A (Uniform)**: If all 3 readings are equal (e.g., 5+5+5) → Result is that value
- **Rule B (One Variation)**: If 2 are equal and 1 is different (e.g., 4+5+5) → Average of different and same: (4+5)/2 = 4.5
- **Rule C (Irregular)**: If all 3 are different → Average all three

### Volume Calculation

- **Calculated Width** = (Calculated Top + Bed Width) / 2
- **Volume (ft³)** = Length × Calculated Height × Calculated Width
- **Volume (m³)** = Volume (ft³) / 35.315

## PWA Installation

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"

## Data Persistence

All data is automatically saved to browser localStorage. When you reopen the app, your previous work will be restored automatically.

## PDF Export

Click the "Export PDF" button to generate a professional measurement book style report with:
- Work details (Name, Site Location, Work Type, Date)
- Complete measurement table
- Grand totals in both ft³ and m³

## Deployment

This app is optimized for deployment on Netlify. Simply connect your GitHub repository and deploy.

## License

This project is for civil construction measurement purposes.
