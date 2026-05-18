import { exportAlertsCsv } from './alerts';

const mockGet = vi.hoisted(() => vi.fn());

vi.mock('./axios', () => ({
  apiInstance: {
    get: mockGet,
  },
}));

describe('alerts service', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: new Blob() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('exportAlertsCsv', () => {
    it('should call the export endpoint with date range params', async () => {
      await exportAlertsCsv('2026-05-01', '2026-05-03');

      expect(mockGet).toHaveBeenCalledWith('/api/v1/alerts/export', {
        params: {
          from_date: '2026-05-01',
          to_date: '2026-05-03',
        },
        responseType: 'blob',
      });
    });
  });
});
