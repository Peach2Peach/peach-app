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
let decidedWaiters: Array<() => void> = [];

/** States in which the native proxy is blackholing traffic, so every request
 *  fails by design. `unknown` counts: the kill switch arms the blackhole BEFORE
 *  the persisted mixnet state has hydrated, so traffic is already blocked while
 *  we still don't know whether it's about to be lifted or held. */
const isBlackholed = (gate: NymGateState) =>
  gate === "armed" || gate === "unknown";

// When traffic last stopped being blackholed (armed/unknown → routed/off). A
// blackholed request's error can surface shortly AFTER the gate opens — its
// own failure races the transition — so network errors stay "expected" for a
// brief grace window past it. Without this, the boot fetch that was refused
// while armed reports a real network error once the gate has flipped, which is
// exactly the spurious "can't reach Peach" toast non-mixnet users were seeing.
let unblockedAt = 0;
const UNBLOCKED_GRACE_MS = 5000;

/** Resolves once it's safe to open a real connection: Nym is connected
 *  (`routed`) or disabled (`off`). While `armed`/`unknown` it waits. */
export function whenNetworkReady(): Promise<void> {
  if (state === "routed" || state === "off") return Promise.resolve();
  return new Promise<void>((resolve) => readyWaiters.push(resolve));
}

/**
 * Resolves once the mixnet ON/OFF decision has been made — i.e. the persisted
 * state has hydrated and the gate is no longer `unknown`. This is a local
 * storage read, so it settles in milliseconds; it does NOT wait for the mixnet
 * to connect. Bounded by `timeoutMs` so a storage failure can't hang a caller.
 */
export function whenGateDecided(timeoutMs: number): Promise<void> {
  if (state !== "unknown") return Promise.resolve();
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    decidedWaiters.push(finish);
    // Whichever fires second is a no-op thanks to `settled`, so the timer needs
    // no clearing — it just expires harmlessly.
    setTimeout(finish, timeoutMs);
  });
}

export function setNymGate(next: NymGateState) {
  const wasBlackholed = isBlackholed(state);
  const wasUndecided = state === "unknown";
  state = next;
  if (wasBlackholed && !isBlackholed(next)) unblockedAt = Date.now();
  if (wasUndecided && next !== "unknown") {
    const waiters = decidedWaiters;
    decidedWaiters = [];
    waiters.forEach((resolve) => resolve());
  }
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
 * toast would just overwrite it and scare the user.
 *
 * Covers the grace window after the blackhole lifts as well, since a request
 * refused while armed can surface its error just after the flip.
 */
export function isExpectedMixnetBlackhole(message?: string | null): boolean {
  if (!isNetworkError(message)) return false;
  return isBlackholed(state) || Date.now() - unblockedAt < UNBLOCKED_GRACE_MS;
}
