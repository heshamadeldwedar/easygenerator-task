/** Number of bytes for refresh token generation */
export const REFRESH_TOKEN_BYTES = 32

/** Refresh token cookie max age in seconds (7 days) */
export const REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/** Refresh token cookie max age in milliseconds (7 days) */
export const REFRESH_COOKIE_MAX_AGE_MS = REFRESH_COOKIE_MAX_AGE_SECONDS * 1000
