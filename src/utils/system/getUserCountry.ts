import { API_URL } from "@env";
import fetch from "../fetch";
import { getAbortWithTimeout } from "../getAbortWithTimeout";

// RN's OkHttp client has no connect/read timeouts, so a request that stalls
// (dead-air mobile data, captive portal) would hang forever. This check runs on
// the boot path, so it MUST be bounded — see checkBlockedCountry's caller.
export const COUNTRY_LOOKUP_TIMEOUT_MS = 5000;

/**
 * Reads the country Cloudflare believes the user is connecting from.
 *
 * Cloudflare exposes a `/cdn-cgi/trace` endpoint on every proxied domain that
 * returns plain text including a `loc=XX` line with the ISO 3166-1 alpha-2
 * country code. Returns the uppercase country code, or null if it couldn't be
 * determined (offline, timed out, unexpected body) — never throws, so a failed
 * lookup is silently treated as "not a blocked country".
 */
export const getUserCountry = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_URL.replace(/\/+$/u, "")}/cdn-cgi/trace`,
      { signal: getAbortWithTimeout(COUNTRY_LOOKUP_TIMEOUT_MS).signal },
    );

    if (!response?.ok) return null;

    const text = await response.text();
    const country = text.match(/^loc=([A-Z]{2})$/mu)?.[1];

    return country ?? null;
  } catch {
    return null;
  }
};
