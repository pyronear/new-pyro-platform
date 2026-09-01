import { renderHook } from '@testing-library/react';

import type { AlertTypeApi } from '@/services/alerts';

import { useDetectNewSequences } from './useDetectNewSequences';

const alertStartedAt = (startedAt: string): AlertTypeApi => ({
  id: 1,
  started_at: startedAt,
  sequences: [],
  organization_id: 0,
  lat: null,
  lon: null,
  last_seen_at: '',
});

const OLD_ALERT = alertStartedAt('2025-02-25T09:00:00');
const NEW_ALERT = alertStartedAt('2025-02-25T09:30:00');

const renderDetectNewSequences = (
  alertList: AlertTypeApi[],
  hasFetched: boolean
) =>
  renderHook(
    ({ alertList, hasFetched }) => useDetectNewSequences(alertList, hasFetched),
    { initialProps: { alertList, hasFetched } }
  );

describe('useDetectNewSequences', () => {
  it('should not report the alerts already present on the first fetch', () => {
    const { result } = renderDetectNewSequences([OLD_ALERT], true);
    expect(result.current.hasNewSequence).toBe(false);
  });

  it('should report an alert arriving after the first fetch', () => {
    const { result, rerender } = renderDetectNewSequences([OLD_ALERT], true);

    rerender({ alertList: [OLD_ALERT, NEW_ALERT], hasFetched: true });

    expect(result.current.hasNewSequence).toBe(true);
  });

  it('should not report the same alert twice on a later fetch', () => {
    const { result, rerender } = renderDetectNewSequences([OLD_ALERT], true);
    rerender({ alertList: [OLD_ALERT, NEW_ALERT], hasFetched: true });

    rerender({ alertList: [OLD_ALERT, NEW_ALERT], hasFetched: false });
    rerender({ alertList: [OLD_ALERT, NEW_ALERT], hasFetched: true });

    expect(result.current.hasNewSequence).toBe(false);
  });

  it('should not take a baseline from data fetched before the first success', () => {
    const { result, rerender } = renderDetectNewSequences([], false);

    rerender({ alertList: [OLD_ALERT], hasFetched: false });
    rerender({ alertList: [OLD_ALERT], hasFetched: true });

    expect(result.current.hasNewSequence).toBe(false);
  });

  it('should report an alert arriving while there was none', () => {
    const { result, rerender } = renderDetectNewSequences([], true);

    rerender({ alertList: [NEW_ALERT], hasFetched: true });

    expect(result.current.hasNewSequence).toBe(true);
  });

  it('should keep the baseline when the list empties, as it does past midnight', () => {
    const { result, rerender } = renderDetectNewSequences([NEW_ALERT], true);

    rerender({ alertList: [], hasFetched: true });
    rerender({ alertList: [OLD_ALERT], hasFetched: true });

    expect(result.current.hasNewSequence).toBe(false);
  });
});
