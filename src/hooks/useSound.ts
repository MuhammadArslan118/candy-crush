import { useCallback } from 'react';

const MATCH_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
const SWAP_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3';
const INVALID_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3';

export default function useSound() {
  const playSound = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Handle any playback errors silently
    });
  }, []);

  return {
    playMatch: () => playSound(MATCH_SOUND),
    playSwap: () => playSound(SWAP_SOUND),
    playInvalid: () => playSound(INVALID_SOUND)
  };
}