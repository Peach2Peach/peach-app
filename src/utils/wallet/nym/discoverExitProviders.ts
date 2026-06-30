import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";

// Nym mainnet API: every "described" node reports its declared roles and, when
// it runs an exit Network Requester, that NR's SOCKS5 provider address — exactly
// the value the embedded client needs as its exit.
const NYM_NODES_DESCRIBED =
  "https://validator.nymtech.net/api/v1/nym-nodes/described";

const DISCOVERY_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 20_000;

type DescribedNode = {
  description?: {
    declared_role?: { exit_nr?: boolean };
    network_requester?: { address?: string };
  };
};

let cache: { providers: string[]; fetchedAt: number } | undefined;

const isProviderAddress = (a: unknown): a is string =>
  typeof a === "string" && a.includes("@") && a.includes(".");

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Fetch the list of public Nym exit Network Requester provider addresses from
 * the Nym API. Filters nodes that declare the `exit_nr` role and returns their
 * `network_requester.address`, shuffled (for load distribution) and cached.
 *
 * These are the exits a user with no machine of their own can route through.
 * Reaching an arbitrary destination still depends on each exit's policy — which
 * is why the app restricts the mixnet to Esplora (HTTPS/443), a port public
 * exit policies generally allow.
 */
export async function discoverExitProviders(
  { force = false }: { force?: boolean } = {},
): Promise<string[]> {
  if (
    !force &&
    cache &&
    Date.now() - cache.fetchedAt < DISCOVERY_TTL_MS &&
    cache.providers.length > 0
  ) {
    return cache.providers;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(NYM_NODES_DESCRIBED, { signal: controller.signal });
    if (!res.ok) throw new Error(`Nym API ${res.status}`);
    const json = (await res.json()) as { data?: DescribedNode[] };
    const providers = (json.data ?? [])
      .filter((n) => n.description?.declared_role?.exit_nr === true)
      .map((n) => n.description?.network_requester?.address)
      .filter(isProviderAddress);

    if (providers.length === 0) throw new Error("no exit providers found");

    const shuffled = shuffle(providers);
    cache = { providers: shuffled, fetchedAt: Date.now() };
    info(`discoverExitProviders - found ${shuffled.length} exit providers`);
    return shuffled;
  } catch (e) {
    error("discoverExitProviders - failed", parseError(e));
    // Fall back to the last good list if we have one.
    if (cache?.providers.length) return cache.providers;
    throw new Error(`could not discover Nym exits: ${parseError(e)}`);
  } finally {
    clearTimeout(timeout);
  }
}
