import { useRef, useState } from 'react';

const SOUND_FILE = import.meta.env.VITE_ALERTS_SOUND_FILE;

export const useAlertSoundToggle = () => {
  const [isAlertSoundOn, setIsAlertSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(`/sounds/${SOUND_FILE}`));

  const toggleSound = () => {
    setIsAlertSoundOn((prev) => !prev);
  };

  const playSound = () => {
    console.log(isAlertSoundOn);
    console.log(audioRef);
    if (isAlertSoundOn) {
      //audioRef.current.loop = true;
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return { isAlertSoundOn, toggleSound, playSound };
};
