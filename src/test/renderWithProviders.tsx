import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';

import TestProviders from './TestProviders';

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: TestProviders, ...options });
};

export const providersWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <TestProviders>{children}</TestProviders>;
