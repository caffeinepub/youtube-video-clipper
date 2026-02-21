/**
 * Utility functions for parsing and managing URL parameters
 * Works with both hash-based and browser-based routing
 */

/**
 * Extracts a URL parameter from the current URL
 * Works with both query strings (?param=value) and hash-based routing (#/?param=value)
 *
 * @param paramName - The name of the parameter to extract
 * @returns The parameter value if found, null otherwise
 */
export function getUrlParameter(paramName: string): string | null {
    console.log('[urlParams] getUrlParameter called for:', paramName);
    
    // Try to get from regular query string first
    const urlParams = new URLSearchParams(window.location.search);
    const regularParam = urlParams.get(paramName);

    console.log('[urlParams] Regular query string check:', regularParam !== null ? 'FOUND' : 'NOT FOUND');
    if (regularParam !== null) {
        console.log('[urlParams] Returning from regular query string:', regularParam.substring(0, 10) + '...');
        return regularParam;
    }

    // If not found, try to extract from hash (for hash-based routing)
    const hash = window.location.hash;
    console.log('[urlParams] Hash value:', hash);
    const queryStartIndex = hash.indexOf('?');

    if (queryStartIndex !== -1) {
        const hashQuery = hash.substring(queryStartIndex + 1);
        console.log('[urlParams] Hash query string:', hashQuery);
        const hashParams = new URLSearchParams(hashQuery);
        const hashParam = hashParams.get(paramName);
        console.log('[urlParams] Hash param check:', hashParam !== null ? 'FOUND' : 'NOT FOUND');
        if (hashParam !== null) {
            console.log('[urlParams] Returning from hash:', hashParam.substring(0, 10) + '...');
        }
        return hashParam;
    }

    console.log('[urlParams] Parameter not found in URL or hash');
    return null;
}

/**
 * Stores a parameter in sessionStorage for persistence across navigation
 * Useful for maintaining state like admin tokens throughout the session
 *
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export function storeSessionParameter(key: string, value: string): void {
    console.log('[urlParams] storeSessionParameter called');
    console.log('[urlParams] Key:', key);
    console.log('[urlParams] Value length:', value.length);
    console.log('[urlParams] Value (first 10 chars):', value.substring(0, 10) + '...');
    
    try {
        sessionStorage.setItem(key, value);
        console.log('[urlParams] ✅ Successfully stored in sessionStorage');
        
        // Verify storage
        const stored = sessionStorage.getItem(key);
        console.log('[urlParams] Verification - value stored correctly:', stored === value);
    } catch (error) {
        console.error('[urlParams] ❌ Failed to store session parameter:', key);
        console.error('[urlParams] Error:', error);
    }
}

/**
 * Retrieves a parameter from sessionStorage
 *
 * @param key - The key to retrieve
 * @returns The stored value if found, null otherwise
 */
export function getSessionParameter(key: string): string | null {
    console.log('[urlParams] getSessionParameter called for:', key);
    
    try {
        const value = sessionStorage.getItem(key);
        console.log('[urlParams] SessionStorage check:', value !== null ? 'FOUND' : 'NOT FOUND');
        if (value !== null) {
            console.log('[urlParams] Value length:', value.length);
            console.log('[urlParams] Value (first 10 chars):', value.substring(0, 10) + '...');
        }
        return value;
    } catch (error) {
        console.error('[urlParams] ❌ Failed to retrieve session parameter:', key);
        console.error('[urlParams] Error:', error);
        return null;
    }
}

/**
 * Gets a parameter from URL or sessionStorage (URL takes precedence)
 * If found in URL, also stores it in sessionStorage for future use
 *
 * @param paramName - The name of the parameter to retrieve
 * @param storageKey - Optional custom storage key (defaults to paramName)
 * @returns The parameter value if found, null otherwise
 */
export function getPersistedUrlParameter(paramName: string, storageKey?: string): string | null {
    const key = storageKey || paramName;
    console.log('[urlParams] getPersistedUrlParameter called');
    console.log('[urlParams] Param name:', paramName);
    console.log('[urlParams] Storage key:', key);

    // Check URL first
    const urlValue = getUrlParameter(paramName);
    if (urlValue !== null) {
        console.log('[urlParams] Found in URL, storing in session...');
        // Store in session for persistence
        storeSessionParameter(key, urlValue);
        return urlValue;
    }

    // Fall back to session storage
    console.log('[urlParams] Not in URL, checking session storage...');
    return getSessionParameter(key);
}

/**
 * Removes a parameter from sessionStorage
 *
 * @param key - The key to remove
 */
export function clearSessionParameter(key: string): void {
    console.log('[urlParams] clearSessionParameter called for:', key);
    
    try {
        sessionStorage.removeItem(key);
        console.log('[urlParams] ✅ Successfully removed from sessionStorage');
    } catch (error) {
        console.error('[urlParams] ❌ Failed to clear session parameter:', key);
        console.error('[urlParams] Error:', error);
    }
}

/**
 * Removes a specific parameter from the URL hash without reloading the page
 * Preserves route information and other parameters in the hash
 * Used to remove sensitive data from the address bar after extracting it
 *
 * @param paramName - The parameter to remove from the hash
 *
 * @example
 * // URL: https://app.com/#/dashboard?caffeineAdminToken=xxx&other=value
 * // After clearParamFromHash('caffeineAdminToken')
 * // URL: https://app.com/#/dashboard?other=value
 */
