interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES: number;
  readonly VITE_ALERTS_PLAY_INTERVAL_MILLISECONDS: number;
  readonly VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES: number;
  readonly VITE_DEFAULT_CAM_RANGE_KM: number;
  readonly VITE_ALERTS_LIST_REFRESH_INTERVAL_SECONDS: number;
  readonly VITE_HISTORY_NB_ALERTS_PER_PAGE: number;
  readonly VITE_FILE_SITES_INFOS: string;
  readonly VITE_FILE_SITES_LIVE_ACCESS: string;
  readonly VITE_SITES_LIVE_PORT: number;
  readonly VITE_LIVE_STREAMING_URL: string;
  readonly VITE_DETECTION_PLAYER_CONFIDENCE_THRESHOLD: number;
  readonly VITE_ALERTS_SOUND_FILE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
