import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDetectionsBySequence } from '@/services/alerts';
import {
  addOcclusionMask,
  clearOcclusionMasks,
  getOcclusionMasks,
} from '@/services/occlusionMasks';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  type BboxType,
  enlargeBbox,
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
    queryKey: [
      'occlusionMasks',
      sequence.camera?.name,
      sequence.camera?.angle_of_view,
    ],
    queryFn: () => {
      if (!sequence.camera?.name || sequence.camera.angle_of_view === null) {
        return [];
      }
      const masks = getOcclusionMasks(
        sequence.camera.name,
        sequence.camera.angle_of_view
      );
      return getNonOverlappingMasks(masks);
    },
    enabled:
      open && !!sequence.camera?.name && sequence.camera.angle_of_view !== null,
  });

  // Mutation for adding occlusion mask
  const addMaskMutation = useMutation({
    mutationFn: ({
      cameraName,
      angleOfView,
      bbox,
    }: {
      cameraName: string;
      angleOfView: number;
      bbox: BboxType;
    }) => {
      addOcclusionMask(cameraName, angleOfView, bbox);
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate and refetch occlusion masks
      void queryClient.invalidateQueries({
        queryKey: [
          'occlusionMasks',
          sequence.camera?.name,
          sequence.camera?.angle_of_view,
        ],
      });
      onClose();
    },
  });

  // Mutation for clearing all masks
  const clearMasksMutation = useMutation({
    mutationFn: ({
      cameraName,
      angleOfView,
    }: {
      cameraName: string;
      angleOfView: number;
    }) => {
      clearOcclusionMasks(cameraName, angleOfView);
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate and refetch occlusion masks
      void queryClient.invalidateQueries({
        queryKey: [
          'occlusionMasks',
          sequence.camera?.name,
          sequence.camera?.angle_of_view,
        ],
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
    if (
      !proposedBbox ||
      !sequence.camera?.name ||
      sequence.camera.angle_of_view === null
    ) {
      return;
    }

    addMaskMutation.mutate({
      cameraName: sequence.camera.name,
      angleOfView: sequence.camera.angle_of_view,
      bbox: proposedBbox,
    });
  };

  const handleDeleteAll = () => {
    if (!sequence.camera?.name || sequence.camera.angle_of_view === null) {
      return;
    }

    clearMasksMutation.mutate({
      cameraName: sequence.camera.name,
      angleOfView: sequence.camera.angle_of_view,
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
      <DialogTitle>
        <Typography variant="h6">{t('title')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="body1" gutterBottom>
            {t('explanationText')}
          </Typography>

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
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
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
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} color="inherit">
          {t('cancelButton')}
        </Button>
        <Button
          onClick={handleConfirmSelection}
          color="success"
          variant="contained"
          disabled={!proposedBbox || addMaskMutation.isPending || isLoading}
        >
          {addMaskMutation.isPending ? t('adding') : t('confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
