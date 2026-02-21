/**
 * Utility functions for parsing and managing URL parameters
 * Supports both query strings (?param=value) and hash-based routing (#/?param=value)
 */

/**
 * Extracts URL parameters from both query string and hash
 * Prioritizes query string parameters over hash parameters
 */
export function getUrlParams(): URLSearchParams {
  const timestamp = new Date().toISOString();
  console.group(`[urlParams] ${timestamp} - Parsing URL parameters`);
  
  if (typeof window === 'undefined') {
    console.log('[urlParams] Running in non-browser environment');
    console.groupEnd();
    return new URLSearchParams();
  }

  console.log('[urlParams] Current URL:', window.location.href);
  
  // Parse query string parameters
  const queryParams = new URLSearchParams(window.location.search);
  console.log('[urlParams] Query string params:', Array.from(queryParams.entries()));

  // Parse hash-based parameters (e.g., #/?param=value)
  const hash = window.location.hash;
  console.log('[urlParams] Hash:', hash);
  
  const hashParams = new URLSearchParams();
  if (hash.includes('?')) {
    const hashQuery = hash.split('?')[1];
    console.log('[urlParams] Hash query string:', hashQuery);
    const tempParams = new URLSearchParams(hashQuery);
    tempParams.forEach((value, key) => {
      hashParams.set(key, value);
    });
    console.log('[urlParams] Hash params:', Array.from(hashParams.entries()));
  }

  // Merge parameters (query string takes precedence)
  const mergedParams = new URLSearchParams(hashParams);
  queryParams.forEach((value, key) => {
    mergedParams.set(key, value);
  });

  console.log('[urlParams] Merged params:', Array.from(mergedParams.entries()));
  console.groupEnd();
  
  return mergedParams;
}

/**
 * Gets a specific parameter value from URL
 * Checks both query string and hash-based parameters
 */
export function getUrlParameter(name: string): string | null {
  const params = getUrlParams();
  const value = params.get(name);
  console.log(`[urlParams] Getting parameter "${name}":`, value || 'null');
  return value;
}

/**
 * Gets a secret parameter and stores it in sessionStorage
 * Used for sensitive parameters like admin tokens
 */
export function getSecretParameter(name: string): string | null {
  const timestamp = new Date().toISOString();
  console.group(`[urlParams] ${timestamp} - Getting secret parameter: ${name}`);
  
  if (typeof window === 'undefined') {
    console.log('[urlParams] Running in non-browser environment');
    console.groupEnd();
    return null;
  }

  // Check sessionStorage first
  const storedValue = sessionStorage.getItem(name);
  if (storedValue) {
    console.log(`[urlParams] Found "${name}" in sessionStorage:`, storedValue ? `${storedValue.substring(0, 10)}...` : 'null');
    console.groupEnd();
    return storedValue;
  }

  // Check URL parameters
  const urlValue = getUrlParameter(name);
  if (urlValue) {
    console.log(`[urlParams] Found "${name}" in URL:`, urlValue ? `${urlValue.substring(0, 10)}...` : 'null');
    console.log(`[urlParams] Storing "${name}" in sessionStorage`);
    sessionStorage.setItem(name, urlValue);
    
    // Clean URL by removing the parameter
    console.log('[urlParams] Cleaning URL to remove secret parameter');
    const params = getUrlParams();
    params.delete(name);
    
    const newUrl = new URL(window.location.href);
    newUrl.search = params.toString();
    window.history.replaceState({}, '', newUrl.toString());
    console.log('[urlParams] URL cleaned:', newUrl.toString());
    
    console.groupEnd();
    return urlValue;
  }

  console.log(`[urlParams] Parameter "${name}" not found in URL or sessionStorage`);
  console.groupEnd();
  return null;
}

/**
 * Clears a secret parameter from sessionStorage
 */
export function clearSecretParameter(name: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[urlParams] ${timestamp} - Clearing secret parameter: ${name}`);
  
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(name);
    console.log(`[urlParams] Removed "${name}" from sessionStorage`);
  }
}
