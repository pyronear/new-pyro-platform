export interface AlertType {
  id: number;
  startedAt: string | null;
  lastSeenAt: string | null;
  detections: DetectionType[];
}

export interface DetectionType {
  id: string;
  name: string;
  orientation: string;
  date: string;
}
