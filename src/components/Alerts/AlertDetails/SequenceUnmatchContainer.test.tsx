import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { unmatchSequenceFromAlert } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';

import TestProviders from '../../../test/TestProviders';
import { SequenceUnmatchContainer } from './SequenceUnmatchContainer';

vi.mock('@/services/alerts', () => ({
  unmatchSequenceFromAlert: vi.fn(),
}));

const createSequence = (id: number): SequenceWithCameraInfoType => ({
  id,
  poseId: null,
  camera: null,
  startedAt: null,
  lastSeenAt: null,
  azimuth: 0,
  coneAngle: 0,
  labelWildfire: null,
});

const renderContainer = (
  sequences = [createSequence(1), createSequence(2)]
) => {
  const invalidateAndRefreshData = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <TestProviders>
        <SequenceUnmatchContainer
          alert={{ id: 42, startedAt: null, sequences }}
          sequence={sequences[0]}
          invalidateAndRefreshData={invalidateAndRefreshData}
        />
      </TestProviders>
    </QueryClientProvider>
  );

  return { invalidateAndRefreshData };
};

describe('SequenceUnmatchContainer', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('hides the control when the alert has only one sequence', () => {
    renderContainer([createSequence(1)]);

    expect(
      screen.queryByRole('button', { name: /unmatch sequence/i })
    ).not.toBeInTheDocument();
  });

  it('unmatches the selected sequence and refreshes the alert', async () => {
    vi.mocked(unmatchSequenceFromAlert).mockResolvedValue(true);
    const { invalidateAndRefreshData } = renderContainer();

    fireEvent.click(screen.getByRole('button', { name: /unmatch sequence/i }));
    fireEvent.click(screen.getByRole('button', { name: /^unmatch$/i }));

    await waitFor(() => {
      expect(unmatchSequenceFromAlert).toHaveBeenCalledWith(1, 42);
      expect(invalidateAndRefreshData).toHaveBeenCalledOnce();
    });

    expect(await screen.findByText('Sequence unmatched')).toBeInTheDocument();
  });

  it('shows an error when the request fails', async () => {
    vi.mocked(unmatchSequenceFromAlert).mockRejectedValue(new Error('failure'));
    renderContainer();

    fireEvent.click(screen.getByRole('button', { name: /unmatch sequence/i }));
    fireEvent.click(screen.getByRole('button', { name: /^unmatch$/i }));

    expect(
      await screen.findByText(
        'Unable to unmatch the sequence. Please try again.'
      )
    ).toBeInTheDocument();
  });
});
