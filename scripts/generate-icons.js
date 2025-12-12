// Simple script to generate PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Simple SVG icon template
const iconSvg = `<svg width="{size}" height="{size}" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#10b981"/>
  <path d="M96 48C72 48 48 72 48 96C48 120 72 144 96 144C120 144 144 120 144 96C144 72 120 48 96 48ZM96 132C78 132 60 114 60 96C60 78 78 60 96 60C114 60 132 78 132 96C132 114 114 132 96 132Z" fill="white"/>
  <path d="M96 72V96L120 108" stroke="white" stroke-width="4" stroke-linecap="round"/>
</svg>`;

// For now, we'll use SVG files which modern browsers support
// In production, these should be converted to PNG
const sizes = [192, 512];

sizes.forEach(size => {
  const svg = iconSvg.replace(/{size}/g, size);
  const filename = `icon-${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`Created ${filename}`);
});

// Also create PNG placeholder (will need actual PNG conversion in production)
console.log('\nNote: For production, convert SVG icons to PNG format.');
console.log('You can use online tools or ImageMagick to convert SVG to PNG.');

