import { act, renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import { PreferencesProvider } from '@/context/PreferencesProvider';
import { getUserPreferences } from '@/services/preferences';

import { useMapLayers } from './useMapLayers';

const wrapper = ({ children }: { children: ReactNode }) => (
  <PreferencesProvider>{children}</PreferencesProvider>
);

describe('useMapLayers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should persist overlay toggles', () => {
    const { result } = renderHook(() => useMapLayers(), { wrapper });

    act(() => {
      result.current.updateOverlay('dfci', true);
    });

    expect(result.current.overlays).toEqual({ dfci: true, onfForest: false });
    expect(getUserPreferences()?.map.overlays).toEqual({
      dfci: true,
      onfForest: false,
    });
  });

  it('should keep overlays when changing the base layer', () => {
    const { result } = renderHook(() => useMapLayers(), { wrapper });

    act(() => {
      result.current.updateOverlay('onfForest', true);
    });
    act(() => {
      result.current.updateBaseLayer('satellite');
    });

    expect(result.current.baseLayer).toBe('satellite');
    expect(result.current.overlays.onfForest).toBe(true);
  });

  it('should keep the base layer and other overlays when toggling an overlay', () => {
    const { result } = renderHook(() => useMapLayers(), { wrapper });

    act(() => {
      result.current.updateBaseLayer('ign');
    });
    act(() => {
      result.current.updateOverlay('dfci', true);
    });
    act(() => {
      result.current.updateOverlay('onfForest', true);
    });

    expect(result.current.baseLayer).toBe('ign');
    expect(result.current.overlays).toEqual({ dfci: true, onfForest: true });
  });
});
