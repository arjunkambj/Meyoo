/**
 * Money utility functions for handling monetary values
 * Ensures all monetary values are stored with exactly 2 decimal places
 */

/**
 * Rounds a monetary value to 2 decimal places
 * Uses Math.round to avoid floating point precision issues
 *
 * @param value - The numeric value to round
 * @returns The value rounded to 2 decimal places
 *
 * @example
 * roundMoney(10.999) // returns 11.00
 * roundMoney(10.554) // returns 10.55
 * roundMoney(10.555) // returns 10.56
 */
export const roundMoney = (value: number | undefined | null): number => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 0;
  }

  return Math.round(value * 100) / 100;
};

/**
 * Safely parses a string to a monetary value with 2 decimal places
 *
 * @param value - The string value to parse
 * @param defaultValue - Default value if parsing fails (default: 0)
 * @returns Parsed and rounded monetary value
 */
export const parseMoney = (
  value: string | undefined | null,
  defaultValue: number = 0,
): number => {
  if (!value) return defaultValue;

  const parsed = parseFloat(value);

  if (Number.isNaN(parsed)) return defaultValue;

  return roundMoney(parsed);
};
