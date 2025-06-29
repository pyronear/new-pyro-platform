import { useQuery } from '@tanstack/react-query';

export const AlertsPage = () => {
  const data = useQuery({
    queryKey: ['detections'],
    retry: false,
  });
  return <>{JSON.stringify(data, null, 2)}</>;
};
