/**
 * Generates a deterministic short user ID (8 characters) from a principal string.
 * Uses a simple hash function to ensure the same principal always produces the same ID.
 */
export function generateShortUserId(principalText: string): string {
  // Simple hash function for deterministic ID generation
  let hash = 0;
  for (let i = 0; i < principalText.length; i++) {
    const char = principalText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base36 and take first 8 characters
  const base36 = Math.abs(hash).toString(36).toUpperCase();
  const userId = base36.padStart(8, '0').slice(0, 8);
  
  return userId;
}
