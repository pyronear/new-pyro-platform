interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES: number;
  readonly VITE_ALERTS_PLAY_INTERVAL_MILLISECONDS: number;
  readonly VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES: number;
  readonly VITE_DEFAULT_CAM_RANGE_KM: number;
  readonly VITE_ALERTS_LIST_REFRESH_INTERVAL_SECONDS: number;
  readonly VITE_HISTORY_NB_ALERTS_PER_PAGE: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
