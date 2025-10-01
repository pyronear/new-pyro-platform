import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { type DetectionType, getDetectionsBySequence } from '@/services/alerts';
import {
  addOcclusionMask,
  type BboxType,
  clearOcclusionMasks,
  enlargeBbox,
  getHighestConfidenceBbox,
  getHighestConfidenceDetection,
  getNonOverlappingMasks,
  getOcclusionMasks,
} from '@/services/occlusionMasks';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
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
  const [detectionsData, setDetectionsData] = useState<DetectionType[]>([]);
  const [existingMasks, setExistingMasks] = useState<BboxType[]>([]);

  // Derive highestDetection and proposedBbox from detectionsData
  const highestDetection = getHighestConfidenceDetection(detectionsData);
  const proposedBbox = highestDetection
    ? (() => {
        const highestBbox = getHighestConfidenceBbox(highestDetection);
        return highestBbox ? enlargeBbox(highestBbox, 0.1) : null;
      })()
    : null;

  const loadDetections = useCallback(async () => {
    if (!sequence.camera?.name || sequence.azimuth === null) {
      return;
    }

    try {
      const detections = await getDetectionsBySequence(sequence.id);
      setDetectionsData(detections);

      // Load existing occlusion masks from localStorage
      const masks = getOcclusionMasks(sequence.camera.name, sequence.azimuth);
      const nonOverlappingMasks = getNonOverlappingMasks(masks);
      setExistingMasks(nonOverlappingMasks);
    } catch (err) {
      console.error('Error loading detections:', err);
    }
  }, [sequence]);

  useEffect(() => {
    if (open) {
      void loadDetections();
    }
  }, [open, loadDetections]);

  const handleConfirmSelection = () => {
    if (!proposedBbox || !sequence.camera?.name || sequence.azimuth === null) {
      return;
    }

    addOcclusionMask(sequence.camera.name, sequence.azimuth, proposedBbox);
    onClose();
  };

  const handleDeleteAll = () => {
    if (!sequence.camera?.name || sequence.azimuth === null) {
      return;
    }

    clearOcclusionMasks(sequence.camera.name, sequence.azimuth);
    setExistingMasks([]);
  };

  const imageUrl = highestDetection?.url ?? '';

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
          {/* <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('explanationText')}
          </Typography> */}

          {imageUrl && (
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
                alt="Detection"
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
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleDeleteAll}
          color="error"
          variant="outlined"
          disabled={existingMasks.length === 0}
        >
          {t('deleteAllButton')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} color="inherit">
          {t('cancelButton')}
        </Button>
        <Button
          onClick={handleConfirmSelection}
          color="success"
          variant="contained"
          disabled={!proposedBbox}
        >
          {t('confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
