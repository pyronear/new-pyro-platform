interface ImportMetaEnv {
  readonly VITE_FILE_SITES_INFOS: string;
  readonly VITE_FILE_SITES_LIVE_ACCESS: string;
  readonly VITE_APP_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
