// Fail-closed network gate for the Nym mixnet ("VPN").
//
// When the mixnet is enabled we must never let a request leak out on the real
// connection while Nym is still connecting (or if it fails). The native proxy
// layer (iOS SystemProxy / Android NymProxyHolder) enforces this by pointing at
// a dead local port ("armed") until Nym is actually connected ("routed"), so
// every fetch/WebSocket/wallet connection is refused rather than sent directly.
//
// This module mirrors that state in JS so the one path we can gate cleanly — the
// Peach API WebSocket — WAITS for a safe state instead of failing+retrying:
//   - `off`     : Nym disabled → direct is fine.
//   - `armed`   : Nym enabled but not connected (or failed) → hold (fail-closed).
//   - `routed`  : Nym connected → traffic flows through the mixnet.
//   - `unknown` : startup, before we've read the store → hold until decided.
//
// The escape hatch is never network-gated: the UI renders on local hydration and
// the "Nym failed" toast disables the mixnet in one tap, flipping this to `off`.

import { isNetworkError } from "../../system/isNetworkError";

export type NymGateState = "unknown" | "off" | "armed" | "routed";

let state: NymGateState = "unknown";
let readyWaiters: Array<() => void> = [];

// When the gate last became "routed". A blackholed request's error can surface
// (via retries) shortly AFTER a fast connect flips armed→routed, so network
// errors are still treated as expected for a brief grace window after routing.
let routedAt = 0;
const ROUTED_GRACE_MS = 5000;

/** Resolves once it's safe to open a real connection: Nym is connected
 *  (`routed`) or disabled (`off`). While `armed`/`unknown` it waits. */
export function whenNetworkReady(): Promise<void> {
  if (state === "routed" || state === "off") return Promise.resolve();
  return new Promise<void>((resolve) => readyWaiters.push(resolve));
}

export function setNymGate(next: NymGateState) {
  state = next;
  if (next === "routed") routedAt = Date.now();
  if (next === "routed" || next === "off") {
    const waiters = readyWaiters;
    readyWaiters = [];
    waiters.forEach((resolve) => resolve());
  }
}

export function getNymGate(): NymGateState {
  return state;
}

/**
 * True when a network error should be SUPPRESSED because the mixnet is armed —
 * it's deliberately blackholing all traffic while it connects (or after it
 * failed and is holding), so network failures are expected, not real. The
 * mixnet's own "connecting"/"failed" toast owns that UX; a red network-error
 * toast would just overwrite it and scare the user. Only `armed` qualifies:
 * `off`/`routed` errors are real and must surface.
 */
export function isExpectedMixnetBlackhole(message?: string | null): boolean {
  if (!isNetworkError(message)) return false;
  return (
    state === "armed" ||
    (state === "routed" && Date.now() - routedAt < ROUTED_GRACE_MS)
  );
}
