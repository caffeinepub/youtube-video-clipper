import { useState, useEffect } from 'react';
import type { SystemStatus } from '../types/app';

// System status is managed locally since backend doesn't have these methods
let globalStatus: SystemStatus = 'running';
let statusListeners: Array<() => void> = [];

export function setGlobalSystemStatus(status: SystemStatus) {
  globalStatus = status;
  statusListeners.forEach((fn) => fn());
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>(globalStatus);

  useEffect(() => {
    const fn = () => setStatus(globalStatus);
    statusListeners.push(fn);
    return () => {
      statusListeners = statusListeners.filter((l) => l !== fn);
    };
  }, []);

  return { data: status, isLoading: false };
}
