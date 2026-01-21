import { useRef } from 'react';

import { usePreferences } from '@/context/usePreferences';
import appConfig from '@/services/appConfig';

const SOUND_FILE = appConfig.getConfig().ALERTS_SOUND_FILE;

export const useAlertSoundToggle = () => {
  const { preferences } = usePreferences();
  const isAlertSoundOn = preferences.audio.alertsEnabled;
  const audioRef = useRef<HTMLAudioElement>(new Audio(`/sounds/${SOUND_FILE}`));

  const playSound = () => {
    if (isAlertSoundOn) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return { playSound };
};
