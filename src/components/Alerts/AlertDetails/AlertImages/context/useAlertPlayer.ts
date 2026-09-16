import { use } from 'react';

import { AlertPlayerContext } from './AlertPlayerContext';

export const useAlertPlayer = () => {
  const context = use(AlertPlayerContext);
  if (!context)
    throw new Error('useAlertPlayer must be used within an AlertPlayer');
  return context;
};
