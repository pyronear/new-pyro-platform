import { Visibility, VisibilityOff } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import JSZip from 'jszip';
import { useCallback, useEffect, useState } from 'react';

import {
  SplitButton,
  type SplitButtonOption,
} from '@/components/Common/SplitButton';
import { type DetectionType, getDetectionsBySequence } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { formatIsoToTime, isStrictlyAfter } from '@/utils/dates';
import { getFirstConfidentDetectionIndex } from '@/utils/detections';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertImagesPlayer } from './AlertImagesPlayer';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [displayBbox, setDisplayBbox] = useState(true);
  const [currentDetection, setCurrentDetection] =
    useState<DetectionType | null>(null);
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    isSuccess,
    data: detectionsList,
  } = useQuery({
    queryKey: ['detections', sequence.id],
    queryFn: async () => {
      return await getDetectionsBySequence(sequence.id);
    },
    refetchOnWindowFocus: false,
  });

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['detections'] });
  }, [queryClient]);

  useEffect(() => {
    const newLastSeenAt = sequence.lastSeenAt;
    if (
      lastSeenAt &&
      newLastSeenAt &&
      isStrictlyAfter(lastSeenAt, newLastSeenAt)
    ) {
      // LastSeenAt has changed since last time
      // Detections must be refreshed
      invalidateAndRefreshData();
    }
    setLastSeenAt(newLastSeenAt);
  }, [invalidateAndRefreshData, lastSeenAt, sequence.lastSeenAt]);

  useEffect(() => {
    // Reset bbox state when the sequence changes
    setDisplayBbox(true);
  }, [sequence.id]);

  const downloadCurrentImage = () => {
    if (currentDetection) {
      const link = document.createElement('a');
      link.href = currentDetection.url;
      link.download = 'true';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  const drawBoundingBoxOnImage = (
    img: HTMLImageElement,
    bboxes: string
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Parse bounding box: format is "(x1,y1,x2,y2)" with normalized coordinates
      const match = /\(([^)]+)\)/.exec(bboxes);
      if (match) {
        const [x1, y1, x2, y2] = match[1].split(',').map(parseFloat);
        const boxX = x1 * img.naturalWidth;
        const boxY = y1 * img.naturalHeight;
        const boxWidth = (x2 - x1) * img.naturalWidth;
        const boxHeight = (y2 - y1) * img.naturalHeight;

        ctx.strokeStyle = '#d32f2f'; // MUI error.main red
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Could not create blob from canvas'));
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const downloadAllImages = async () => {
    if (!detectionsList || detectionsList.length === 0) return;

    const zip = new JSZip();
    const originalFolder = zip.folder('original');
    const bboxFolder = zip.folder('with_bbox');

    const fetchPromises = detectionsList.map(async (detection) => {
      const response = await fetch(detection.url);
      const blob = await response.blob();
      const extension = detection.url.split('.').pop()?.split('?')[0] ?? 'jpg';
      // Format: YYYY-MM-DDTHH-MM-SS_DETECTION_ID.extension
      const createdAtFormatted = detection.created_at.split('.')[0];
      const filename = `${createdAtFormatted}_${detection.id}.${extension}`;

      // Add original image
      originalFolder?.file(filename, blob);

      // Create image with bounding box
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const bboxBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = async () => {
          try {
            const result = await drawBoundingBoxOnImage(img, detection.bboxes);
            resolve(result);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
      });
      URL.revokeObjectURL(img.src);
      bboxFolder?.file(filename, bboxBlob);
    });
    await Promise.all(fetchPromises);

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    // Zip Name: YYYY-MM-DD_SEQUENCE_ID_images.zip
    const startedAtDate = sequence.startedAt?.split('T')[0] ?? 'unknown';
    link.download = `${startedAtDate}_${sequence.id}_images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const downloadOptions: SplitButtonOption[] = [
    {
      label: t('buttonImageDownloadOne'),
      onClick: downloadCurrentImage,
    },
    {
      label: t('buttonImageDownloadAll'),
      onClick: () => void downloadAllImages(),
      disabled: !detectionsList || detectionsList.length === 0,
    },
  ];

  return (
    <Paper sx={{ height: '100% ', borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }}
          minHeight={35}
          useFlexGap
          sx={{ flexWrap: 'wrap', rowGap: 1 }}
        >
          <Typography variant="h2">
            {formatIsoToTime(sequence.startedAt)}
          </Typography>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            alignItems="center"
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', rowGap: 1 }}
          >
            <Button
              variant="outlined"
              onClick={() => setDisplayBbox((oldValue) => !oldValue)}
              startIcon={displayBbox ? <VisibilityOff /> : <Visibility />}
            >
              {displayBbox ? t('buttonHideBBox') : t('buttonDisplayBBox')}
            </Button>
            <SplitButton
              label={t('buttonImageDownload')}
              options={downloadOptions}
              startIcon={<DownloadIcon />}
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Divider flexItem />
        {isPending && (
          <Grid container spacing={1}>
            {/* One skeleton in place of the image, one skeleton in place of the timeline */}
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        )}
        <Grid sx={{ width: '100%' }}>
          {isError && (
            <Typography variant="body2">
              {t('errorFetchImagesMessage')}
            </Typography>
          )}
          {isSuccess && (
            <AlertImagesPlayer
              sequenceId={sequence.id}
              detections={detectionsList}
              displayBbox={displayBbox}
              onSelectedDetectionChange={setCurrentDetection}
              firstConfidentDetectionIndex={getFirstConfidentDetectionIndex(
                detectionsList
              )}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
