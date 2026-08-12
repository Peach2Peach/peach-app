/* eslint-disable no-await-in-loop -- the loop is serial by nature: each attempt
   must observe the previous one's outcome (gate reopened? info now loaded?)
   before deciding whether to try again, so awaiting in sequence is correct. */
import { MSINASECOND } from "../constants";
import { getNymGate, whenNetworkReady } from "../utils/wallet/nym/nymGate";
import { isPeachInfoLoaded } from "./getPeachInfo";

// Enough to ride out a slow first bootstrap plus a couple of exit re-selections;
// bounded so a backend that is genuinely down isn't retried forever.
const MAX_ATTEMPTS = 3;
const SECONDS_BETWEEN_ATTEMPTS = 5;
const DELAY_BETWEEN_ATTEMPTS_MS = SECONDS_BETWEEN_ATTEMPTS * MSINASECOND;

// Boot can run more than once (the effect that drives it re-fires on hydration),
// and every run would otherwise arm its own retry loop.
let armed = false;

/**
 * Re-run init once the mixnet gate opens.
 *
 * The kill switch blackholes ALL traffic while Nym connects (fail-closed), and
 * connecting takes ~30s per attempt with several attempts budgeted — far beyond
 * boot's request timeouts. So with the mixnet enabled, boot's `getPeachInfo`
 * reliably fails and nothing ever re-ran it: for the whole session the client
 * keeps default fees, stale payment methods, no client/server time offset, and
 * an empty Peach PGP key — the last of which is what surfaced as
 * "no encryption recipient provided" when raising a dispute.
 *
 * Only the Peach API WebSocket waited on the gate; plain HTTP init did not.
 * This closes that gap for init.
 *
 * MUST NOT be awaited by boot: `whenNetworkReady` can legitimately take minutes
 * (or never resolve, if the mixnet never comes up and the user never disables
 * it), which would hold the bootsplash over a blank app.
 */
export const retryInitWhenNetworkReady = async (
  runInit: () => Promise<unknown>,
) => {
  const gate = getNymGate();
  // An already-open gate at boot means the network was up and the failure was
  // real, not a blackhole — repeating the identical request buys nothing.
  if (armed || isPeachInfoLoaded() || (gate !== "armed" && gate !== "unknown")) {
    return;
  }
  armed = true;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // Resolves when Nym is routed, or when the user disables it (gate `off`,
    // via the failed toast's one-tap escape hatch) and traffic goes direct.
    await whenNetworkReady();
    if (isPeachInfoLoaded()) return;

    await runInit();
    if (isPeachInfoLoaded()) return;

    await new Promise((resolve) => {
      setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS_MS);
    });
  }
};
