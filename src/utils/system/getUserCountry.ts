import { API_URL } from "@env";
import fetch from "../fetch";

/**
 * Reads the country Cloudflare believes the user is connecting from.
 *
 * Cloudflare exposes a `/cdn-cgi/trace` endpoint on every proxied domain that
 * returns plain text including a `loc=XX` line with the ISO 3166-1 alpha-2
 * country code. Returns the uppercase country code, or null if it couldn't be
 * determined (e.g. offline).
 */
export const getUserCountry = async (): Promise<string | null> => {
  const response = await fetch(`${API_URL.replace(/\/+$/u, "")}/cdn-cgi/trace`);

  if (!response?.ok) return null;

  const text = await response.text();
  const country = text.match(/^loc=([A-Z]{2})$/mu)?.[1];

  return country ?? null;
};
