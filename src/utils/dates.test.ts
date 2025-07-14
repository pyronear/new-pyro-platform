import moment from 'moment-timezone';
import { vi } from 'vitest';

import { formatToDateTime, isDateWithinTheLastXMinutes } from './dates';

vi.mock('moment-timezone', async (importOriginal) => {
  const mod = await importOriginal<typeof moment>();
  mod.tz.guess = () => 'Europe/Paris';
  return mod;
});

describe('isDateWithinTheLastXMinutes', () => {
  it('should return false if date is null', () => {
    const result = isDateWithinTheLastXMinutes(null, 20);
    expect(result).toBeFalsy();
  });
  it('should return false if date is in the past', () => {
    const result = isDateWithinTheLastXMinutes(
      '2025-02-25T09:37:03.172325',
      20
    );
    expect(result).toBeFalsy();
  });
  it('should return true if date is within 20min', () => {
    const date10minutesAgo = moment().subtract(10, 'minutes');
    const result = isDateWithinTheLastXMinutes(
      date10minutesAgo.format('YYYY-MM-DDTHH:mm:ss.SSSSSS'),
      20
    );
    expect(result).toBeTruthy();
  });
});

describe('formatToDateTime', () => {
  it('should return empty if date is null', () => {
    const result = formatToDateTime(null);
    expect(result).toBe('');
  });
  it('should return the right format and the right UTC if date is in winter time', () => {
    const result = formatToDateTime('2025-02-25T09:37:03.172325');
    expect(result).toBe('25/02/2025 10:37:03');
  });
  it('should return the right format and the right UTC if date is in summertime', () => {
    const result = formatToDateTime('2025-07-25T09:37:03.172325');
    expect(result).toBe('25/07/2025 11:37:03');
  });
});
