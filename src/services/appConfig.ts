/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export interface AppConfigType {
  readonly API_URL: string;
  readonly LIVE_STREAMING_MEDIA_URL: string;
  readonly LIVE_STREAMING_SITE_URL: string;

  readonly LIVE_STREAMING_TIMEOUT_SECONDS: number;

  readonly CAMERAS_INACTIVITY_THRESHOLD_MINUTES: number;
  readonly CAMERAS_LIST_REFRESH_INTERVAL_MINUTES: number;

  readonly ALERTS_LIST_REFRESH_INTERVAL_SECONDS: number;
  readonly ALERTS_PLAYER_INTERVAL_MILLISECONDS: number;
  readonly ALERTS_PLAYER_CONFIDENCE_THRESHOLD: number;
  readonly ALERTS_SOUND_FILE: string;
  readonly ALERTS_CAMERA_RANGE_KM: number;

  readonly HISTORY_NB_ALERTS_PER_PAGE: number;
}

export class AppConfig {
  getConfig(): AppConfigType {
    return {
      // @ts-expect-error config is fetched from a JS file
      API_URL: window.AppConfig?.API_URL,
      // @ts-expect-error config is fetched from a JS file
      LIVE_STREAMING_MEDIA_URL: window.AppConfig?.LIVE_STREAMING_MEDIA_URL,
      // @ts-expect-error config is fetched from a JS file
      LIVE_STREAMING_SITE_URL: window.AppConfig?.LIVE_STREAMING_SITE_URL,

      LIVE_STREAMING_TIMEOUT_SECONDS:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.LIVE_STREAMING_TIMEOUT_SECONDS,

      CAMERAS_INACTIVITY_THRESHOLD_MINUTES:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.CAMERAS_INACTIVITY_THRESHOLD_MINUTES,
      CAMERAS_LIST_REFRESH_INTERVAL_MINUTES:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.CAMERAS_LIST_REFRESH_INTERVAL_MINUTES,
      ALERTS_LIST_REFRESH_INTERVAL_SECONDS:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.ALERTS_LIST_REFRESH_INTERVAL_SECONDS,
      ALERTS_PLAYER_INTERVAL_MILLISECONDS:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.ALERTS_PLAYER_INTERVAL_MILLISECONDS,
      ALERTS_PLAYER_CONFIDENCE_THRESHOLD:
        // @ts-expect-error config is fetched from a JS file
        window.AppConfig?.ALERTS_PLAYER_CONFIDENCE_THRESHOLD,
      // @ts-expect-error config is fetched from a JS file
      ALERTS_SOUND_FILE: window.AppConfig?.ALERTS_SOUND_FILE,
      // @ts-expect-error config is fetched from a JS file
      ALERTS_CAMERA_RANGE_KM: window.AppConfig?.ALERTS_CAMERA_RANGE_KM ?? 30,
      // @ts-expect-error config is fetched from a JS file
      HISTORY_NB_ALERTS_PER_PAGE: window.AppConfig?.HISTORY_NB_ALERTS_PER_PAGE,
    };
  }
}
const appConfig = new AppConfig();

export default appConfig;
