import moment from 'moment-timezone';
import { vi } from 'vitest';

import { providersWrapper } from '../test/renderWithProviders';
import {
  formatNbToTime,
  formatTimeAgo,
  formatToDate,
  formatToDateTime,
  formatToTime,
  isDateWithinTheLastXMinutes,
  isStrictlyAfter,
} from './dates';

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

describe('formatToDate', () => {
  it('should return empty if date is null', () => {
    const result = formatToDate(null);
    expect(result).toBe('');
  });
  it('should return the right format and the right UTC if date is in winter time', () => {
    const result = formatToDate('2025-02-25T09:37:03.172325');
    expect(result).toBe('25/02/2025');
  });
  it('should return the right format and the right UTC if date is in summertime', () => {
    const result = formatToDate('2025-07-25T09:37:03.172325');
    expect(result).toBe('25/07/2025');
  });
  it('should return the right format and the right UTC if date is in winter time close to next day', () => {
    const result = formatToDate('2025-02-25T23:37:03.172325');
    expect(result).toBe('26/02/2025');
  });
  it('should return the right format and the right UTC if date is in summertime  close to next day', () => {
    const result = formatToDate('2025-07-25T22:37:03.172325');
    expect(result).toBe('26/07/2025');
  });
});

describe('formatToTime', () => {
  it('should return empty if date is null', () => {
    const result = formatToTime(null);
    expect(result).toBe('');
  });
  it('should return the right format and the right UTC if date is in winter time', () => {
    const result = formatToTime('2025-02-25T09:37:03.172325');
    expect(result).toBe('10:37:03');
  });
  it('should return the right format and the right UTC if date is in summertime', () => {
    const result = formatToTime('2025-07-25T09:37:03.172325');
    expect(result).toBe('11:37:03');
  });
  it('should return the right format and the right UTC if date is in winter time close to next day', () => {
    const result = formatToTime('2025-02-25T23:37:03.172325');
    expect(result).toBe('00:37:03');
  });
  it('should return the right format and the right UTC if date is in summertime  close to next day', () => {
    const result = formatToTime('2025-07-25T22:37:03.172325');
    expect(result).toBe('00:37:03');
  });
});

describe('formatNbToTime', () => {
  it('should return the right format and the right UTC if date is in winter time', () => {
    const result = formatNbToTime(1740476223000); //2025-02-25T09:37:03
    expect(result).toBe('10:37:03');
  });
  it('should return the right format and the right UTC if date is in summertime', () => {
    const result = formatNbToTime(1753436223000); //2025-07-25T09:37:03
    expect(result).toBe('11:37:03');
  });
  it('should return the right format and the right UTC if date is in winter time close to next day', () => {
    const result = formatNbToTime(1740526623000); //2025-02-25T23:37:03
    expect(result).toBe('00:37:03');
  });
  it('should return the right format and the right UTC if date is in summertime  close to next day', () => {
    const result = formatNbToTime(1753483023000); //2025-07-25T22:37:03
    expect(result).toBe('00:37:03');
  });
});

describe('isStrictlyAfter', () => {
  it('should return false if dates are equals', () => {
    const result = isStrictlyAfter(
      '2025-02-25T09:37:03.172325',
      '2025-02-25T09:37:03.172325'
    );
    expect(result).toBeFalsy();
  });
  it('should return true if date2 is 30s after', () => {
    const result = isStrictlyAfter(
      '2025-02-25T09:37:03.172325',
      '2025-02-25T09:37:33.172325'
    );
    expect(result).toBeTruthy();
  });
  it('should return true if date2 is 30s before', () => {
    const result = isStrictlyAfter(
      '2025-02-25T23:36:33.172325',
      '2025-02-25T09:37:03.172325'
    );
    expect(result).toBeFalsy();
  });
});

import { renderHook } from '@testing-library/react';

const getPastDateString = ({
  minutes = 0,
  hours = 0,
  days = 0,
}: {
  minutes?: number;
  hours?: number;
  days?: number;
}) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  date.setHours(date.getHours() - hours);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const translationFunction = (s: string) => s;

describe('formatTimeAgo', () => {
  it('returns empty string if input is null', () => {
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: null, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toBe('');
  });

  it('returns correct minutes string', () => {
    const dateStr = getPastDateString({ minutes: 5 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('5 minutes');
  });

  it('returns correct singular minute string', () => {
    const dateStr = getPastDateString({ minutes: 1 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('1 minute');
  });

  it('returns correct hours string', () => {
    const dateStr = getPastDateString({ hours: 3 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('3 hours');
  });

  it('returns correct singular hour string', () => {
    const dateStr = getPastDateString({ hours: 1, minutes: 59 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('1 hour');
  });

  it('returns correct days string', () => {
    const dateStr = getPastDateString({ days: 2, hours: 0, minutes: 56 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('2 days');
  });

  it('returns correct singular day string', () => {
    const dateStr = getPastDateString({ days: 1 });
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('1 day');
  });

  it('returns now if less than a minute', () => {
    const dateStr = new Date().toISOString();
    const { result } = renderHook(
      () => formatTimeAgo({ pastDateString: dateStr, translationFunction }),
      {
        wrapper: providersWrapper,
      }
    );
    expect(result.current).toEqual('now');
  });
});
