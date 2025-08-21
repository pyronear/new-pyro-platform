import DownloadIcon from '@mui/icons-material/Download';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import JSZip from 'jszip';
import { useCallback, useEffect, useState } from 'react';

import {
  type DetectionType,
  getDetectionsBySequence,
} from '../../../services/alerts';
import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { formatToTime, isStrictlyAfter } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { SplitButton, type SplitButtonOption } from '../../Common/SplitButton';
import { AlertImagesPlayer } from './AlertImagesPlayer';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
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

  const downloadCurrentImage = () => {
    if (currentDetection) {
      const link = document.createElement('a');
      link.href = currentDetection.url;
      link.download = 'true';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAllImages = async () => {
    if (!detectionsList || detectionsList.length === 0) {
      return;
    }

    const zip = new JSZip();

    try {
      // Fetch all images and add them to the zip
      const imagePromises = detectionsList.map(async (detection, index) => {
        try {
          const response = await fetch(detection.url);
          if (!response.ok) {
            console.error(
              `Failed to fetch image ${index + 1}:`,
              response.statusText
            );
            return null;
          }
          const blob = await response.blob();

          // Extract filename from URL or create a default one
          const urlParts = detection.url.split('/');
          const originalFilename = urlParts[urlParts.length - 1]?.split('?')[0];
          const filename = originalFilename || `detection_${index + 1}.jpg`;

          return { filename, blob };
        } catch (error) {
          console.error(`Error fetching image ${index + 1}:`, error);
          return null;
        }
      });

      const imageResults = await Promise.all(imagePromises);

      // Add successfully fetched images to zip
      imageResults.forEach((result) => {
        if (result) {
          zip.file(result.filename, result.blob);
        }
      });

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `alert_images_${sequence.id}.zip`;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating zip file:', error);
    }
  };

  const downloadOptions: SplitButtonOption[] = [
    {
      label: t('buttonImageDownload'),
      onClick: downloadCurrentImage,
    },
    {
      label: t('buttonImageDownloadAll'),
      onClick: () => {
        void downloadAllImages();
      },
    },
  ];

  return (
    <Paper sx={{ height: '100% ', borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          minHeight={35}
        >
          <Grid>
            <Typography variant="h2">
              {formatToTime(sequence.startedAt)}
            </Typography>
          </Grid>
          <Grid>
            <a
              download
              href="https://s3.sbg.io.cloud.ovh.net/ovh-alert-api-prod-v2-alert-api-4/11-20250820155455-e3722cef.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=6d0b52f50fe147da997228e1ded799d4%2F20250821%2Fsbg%2Fs3%2Faws4_request&X-Amz-Date=20250821T092308Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=e30c48384bc3bfde23b691ac90a3380c84da47c7b817ff6e6e662e0cd7138d41"
            >
              Dl
            </a>
            <SplitButton
              options={downloadOptions}
              startIcon={<DownloadIcon />}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider flexItem />
        {isPending && (
          <Grid container spacing={1}>
            {/* One skeleton in place of the image, one skeleton in place of the timeline */}
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        )}
        <Grid>
          {isError && (
            <Typography variant="body2">
              {t('errorFetchImagesMessage')}
            </Typography>
          )}
          {isSuccess && (
            <AlertImagesPlayer
              sequenceId={sequence.id}
              detections={detectionsList}
              onSelectedDetectionChange={setCurrentDetection}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
