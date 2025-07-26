import { useEffect, useState } from 'react';

/*
 * Use this function when a component should be rerendered every X seconds.
 * Simply add useRefreshEvery(60) to have your component be refreshed every minute
 */
export const useRefreshEvery = (timeInSeconds: number): number => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, timeInSeconds * 1000);

    return () => clearInterval(interval);
  }, [timeInSeconds]);

  return tick;
};
