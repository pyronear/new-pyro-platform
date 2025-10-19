import { use } from 'react';

import { ActionsOnCameraContext } from './ActionsOnCameraContext';

export const useActionsOnCamera = () => {
  const context = use(ActionsOnCameraContext);
  if (!context)
    throw new Error(
      'useActionsOnCamera must be used within an ActionsOnCameraContext'
    );
  return context;
};
