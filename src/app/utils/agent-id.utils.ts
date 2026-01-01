/**
 * Utility functions for encoding/decoding Agent IDs in URLs
 */

/**
 * Encode agent GUID to Base64 for URL
 * @param guid Agent GUID
 * @returns Base64 encoded string
 */
export function encodeAgentId(guid: string): string {
  try {
    return btoa(guid);
  } catch {
    return guid; // Fallback
  }
}

/**
 * Decode Base64 agent ID back to GUID
 * @param encoded Base64 encoded ID
 * @returns Original GUID
 */
export function decodeAgentId(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded; // Assume it's already a GUID (backward compatibility)
  }
}
