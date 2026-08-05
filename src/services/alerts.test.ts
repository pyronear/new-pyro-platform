import { getDetectionsBySequence } from './alerts';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('./axios', () => ({
  apiInstance: {
    get: mockGet,
  },
}));

const detection = (id: number, createdAt: string, recordedAt: string) => ({
  id,
  camera_id: 10,
  pose_id: 20,
  sequence_id: 30,
  bucket_key: `detection-${id}`,
  bbox: '[]',
  others_bboxes: null,
  created_at: createdAt,
  recorded_at: recordedAt,
  url: `https://example.com/detection-${id}.jpg`,
  crop_url: null,
});

describe('getDetectionsBySequence', () => {
  it('orders detections by their capture time and preserves it', async () => {
    mockGet.mockResolvedValue({
      data: [
        detection(1, '2026-07-01T10:00:00', '2026-07-01T10:00:20'),
        detection(2, '2026-07-01T10:00:10', '2026-07-01T10:00:05'),
      ],
    });

    const result = await getDetectionsBySequence(30);

    expect(result.map(({ id }) => id)).toEqual([2, 1]);
    expect(result.map((item) => item.recorded_at)).toEqual([
      '2026-07-01T10:00:05',
      '2026-07-01T10:00:20',
    ]);
  });
});
