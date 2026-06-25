import '@testing-library/jest-dom';

import { Settings } from 'luxon';

import appConfig from '@/services/appConfig';

Settings.defaultZone = 'Europe/Paris';

window.open = vi.fn();
appConfig.getConfig = vi.fn().mockReturnValue({
  API_URL: 'https://example.com/api/',
  LIVE_STREAMING_MEDIA_URL: '',

  LIVE_STREAMING_TIMEOUT_SECONDS: 30,
  CAMERAS_INACTIVITY_THRESHOLD_MINUTES: 30,
  CAMERAS_LIST_REFRESH_INTERVAL_MINUTES: 2,
  ALERTS_LIST_REFRESH_INTERVAL_SECONDS: 30,
  ALERTS_PLAYER_INTERVAL_MILLISECONDS: 500,
  ALERTS_PLAYER_CONFIDENCE_THRESHOLD: 0.15,
  ALERTS_SOUND_FILE: 'notification-alert.mp3',
  ALERTS_CAMERA_RANGE_KM: 30,
  HISTORY_NB_ALERTS_PER_PAGE: 15,
  USER_GUIDE_URLS: {
    fr: 'https://pyronear.notion.site/Guide-d-utilisation-plateforme-Pyronear-376425b63668818ebd17da60b20cc770',
    en: "https://pyronear.notion.site/Pyronear-Platform-User-Guide-389425b6366881da906ee38e93524db2",
    de: "https://pyronear.notion.site/Pyronear-Plattform-Benutzerhandbuch-389425b63668816abf44e8679fb9dd35",
    es: "https://pyronear.notion.site/Gu-a-de-uso-de-la-plataforma-Pyronear-389425b6366881e69fd6f6f1a414814d"
  },
});