function clearParamFromHash(paramName: string): void {
    console.log('[urlParams] clearParamFromHash called for:', paramName);
    
    if (!window.history.replaceState) {
        console.log('[urlParams] ⚠️ history.replaceState not available');
        return;
    }

    const hash = window.location.hash;
    console.log('[urlParams] Current hash:', hash);
    
    if (!hash || hash.length <= 1) {
        console.log('[urlParams] No hash to clear from');
        return;
    }

    // Remove the leading #
    const hashContent = hash.substring(1);

    // Split route path from query string
    const queryStartIndex = hashContent.indexOf('?');

    if (queryStartIndex === -1) {
        console.log('[urlParams] No query string in hash');
        return;
    }

    const routePath = hashContent.substring(0, queryStartIndex);
    const queryString = hashContent.substring(queryStartIndex + 1);
    console.log('[urlParams] Route path:', routePath);
    console.log('[urlParams] Query string:', queryString);

    // Parse and remove the specific parameter
    const params = new URLSearchParams(queryString);
    const hadParam = params.has(paramName);
    params.delete(paramName);
    console.log('[urlParams] Parameter existed in hash:', hadParam);

    // Reconstruct the URL
    const newQueryString = params.toString();
    let newHash = routePath;

    if (newQueryString) {
        newHash += '?' + newQueryString;
    }

    // If we still have content in the hash, keep it; otherwise remove the hash entirely
    const newUrl = window.location.pathname + window.location.search + (newHash ? '#' + newHash : '');
    console.log('[urlParams] New URL:', newUrl);
    window.history.replaceState(null, '', newUrl);
    console.log('[urlParams] ✅ URL updated successfully');
}

/**
 * Gets a secret from the URL hash fragment only (more secure than query params)
 * Hash fragments aren't sent to servers or logged in access logs
 * The hash is immediately cleared from the URL after extraction to prevent history leakage
 *
 * Usage: https://yourapp.com/#secret=xxx
 *
 * @param paramName - The name of the secret parameter
 * @returns The secret value if found (from hash or session), null otherwise
 */
export function getSecretFromHash(paramName: string): string | null {
    console.log('[urlParams] ========== getSecretFromHash START ==========');
    console.log('[urlParams] Timestamp:', new Date().toISOString());
    console.log('[urlParams] Parameter name:', paramName);
    console.log('[urlParams] Current URL:', window.location.href);
    console.log('[urlParams] Current hash:', window.location.hash);
    
    // Check session first to avoid unnecessary URL manipulation
    console.log('[urlParams] Step 1: Checking sessionStorage...');
    const existingSecret = getSessionParameter(paramName);
    if (existingSecret !== null) {
        console.log('[urlParams] ✅ Found in sessionStorage (returning cached value)');
        console.log('[urlParams] ========== getSecretFromHash END (FROM SESSION) ==========');
        return existingSecret;
    }
    console.log('[urlParams] Not found in sessionStorage, checking URL hash...');

    // Try to extract from hash
    const hash = window.location.hash;
    console.log('[urlParams] Step 2: Parsing hash...');
    console.log('[urlParams] Hash value:', hash);
    console.log('[urlParams] Hash length:', hash.length);
    
    if (!hash || hash.length <= 1) {
        console.log('[urlParams] ❌ No hash or empty hash');
        console.log('[urlParams] ========== getSecretFromHash END (NO HASH) ==========');
        return null;
    }

    // Remove the leading #
    const hashContent = hash.substring(1);
    console.log('[urlParams] Hash content (without #):', hashContent);
    
    const params = new URLSearchParams(hashContent);
    console.log('[urlParams] Parsed URLSearchParams from hash');
    console.log('[urlParams] All hash params:', Array.from(params.keys()).join(', '));
    
    const secret = params.get(paramName);
    console.log('[urlParams] Parameter lookup result:', secret !== null ? 'FOUND' : 'NOT FOUND');

    if (secret) {
        console.log('[urlParams] ✅ Secret found in hash!');
        console.log('[urlParams] Secret length:', secret.length);
        console.log('[urlParams] Secret (first 10 chars):', secret.substring(0, 10) + '...');
        
        console.log('[urlParams] Step 3: Storing in sessionStorage...');
        storeSessionParameter(paramName, secret);
        
        console.log('[urlParams] Step 4: Clearing from URL hash...');
        clearParamFromHash(paramName);
        
        console.log('[urlParams] ========== getSecretFromHash END (SUCCESS) ==========');
        return secret;
    }

    console.log('[urlParams] ❌ Parameter not found in hash');
    console.log('[urlParams] ========== getSecretFromHash END (NOT FOUND) ==========');
    return null;
}

/**
 * Gets a secret parameter with fallback chain: hash -> sessionStorage
 * This is the recommended way to handle sensitive parameters like admin tokens
 *
 * Security benefits over regular URL params:
 * - Hash fragments are not sent to the server
 * - Not logged in server access logs
 * - Not sent in HTTP Referer headers
 * - Automatically cleared from URL after extraction
 *
 * @param paramName - The name of the secret parameter
 * @returns The secret value if found, null otherwise
 */
export function getSecretParameter(paramName: string): string | null {
    console.log('[urlParams] ========== getSecretParameter CALLED ==========');
    console.log('[urlParams] Parameter:', paramName);
    const result = getSecretFromHash(paramName);
    console.log('[urlParams] Final result:', result !== null ? 'FOUND' : 'NOT FOUND');
    console.log('[urlParams] ================================================');
    return result;
}
