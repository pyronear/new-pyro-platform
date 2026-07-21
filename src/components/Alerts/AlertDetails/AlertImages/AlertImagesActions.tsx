import {
  CropOriginal,
  HideImage,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import JSZip from 'jszip';
import { useCallback, useState } from 'react';

import { ResponsiveButton } from '@/components/Common/ResponsiveButton';
import {
  SplitButton,
  type SplitButtonOption,
} from '@/components/Common/SplitButton';
import type { DetectionType } from '@/services/alerts.ts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { formatIsoToTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
  detections: DetectionType[];
  currentDetection: DetectionType | null;
}

export const AlertImagesActions = ({
  sequence,
  detections,
  currentDetection,
}: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');

  const [displayBbox, setDisplayBbox] = useState(true);
  const [displayCrop, setDisplayCrop] = useState(true);

  const getZipFileName = useCallback(
    ({
      sequence,
      withBboxes,
    }: {
      sequence: SequenceWithCameraInfoType;
      withBboxes: boolean;
    }) => {
      const startedAtDate = sequence.startedAt?.split('T')[0] ?? 'unknown';
      const zipFileName = `${sequence.camera?.name ?? t('defaultCameraName')}_${startedAtDate}_${sequence.id}_images${withBboxes ? '_bbox' : ''}.zip`;
      return zipFileName.replaceAll('/', '_'); // for safety just in case the camera name contains a / that could break the file structure
    },
    [t]
  );

  const downloadCurrentImage = () => {
    if (currentDetection) {
      const link = document.createElement('a');
      link.href = currentDetection.url;
      link.download = 'true';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
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

  const triggerZipDownload = (content: Blob, filename: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const downloadAllImages = async () => {
    if (detections.length === 0) return;

    const zip = new JSZip();

    const fetchPromises = detections.map(async (detection) => {
      const response = await fetch(detection.url);
      const blob = await response.blob();
      const extension = detection.url.split('.').pop()?.split('?')[0] ?? 'jpg';
      // Format: YYYY-MM-DDTHH-MM-SS_DETECTION_ID.extension
      const createdAtFormatted = detection.created_at.split('.')[0];
      const filename = `${createdAtFormatted}_${detection.id}.${extension}`;
      zip.file(filename, blob);
    });
    await Promise.all(fetchPromises);

    const content = await zip.generateAsync({ type: 'blob' });
    triggerZipDownload(
      content,
      getZipFileName({ sequence, withBboxes: false })
    );
  };

  const downloadAllImagesWithBbox = async () => {
    if (detections.length === 0) return;

    const zip = new JSZip();

    const fetchPromises = detections.map(async (detection) => {
      const response = await fetch(detection.url);
      const blob = await response.blob();
      const extension = detection.url.split('.').pop()?.split('?')[0] ?? 'jpg';
      // Format: YYYY-MM-DDTHH-MM-SS_DETECTION_ID.extension
      const createdAtFormatted = detection.created_at.split('.')[0];
      const filename = `${createdAtFormatted}_${detection.id}.${extension}`;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      const bboxBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = async () => {
          try {
            const result = await drawBoundingBoxOnImage(img, detection.bbox);
            resolve(result);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
      });
      URL.revokeObjectURL(img.src);
      zip.file(filename, bboxBlob);
    });
    await Promise.all(fetchPromises);

    const content = await zip.generateAsync({ type: 'blob' });
    triggerZipDownload(content, getZipFileName({ sequence, withBboxes: true }));
  };

  const downloadOptions: SplitButtonOption[] = [
    {
      label: t('buttonImageDownloadOne'),
      onClick: downloadCurrentImage,
    },
    {
      label: t('buttonImageDownloadAll'),
      onClick: () => void downloadAllImages(),
      disabled: detections.length === 0,
    },
    {
      label: t('buttonImageDownloadAllBbox'),
      onClick: () => void downloadAllImagesWithBbox(),
      disabled: detections.length === 0,
    },
  ];

  return (
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
        <ResponsiveButton
          variant="outlined"
          onClick={() => setDisplayBbox((oldValue) => !oldValue)}
          startIcon={displayBbox ? <VisibilityOff /> : <Visibility />}
        >
          <span className="Mui-label">
            {displayBbox ? t('buttonHideBBox') : t('buttonDisplayBBox')}
          </span>
        </ResponsiveButton>
        <ResponsiveButton
          variant="outlined"
          onClick={() => setDisplayCrop((oldValue) => !oldValue)}
          startIcon={displayCrop ? <HideImage /> : <CropOriginal />}
        >
          <span className="Mui-label">
            {displayCrop ? t('buttonHideCrop') : t('buttonDisplayCrop')}
          </span>
        </ResponsiveButton>
        <SplitButton
          label={t('buttonImageDownload')}
          options={downloadOptions}
          startIcon={<DownloadIcon />}
          variant="outlined"
        />
      </Stack>
    </Stack>
  );
};
