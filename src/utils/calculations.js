/**
 * Parse feet.inches notation to decimal feet
 * Examples:
 * - 5.6 = 5 feet 6 inches = 5.50 ft
 * - 5.10 = 5 feet 10 inches = 5.83 ft
 * - 5 = 5.00 ft
 */
export function parseFeetInches(value) {
  if (!value || value === '') return 0;
  
  const str = String(value).trim();
  const parts = str.split('.');
  
  if (parts.length === 1) {
    // Just feet, no inches
    return parseFloat(parts[0]) || 0;
  }
  
  const feet = parseFloat(parts[0]) || 0;
  const inches = parseFloat(parts[1]) || 0;
  
  // Convert inches to decimal feet (divide by 12)
  return feet + (inches / 12);
}

/**
 * Parse a string of readings separated by +
 * Example: "5+5+5" or "4.6+5+5"
 */
export function parseReadings(input) {
  if (!input || input === '') return [];
  
  return input
    .split('+')
    .map(reading => reading.trim())
    .filter(reading => reading !== '')
    .map(reading => parseFeetInches(reading));
}

/**
 * Calculate average based on engineering rules:
 * Rule A (Uniform): All 3 equal → return that value
 * Rule B (One Variation): 2 equal, 1 different → (different + same) / 2
 * Rule C (Irregular): All 3 different → average all three
 */
export function calculateAverage(readings) {
  if (!readings || readings.length === 0) return 0;
  if (readings.length === 1) return readings[0];
  
  // Filter out invalid values
  const validReadings = readings.filter(r => !isNaN(r) && isFinite(r));
  if (validReadings.length === 0) return 0;
  
  // If less than 3 readings, just average them
  if (validReadings.length < 3) {
    const sum = validReadings.reduce((a, b) => a + b, 0);
    return sum / validReadings.length;
  }
  
  // Take first 3 readings
  const [a, b, c] = validReadings.slice(0, 3);
  
  // Rule A: All equal
  if (a === b && b === c) {
    return a;
  }
  
  // Rule B: Two equal, one different
  if (a === b && a !== c) {
    return (a + c) / 2;
  }
  if (a === c && a !== b) {
    return (a + b) / 2;
  }
  if (b === c && b !== a) {
    return (a + b) / 2;
  }
  
  // Rule C: All different - average all three
  return (a + b + c) / 3;
}

/**
 * Calculate volume for a single row
 * @param {number} length - Length in feet
 * @param {string} heightReadings - Height readings string (e.g., "5+5+5")
 * @param {string} topReadings - Top readings string (e.g., "4+5+5")
 * @param {number} bedWidth - Bed width in feet
 * @returns {Object} { volFt3, volM3 }
 */
export function calculateVolume(length, heightReadings, topReadings, bedWidth) {
  // Parse inputs
  const lengthFt = parseFeetInches(length) || 0;
  const bedWidthFt = parseFeetInches(bedWidth) || 0;
  
  // Parse and calculate averages
  const heightValues = parseReadings(heightReadings);
  const topValues = parseReadings(topReadings);
  
  const calculatedHeight = calculateAverage(heightValues);
  const calculatedTop = calculateAverage(topValues);
  
  // Calculate width: (Calculated_Top + Bed_Width) / 2
  const calculatedWidth = (calculatedTop + bedWidthFt) / 2;
  
  // Calculate volume in cubic feet
  const volFt3 = lengthFt * calculatedHeight * calculatedWidth;
  
  // Convert to cubic meters: 1 m³ = 35.315 ft³
  const volM3 = volFt3 / 35.315;
  
  return {
    volFt3: isNaN(volFt3) || !isFinite(volFt3) ? 0 : volFt3,
    volM3: isNaN(volM3) || !isFinite(volM3) ? 0 : volM3,
  };
}

/**
 * Format number to specified decimal places
 */
export function formatNumber(num, decimals = 2) {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return parseFloat(num.toFixed(decimals));
}

