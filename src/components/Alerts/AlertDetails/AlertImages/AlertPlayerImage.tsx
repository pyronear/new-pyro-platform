import { useAlertPlayer } from './context/useAlertPlayer';
import { DetectionImageWithBoundingBox } from './DetectionImageWithBoundingBox';

interface AlertPlayerImageProps {
  displayBbox: boolean;
  displayCrop: boolean;
}

export const AlertPlayerImage = ({
  displayBbox,
  displayCrop,
}: AlertPlayerImageProps) => {
  const { sequenceId, selectedDetection } = useAlertPlayer();

  return (
    <DetectionImageWithBoundingBox
      displayBbox={displayBbox}
      displayCrop={displayCrop}
      sequenceId={sequenceId}
      selectedDetection={selectedDetection}
    />
  );
};
