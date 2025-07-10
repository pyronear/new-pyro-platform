interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
