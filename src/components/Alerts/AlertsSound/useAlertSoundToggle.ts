import { useRef } from 'react';

import { usePreferences } from '@/context/usePreferences';

const SOUND_FILE = import.meta.env.VITE_ALERTS_SOUND_FILE;

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
