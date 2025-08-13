import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import type { SiteInfos } from './ControlAccessLiveContainer';

interface LiveContainerProps {
  status: ResponseStatus;
  sites: SiteInfos[];
}

export const LiveContainer = ({ status, sites }: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const [selectedSite, setSelectedSite] = useState<SiteInfos | null>(null);

  useEffect(() => {
    if (sites.length > 0) {
      setSelectedSite(sites[0]);
    }
  }, [sites]);

  return (
    <Box
      minHeight={200}
      minWidth={'80%'}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      {status == STATUS_ERROR && (
        <Typography variant="body2">{t('errorFetchInfos')}</Typography>
      )}
      {status == STATUS_LOADING && <Loader />}
      {status == STATUS_SUCCESS && sites.length == 0 && (
        <Typography variant="body2">{t('errorNoAccess')}</Typography>
      )}
      {status == STATUS_SUCCESS && sites.length != 0 && (
        <Grid container>
          <Grid size={8}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Grid>
          <Grid size={4}>Access: {selectedSite?.label}</Grid>
        </Grid>
      )}
    </Box>
  );
};
