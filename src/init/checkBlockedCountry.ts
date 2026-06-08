import { getUserCountry } from "../utils/system/getUserCountry";

/**
 * ISO 3166-1 alpha-2 country codes that Cloudflare blocks from reaching the
 * Peach backend. Keep in sync with the Cloudflare firewall rules.
 */
export const BLOCKED_COUNTRIES = [
  "US", // United States
  "KP", // North Korea
  "MM", // Myanmar
  "CN", // China
  "DZ", // Algeria
  "BD", // Bangladesh
  "NP", // Nepal
  "AF", // Afghanistan
  "MA", // Morocco
  "EG", // Egypt
  "BO", // Bolivia
  "QA", // Qatar
  "TN", // Tunisia
  "PK", // Pakistan
  "VN", // Vietnam
  "ID", // Indonesia
  "NG", // Nigeria
  "IR", // Iran
];

/**
 * Returns the user's country code if they are connecting from a blocked
 * country, otherwise null.
 */
export const checkBlockedCountry = async (): Promise<string | null> => {
  const country = await getUserCountry();

  if (country && BLOCKED_COUNTRIES.includes(country)) return country;

  return null;
};
