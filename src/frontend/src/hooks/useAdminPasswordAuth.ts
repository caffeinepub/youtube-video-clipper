import { useState, useCallback, useEffect } from 'react';
import { useActor } from './useActor';

const SESSION_KEY = 'admin_password_validated';

export function useAdminPasswordAuth() {
  const { actor } = useActor();
  const [isValidated, setIsValidated] = useState<boolean>(() => {
    // Check session storage on mount
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    }
    return false;
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear validation state when actor changes (e.g., on logout)
  useEffect(() => {
    if (!actor) {
      setIsValidated(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, [actor]);

  const validatePassword = useCallback(async (password: string): Promise<boolean> => {
    if (!actor) {
      setError('Backend not available');
      return false;
    }

    if (!password || password.trim() === '') {
      setError('Password is required');
      return false;
    }

    setIsValidating(true);
    setError(null);

    try {
      const isValid = await actor.checkAdminPassword(password);

      if (isValid) {
        setIsValidated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
        setError(null);
        return true;
      } else {
        setError('Invalid password');
        setIsValidated(false);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(SESSION_KEY);
        }
        return false;
      }
    } catch (err) {
      console.error('[useAdminPasswordAuth] Password validation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate password';
      setError(errorMessage);
      setIsValidated(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [actor]);

  const clearValidation = useCallback(() => {
    setIsValidated(false);
    setError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  return {
    isValidated,
    isValidating,
    error,
    validatePassword,
    clearValidation,
  };
}
