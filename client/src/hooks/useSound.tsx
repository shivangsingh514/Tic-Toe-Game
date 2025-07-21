import { useRef, useCallback } from 'react';

// Audio context for better performance
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound generation functions
const createOscillator = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playClickSound = () => {
  createOscillator(800, 0.1, 'square');
};

const playMoveSound = () => {
  const ctx = getAudioContext();
  // Pleasant click with harmonic
  createOscillator(600, 0.15, 'sine');
  setTimeout(() => createOscillator(800, 0.1, 'sine'), 50);
};

const playWinSound = () => {
  const ctx = getAudioContext();
  // Victory fanfare
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => {
      createOscillator(note, 0.3, 'triangle');
    }, index * 150);
  });
};

const playDrawSound = () => {
  const ctx = getAudioContext();
  // Neutral ending sound
  createOscillator(400, 0.5, 'sine');
  setTimeout(() => createOscillator(300, 0.5, 'sine'), 200);
};

const playGameStartSound = () => {
  const ctx = getAudioContext();
  // Ascending start sound
  createOscillator(400, 0.2, 'triangle');
  setTimeout(() => createOscillator(500, 0.2, 'triangle'), 100);
  setTimeout(() => createOscillator(600, 0.3, 'triangle'), 200);
};

const playResetSound = () => {
  const ctx = getAudioContext();
  // Quick reset sound
  createOscillator(300, 0.1, 'square');
  setTimeout(() => createOscillator(200, 0.1, 'square'), 50);
};

const playHoverSound = () => {
  createOscillator(400, 0.05, 'sine');
};

export const useSound = () => {
  const enabledRef = useRef(true);

  const playSound = useCallback((type: 'click' | 'move' | 'win' | 'draw' | 'start' | 'reset' | 'hover') => {
    if (!enabledRef.current) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      switch (type) {
        case 'click':
          playClickSound();
          break;
        case 'move':
          playMoveSound();
          break;
        case 'win':
          playWinSound();
          break;
        case 'draw':
          playDrawSound();
          break;
        case 'start':
          playGameStartSound();
          break;
        case 'reset':
          playResetSound();
          break;
        case 'hover':
          playHoverSound();
          break;
      }
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  const isSoundEnabled = () => enabledRef.current;

  return { playSound, toggleSound, isSoundEnabled };
};