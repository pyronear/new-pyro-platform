interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES: number;
  readonly VITE_ALERTS_PLAY_INTERVAL_MILLISECONDS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
