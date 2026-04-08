import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
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

type PendingDeletion =
  | null
  | { type: 'single'; maskId: number }
  | { type: 'all'; poseId: number };

export const DashboardOcclusionMaskModal = ({
  open,
  onClose,
  camera,
}: DashboardOcclusionMaskModalProps) => {
  const { t } = useTranslationPrefix('dashboard.occlusionMask');
  const queryClient = useQueryClient();
  const poses = camera.poses ?? [];
  const title = t('title', { cameraName: camera.name });

  const [selectedPoseId, setSelectedPoseId] = useState<number | null>(
    poses[0]?.id ?? null
  );
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion>(null);

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
      setPendingDeletion(null);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: (poseId: number) => deleteAllOcclusionMasksByPose(poseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['occlusionMasks', selectedPoseId],
      });
      setPendingDeletion(null);
    },
  });

  const imageUrl = poseData?.image_url;
  const isDeleting =
    deleteMaskMutation.isPending || deleteAllMutation.isPending;

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setPendingDeletion(null);
  };

  const handleConfirmDeletion = () => {
    if (pendingDeletion === null) return;

    if (pendingDeletion.type === 'single') {
      deleteMaskMutation.mutate(pendingDeletion.maskId);
      return;
    }

    deleteAllMutation.mutate(pendingDeletion.poseId);
  };

  if (poses.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Alert severity="info" sx={{ margin: 0 }}>
            <Typography textAlign="start">{t('infoText')}</Typography>
          </Alert>

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
                      onClick={() =>
                        setPendingDeletion({
                          type: 'single',
                          maskId: mask.maskId,
                        })
                      }
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
                    <Typography color="text.secondary">
                      {t('noImage')}
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>

            <Grid size={3}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">{t('selectPose')}</Typography>
                <ButtonGroup
                  orientation="vertical"
                  variant="outlined"
                  fullWidth
                >
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
                          setPendingDeletion({
                            type: 'all',
                            poseId: selectedPoseId,
                          });
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('closeButton')}</Button>
      </DialogActions>

      <Dialog
        open={pendingDeletion !== null}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={isDeleting}
      >
        <DialogTitle>
          {pendingDeletion?.type === 'single'
            ? t('deleteSingleTitle')
            : t('deleteAllTitle')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography color="text.secondary">
            {pendingDeletion?.type === 'single'
              ? t('deleteSingleMessage')
              : t('deleteAllMessage')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            {t('cancelButton')}
          </Button>
          <Button
            onClick={handleConfirmDeletion}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {t('confirmDeleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
