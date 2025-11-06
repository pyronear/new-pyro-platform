import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PreferencesProvider } from '@/context/PreferencesProvider';
import { getUserPreferences } from '@/utils/preferences';

import { PreferencesMenu } from './PreferencesMenu';

describe('PreferencesMenu', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render all preference options when open', () => {
    const anchorEl = document.createElement('button');
    render(
      <PreferencesProvider>
        <PreferencesMenu anchorEl={anchorEl} onClose={vi.fn()} />
      </PreferencesProvider>
    );

    expect(screen.getByText(/english/i)).toBeInTheDocument();
    expect(screen.getByText(/français/i)).toBeInTheDocument();
    expect(screen.getByText(/español/i)).toBeInTheDocument();
    expect(screen.getByText(/openstreetmap/i)).toBeInTheDocument();
    expect(screen.getByText(/audio alerts/i)).toBeInTheDocument();
  });

  it('should update audio alerts preference', () => {
    const anchorEl = document.createElement('button');
    render(
      <PreferencesProvider>
        <PreferencesMenu anchorEl={anchorEl} onClose={vi.fn()} />
      </PreferencesProvider>
    );

    const audioSwitch = screen.getByLabelText(/audio alerts/i);
    fireEvent.click(audioSwitch);

    const savedPreferences = getUserPreferences();
    expect(savedPreferences?.audio.alertsEnabled).toBe(true);
  });

  it('should not render when anchorEl is null', () => {
    render(
      <PreferencesProvider>
        <PreferencesMenu anchorEl={null} onClose={vi.fn()} />
      </PreferencesProvider>
    );

    expect(screen.queryByText(/english/i)).not.toBeInTheDocument();
  });

  it('should close menu when language is selected', () => {
    const anchorEl = document.createElement('button');
    const onClose = vi.fn();
    render(
      <PreferencesProvider>
        <PreferencesMenu anchorEl={anchorEl} onClose={onClose} />
      </PreferencesProvider>
    );

    const frenchOption = screen.getByText(/français/i);
    fireEvent.click(frenchOption);

    expect(onClose).toHaveBeenCalled();
    const savedPreferences = getUserPreferences();
    expect(savedPreferences?.language).toBe('fr');
  });

  it('should close menu when map layer is selected', () => {
    const anchorEl = document.createElement('button');
    const onClose = vi.fn();
    render(
      <PreferencesProvider>
        <PreferencesMenu anchorEl={anchorEl} onClose={onClose} />
      </PreferencesProvider>
    );

    const osmOption = screen.getByText(/openstreetmap/i);
    fireEvent.click(osmOption);

    expect(onClose).toHaveBeenCalled();
    const savedPreferences = getUserPreferences();
    expect(savedPreferences?.map.baseLayer).toBe('osm');
  });
});
