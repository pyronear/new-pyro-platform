import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';

import { BboxOverlay } from '@/components/Common/BboxOverlay';
import type { CameraType } from '@/services/camera';
import { getPoseById } from '@/services/camera';
import {
  deleteAllOcclusionMasksByPose,
  deleteOcclusionMask,
  getOcclusionMasksByPose,
} from '@/services/occlusionMasks';
import { getNonOverlappingMasksWithIds } from '@/utils/occlusionMasks';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface DashboardOcclusionMaskModalProps {
  open: boolean;
  onClose: () => void;
  camera: CameraType;
}

export const DashboardOcclusionMaskModal = ({
  open,
  onClose,
  camera,
}: DashboardOcclusionMaskModalProps) => {
  const { t } = useTranslationPrefix('dashboard.occlusionMask');
  const queryClient = useQueryClient();
  const poses = camera.poses ?? [];

  const [selectedPoseId, setSelectedPoseId] = useState<number | null>(
    poses[0]?.id ?? null
  );

  const { data: poseData } = useQuery({
    queryKey: ['poseImage', selectedPoseId],
    queryFn: () => {
      if (selectedPoseId === null) throw new Error('No pose selected');
      return getPoseById(selectedPoseId);
    },
    enabled: open && selectedPoseId !== null,
    placeholderData: keepPreviousData,
  });

  const { data: masks = [] } = useQuery({
    queryKey: ['occlusionMasks', selectedPoseId],
    queryFn: async () => {
      if (selectedPoseId === null) return [];
      const apiMasks = await getOcclusionMasksByPose(selectedPoseId);
      return getNonOverlappingMasksWithIds(apiMasks);
    },
    enabled: open && selectedPoseId !== null,
    placeholderData: keepPreviousData,
  });

  const deleteMaskMutation = useMutation({
    mutationFn: (maskId: number) => deleteOcclusionMask(maskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['occlusionMasks', selectedPoseId],
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: (poseId: number) => deleteAllOcclusionMasksByPose(poseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['occlusionMasks', selectedPoseId],
      });
    },
  });

  const imageUrl = poseData?.image_url;

  if (poses.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {camera.name} — {t('selectPose')}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{t('noPoses')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('closeButton')}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{camera.name}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={9}>
            {imageUrl ? (
              <Box
                position="relative"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <img
                  src={imageUrl}
                  alt={t('poseImageAlt')}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
                {masks.map((mask) => (
                  <BboxOverlay
                    key={mask.maskId}
                    bbox={mask}
                    color="red"
                    onClick={() => deleteMaskMutation.mutate(mask.maskId)}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 400,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                {poseData === undefined ? (
                  <CircularProgress />
                ) : (
                  <Typography color="text.secondary">{t('noImage')}</Typography>
                )}
              </Box>
            )}
          </Grid>

          <Grid size={3}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">{t('selectPose')}</Typography>
              <ButtonGroup orientation="vertical" variant="outlined" fullWidth>
                {poses.map((pose) => (
                  <Button
                    key={pose.id}
                    variant={
                      pose.id === selectedPoseId ? 'contained' : 'outlined'
                    }
                    onClick={() => setSelectedPoseId(pose.id)}
                  >
                    {pose.azimuth}°
                  </Button>
                ))}
              </ButtonGroup>

              <Divider />

              <Typography variant="body2" color="text.secondary">
                {masks.length > 0
                  ? t('masksCount', { count: masks.length })
                  : t('noMasks')}
              </Typography>

              {masks.length > 0 && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    {t('deleteHint')}
                  </Typography>
                  <Button
                    onClick={() => {
                      if (selectedPoseId !== null) {
                        deleteAllMutation.mutate(selectedPoseId);
                      }
                    }}
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    disabled={deleteAllMutation.isPending}
                  >
                    {t('deleteAllButton')}
                  </Button>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('closeButton')}</Button>
      </DialogActions>
    </Dialog>
  );
};
