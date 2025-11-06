import { useRef, useState } from 'react';

export const useAlertSoundToggle = (soundFile: string) => {
  const [isAlertSoundOn, setIsAlertSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(soundFile));

  const toggleSound = () => {
    setIsAlertSoundOn((prev) => !prev);
  };

  const playSound = () => {
    if (isAlertSoundOn) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return { isAlertSoundOn, toggleSound, playSound };
};
