import { getUnlabelledLatestAlerts } from './alerts';

const mockGet = vi.hoisted(() => vi.fn());

vi.mock('./axios', () => ({
  apiInstance: {
    get: mockGet,
  },
}));

describe('alerts service', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUnlabelledLatestAlerts', () => {
    it('should pass pagination parameters to the API', async () => {
      await getUnlabelledLatestAlerts(100, 200);

      expect(mockGet).toHaveBeenCalledWith('/api/v1/alerts/unlabeled/latest', {
        params: { limit: 100, offset: 200 },
      });
    });
  });
});
