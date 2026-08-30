import { expect } from 'vitest';

import type { CameraType } from '@/services/camera.ts';
import { buildSitesList } from '@/utils/sites.ts';

const createACamera = (id: number, name: string): CameraType => {
  return {
    id: id,
    organization_id: 0,
    name: name,
    angle_of_view: null,
    elevation: null,
    lat: 0,
    lon: 0,
    is_trustable: false,
    last_active_at: null,
    last_image: null,
    last_image_url: null,
    created_at: null,
    poses: [],
  };
};

describe('buildSitesList', () => {
  it('should return cameraList group by prefixe', () => {
    // given
    const cameraList = [
      createACamera(1, 'azerty-01'),
      createACamera(2, 'ytre-za-01'),
      createACamera(3, 'ytre-za-02'),
      createACamera(4, 'azerty-02'),
      createACamera(5, 'last-one-1'),
    ];
    // when
    const sites = buildSitesList(cameraList);

    // then
    expect(sites).toHaveLength(3);
    expect(sites).toEqual([
      { id: 'azerty', cameras: [cameraList[0], cameraList[3]] },
      { id: 'ytre-za', cameras: [cameraList[1], cameraList[2]] },
      { id: 'last-one', cameras: [cameraList[4]] },
    ]);
  });
});
