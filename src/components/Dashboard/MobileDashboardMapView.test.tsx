import { fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import type { CameraType } from '../../services/camera';
import { MobileDashboardMapView } from './MobileDashboardMapView';

vi.mock('../../utils/useTranslationPrefix', () => ({
  useTranslationPrefix: () => ({
    t: (key: string) => `translated-${key}`,
  }),
}));

vi.mock('./CameraCard/CameraCard', () => ({
  CameraCard: ({
    camera,
    setSelected,
  }: {
    camera: CameraType;
    setSelected: () => void;
  }) => (
    <button type="button" onClick={setSelected}>
      {camera.name}
    </button>
  ),
}));

vi.mock('./CamerasMap', () => ({
  default: ({
    onClickOnMarker,
  }: {
    onClickOnMarker: (cameraId: number) => void;
  }) => (
    <button type="button" onClick={() => onClickOnMarker(1)}>
      Select camera on map
    </button>
  ),
}));

const camera = {
  id: 1,
  organization_id: 1,
  name: 'Camera one',
  angle_of_view: 30,
  elevation: 100,
  lat: 45,
  lon: 2,
  is_trustable: true,
  last_active_at: null,
  last_image: null,
  last_image_url: null,
  created_at: null,
  poses: [],
} satisfies CameraType;

const renderMobileMapView = () => {
  const onSelectCamera = vi.fn();
  const markerRefs = { current: new Map() };
  const cardRefs = { current: new Map() };

  render(
    <MobileDashboardMapView
      cameraList={[camera]}
      selectedCameraId={null}
      setMapRef={vi.fn()}
      markerRefs={markerRefs}
      cardRefs={cardRefs}
      onSelectCamera={onSelectCamera}
    />
  );

  const handle = screen.getByRole('button', {
    name: 'translated-drawerResizeLabel',
  });
  const drawer = handle.parentElement;
  const mapContainer = drawer?.parentElement;

  if (drawer === null || mapContainer === null) {
    throw new Error('Mobile drawer was not rendered');
  }

  Object.defineProperty(mapContainer, 'clientHeight', {
    configurable: true,
    value: 600,
  });

  return { drawer, handle, onSelectCamera };
};

const pointerCaptureDescriptors = {
  has: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'hasPointerCapture'
  ),
  release: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'releasePointerCapture'
  ),
  set: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'setPointerCapture'
  ),
};

beforeAll(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});

afterAll(() => {
  Object.entries(pointerCaptureDescriptors).forEach(([method, descriptor]) => {
    if (descriptor === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, `${method}PointerCapture`);
      return;
    }

    Object.defineProperty(
      HTMLElement.prototype,
      `${method}PointerCapture`,
      descriptor
    );
  });
});

describe('MobileDashboardMapView', () => {
  it('cycles through CSS-controlled drawer positions', () => {
    const { drawer, handle } = renderMobileMapView();

    expect(drawer).toHaveStyle({ height: '50%' });

    fireEvent.click(handle);
    expect(drawer).toHaveStyle({ height: 'calc(100% - 48px)' });

    fireEvent.click(handle);
    expect(drawer).toHaveStyle({ height: '64px' });
  });

  it('returns a small drag to the nearest snap position', () => {
    const { drawer, handle } = renderMobileMapView();

    fireEvent(
      handle,
      new MouseEvent('pointerdown', { bubbles: true, clientY: 400 })
    );
    fireEvent(
      handle,
      new MouseEvent('pointermove', { bubbles: true, clientY: 390 })
    );
    expect(drawer).toHaveStyle({ height: '310px' });

    fireEvent(
      handle,
      new MouseEvent('pointerup', { bubbles: true, clientY: 390 })
    );
    expect(drawer).toHaveStyle({ height: '50%' });
  });

  it('does not discard the next tap after a cancelled drag', () => {
    const { drawer, handle } = renderMobileMapView();

    fireEvent(
      handle,
      new MouseEvent('pointerdown', { bubbles: true, clientY: 400 })
    );
    fireEvent(
      handle,
      new MouseEvent('pointermove', { bubbles: true, clientY: 390 })
    );
    fireEvent(
      handle,
      new MouseEvent('pointercancel', { bubbles: true, clientY: 390 })
    );

    fireEvent.click(handle);
    expect(drawer).toHaveStyle({ height: 'calc(100% - 48px)' });
  });

  it('opens the drawer to half-height when a map marker is selected from peek', () => {
    const { drawer, handle, onSelectCamera } = renderMobileMapView();

    fireEvent.click(handle);
    fireEvent.click(handle);
    expect(drawer).toHaveStyle({ height: '64px' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Select camera on map' })
    );

    expect(onSelectCamera).toHaveBeenCalledWith(camera.id);
    expect(drawer).toHaveStyle({ height: '50%' });
  });
});
