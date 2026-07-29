import { BLOCKED_COUNTRIES } from "../../../init/checkBlockedCountry";
import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";

const NYM_NODES_DESCRIBED =
  "https://validator.nymtech.net/api/v1/nym-nodes/described";
const DISCOVERY_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 20_000;

type DescribedNode = {
  description?: {
    declared_role?: { exit_nr?: boolean };
    auxiliary_details?: { location?: string };
  };
};

let cache: { countries: string[]; fetchedAt: number } | undefined;

/**
 * ISO 3166-1 alpha-2 countries that currently have a Nym exit network requester,
 * with Peach's {@link BLOCKED_COUNTRIES} removed. Sorted, cached. This is the
 * universe of exit countries the mixnet is allowed to use — the mixnet must
 * never be told "any country" or it could route through a blocked one, so this
 * list (or a user-chosen subset of it) is always what gets passed to the client.
 */
export async function getAllowedExitCountries(
  { force = false }: { force?: boolean } = {},
): Promise<string[]> {
  if (
    !force &&
    cache &&
    Date.now() - cache.fetchedAt < DISCOVERY_TTL_MS &&
    cache.countries.length > 0
  ) {
    return cache.countries;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(NYM_NODES_DESCRIBED, { signal: controller.signal });
    if (!res.ok) throw new Error(`Nym API ${res.status}`);
    const json = (await res.json()) as { data?: DescribedNode[] };

    const blocked = new Set(BLOCKED_COUNTRIES);
    const supported = new Set<string>();
    for (const node of json.data ?? []) {
      const d = node.description;
      if (!d?.declared_role?.exit_nr) continue;
      const loc = d.auxiliary_details?.location?.toUpperCase();
      if (loc && loc.length === 2 && !blocked.has(loc)) supported.add(loc);
    }

    const countries = [...supported].sort();
    if (countries.length === 0) throw new Error("no allowed exit countries found");
    cache = { countries, fetchedAt: Date.now() };
    info(`getAllowedExitCountries - ${countries.length} allowed exit countries`);
    return countries;
  } catch (e) {
    error("getAllowedExitCountries - failed", parseError(e));
    if (cache?.countries.length) return cache.countries;
    throw new Error(`could not fetch Nym exit countries: ${parseError(e)}`);
  } finally {
    clearTimeout(timeout);
  }
}
