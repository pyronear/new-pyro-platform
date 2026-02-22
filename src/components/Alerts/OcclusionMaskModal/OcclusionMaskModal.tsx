import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDetectionsBySequence } from '@/services/alerts';
import {
  createOcclusionMask,
  deleteAllOcclusionMasksByPose,
  getOcclusionMasksByPose,
} from '@/services/occlusionMasks';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  type BboxType,
  enlargeBbox,
  formatBboxToApiMask,
  getHighestConfidenceBbox,
  getHighestConfidenceDetection,
  getNonOverlappingMasks,
} from '@/utils/occlusionMasks';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface BboxOverlayProps {
  bbox: BboxType;
  color: 'red' | 'green';
}

const BboxOverlay = ({ bbox, color }: BboxOverlayProps) => {
  const borderColor = color === 'red' ? '#f44336' : '#4caf50';
  const backgroundColor =
    color === 'red' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)';

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${bbox.xmin * 100}%`,
        top: `${bbox.ymin * 100}%`,
        width: `${(bbox.xmax - bbox.xmin) * 100}%`,
        height: `${(bbox.ymax - bbox.ymin) * 100}%`,
        border: `2px solid ${borderColor}`,
        backgroundColor,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    ></Box>
  );
};

interface OcclusionMaskModalProps {
  open: boolean;
  onClose: () => void;
  sequence: SequenceWithCameraInfoType;
}

export const OcclusionMaskModal = ({
  open,
  onClose,
  sequence,
}: OcclusionMaskModalProps) => {
  const { t } = useTranslationPrefix('alerts.occlusionMask');
  const queryClient = useQueryClient();

  // Query for detections data
  const {
    data: detectionsData = [],
    isLoading: isLoadingDetections,
    error: detectionsError,
  } = useQuery({
    queryKey: ['detections', sequence.id],
    queryFn: () => getDetectionsBySequence(sequence.id),
    enabled: open && !!sequence.id,
  });

  // Query for existing occlusion masks
  const { data: existingMasks = [], isLoading: isLoadingMasks } = useQuery({
    queryKey: ['occlusionMasks', sequence.poseId],
    queryFn: async () => {
      if (!sequence.poseId) return [];
      const masks = await getOcclusionMasksByPose(sequence.poseId);
      return getNonOverlappingMasks(masks);
    },
    enabled: open && !!sequence.poseId,
  });

  // Mutation for adding occlusion mask
  const addMaskMutation = useMutation({
    mutationFn: ({ poseId, bbox }: { poseId: number; bbox: BboxType }) =>
      createOcclusionMask(poseId, formatBboxToApiMask(bbox)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['occlusionMasks', sequence.poseId],
      });
      onClose();
    },
  });

  // Mutation for clearing all masks
  const clearMasksMutation = useMutation({
    mutationFn: ({ poseId }: { poseId: number }) =>
      deleteAllOcclusionMasksByPose(poseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['occlusionMasks', sequence.poseId],
      });
    },
  });

  // Derive highestDetection and proposedBbox from detectionsData
  const highestDetection = getHighestConfidenceDetection(detectionsData);
  const proposedBbox = highestDetection
    ? (() => {
        const highestBbox = getHighestConfidenceBbox(highestDetection);
        return highestBbox ? enlargeBbox(highestBbox, 0.1) : null;
      })()
    : null;

  const handleConfirmSelection = () => {
    if (!proposedBbox || !sequence.poseId) return;

    addMaskMutation.mutate({
      poseId: sequence.poseId,
      bbox: proposedBbox,
    });
  };

  const handleDeleteAll = () => {
    if (!sequence.poseId) return;

    clearMasksMutation.mutate({
      poseId: sequence.poseId,
    });
  };

  const imageUrl = highestDetection?.url ?? '';
  const isLoading = isLoadingDetections || isLoadingMasks;

  if (detectionsError) {
    console.error('Error loading detections:', detectionsError);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            minHeight: '70vh',
          },
        },
      }}
    >
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ margin: 0 }}>
          <Typography textAlign="start">{t('explanationText')}</Typography>
        </Alert>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('loading')}
            </Typography>
          </Box>
        ) : (
          imageUrl && (
            <Box
              position="relative"
              sx={{
                mt: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                display: 'inline-block',
                maxWidth: '100%',
              }}
            >
              <img
                src={imageUrl}
                alt={t('detectionImageAlt')}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />

              {/* Existing occlusion masks (red) */}
              {existingMasks.map((mask) => (
                <BboxOverlay
                  key={`mask-${mask.xmin}-${mask.ymin}-${mask.xmax}-${mask.ymax}`}
                  bbox={mask}
                  color="red"
                />
              ))}

              {/* Proposed new mask (green) */}
              {proposedBbox && (
                <BboxOverlay bbox={proposedBbox} color="green" />
              )}
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Stack spacing={1} justifyContent="space-between" direction="row">
          {existingMasks.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              color="error"
              variant="outlined"
              disabled={clearMasksMutation.isPending}
            >
              {clearMasksMutation.isPending
                ? t('deleting')
                : t('deleteAllButton')}
            </Button>
          )}
          <Stack spacing={1} direction="row">
            <Button onClick={onClose}>{t('cancelButton')}</Button>
            <Button
              onClick={handleConfirmSelection}
              variant="contained"
              disabled={!proposedBbox || addMaskMutation.isPending || isLoading}
            >
              {addMaskMutation.isPending ? t('adding') : t('confirmButton')}
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
