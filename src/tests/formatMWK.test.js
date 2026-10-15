import { describe, it, expect } from 'vitest';
import { formatMWK } from '../utils/formatMWK';

describe('formatMWK helper', () => {
  it('formats numeric Malawi Kwacha currency correctly', () => {
    expect(formatMWK(65000)).toMatch(/MWK\s*65,000/);
    expect(formatMWK(120000)).toMatch(/MWK\s*120,000/);
  });

  it('formats with perMonth option', () => {
    expect(formatMWK(45000, { perMonth: true })).toMatch(/MWK\s*45,000\s*\/\s*month/);
  });

  it('formats compact representation correctly', () => {
    expect(formatMWK(85000, { compact: true })).toBe('MWK 85k');
  });

  it('handles zero and invalid inputs gracefully', () => {
    expect(formatMWK(0)).toMatch(/MWK\s*0/);
    expect(formatMWK(null)).toMatch(/MWK\s*0/);
  });
});
