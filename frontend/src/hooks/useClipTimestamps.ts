import { useState, useCallback } from 'react';

export function useClipTimestamps() {
  const [startMinutes, setStartMinutes] = useState('0');
  const [startSeconds, setStartSeconds] = useState('0');
  const [endMinutes, setEndMinutes] = useState('0');
  const [endSeconds, setEndSeconds] = useState('0');

  const getTotalSeconds = useCallback((type: 'start' | 'end'): number => {
    const minutes = type === 'start' ? parseInt(startMinutes) || 0 : parseInt(endMinutes) || 0;
    const seconds = type === 'start' ? parseInt(startSeconds) || 0 : parseInt(endSeconds) || 0;
    return minutes * 60 + seconds;
  }, [startMinutes, startSeconds, endMinutes, endSeconds]);

  const isValid = useCallback((): boolean => {
    const start = getTotalSeconds('start');
    const end = getTotalSeconds('end');
    return start >= 0 && end > start;
  }, [getTotalSeconds]);

  const validationError = useCallback((): string | null => {
    const start = getTotalSeconds('start');
    const end = getTotalSeconds('end');

    if (start < 0 || end < 0) {
      return 'Times must be positive numbers';
    }

    if (end <= start) {
      return 'End time must be after start time';
    }

    return null;
  }, [getTotalSeconds]);

  const formatTimeRange = useCallback((): string => {
    const start = getTotalSeconds('start');
    const end = getTotalSeconds('end');
    const duration = end - start;

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return `${formatTime(start)} - ${formatTime(end)} (${formatTime(duration)})`;
  }, [getTotalSeconds]);

  const setFromSeconds = useCallback((startSec: number, endSec: number) => {
    const startMins = Math.floor(startSec / 60);
    const startSecs = startSec % 60;
    const endMins = Math.floor(endSec / 60);
    const endSecs = endSec % 60;

    setStartMinutes(startMins.toString());
    setStartSeconds(startSecs.toString());
    setEndMinutes(endMins.toString());
    setEndSeconds(endSecs.toString());
  }, []);

  return {
    startMinutes,
    startSeconds,
    endMinutes,
    endSeconds,
    setStartMinutes,
    setStartSeconds,
    setEndMinutes,
    setEndSeconds,
    getTotalSeconds,
    isValid: isValid(),
    validationError: validationError(),
    formatTimeRange,
    setFromSeconds,
  };
}
