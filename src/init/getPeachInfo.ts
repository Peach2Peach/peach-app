import { GetInfoResponseBody } from "../../peach-api/src/@types/api/systemAPI";
import { APIError } from "../../peach-api/src/@types/global";
import { MSINASECOND, setClientServerTimeDifference } from "../constants";
import { PAYMENTCATEGORIES, setPaymentMethods } from "../paymentMethods";
import { useConfigStore } from "../store/configStore/configStore";
import { usePaymentDataStore } from "../store/usePaymentDataStore";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import { error } from "../utils/log/error";
import { shouldUsePaymentMethod } from "../utils/paymentMethod/shouldUsePaymentMethod";
import { peachAPI } from "../utils/peachAPI";
import { getNymGate, whenGateDecided } from "../utils/wallet/nym/nymGate";

// Requests through the mixnet carry real extra latency (multi-hop, cover
// traffic, a remote exit), so the direct-connection budgets below are too tight
// once routed and would time out a request that was going to succeed.
const MIXNET_TIMEOUT_MULTIPLIER = 3;
const STATUS_TIMEOUT_SECONDS = 10;
const INFO_TIMEOUT_SECONDS = 5;

// Upper bound on waiting for the mixnet ON/OFF decision. That decision is a
// local storage read (milliseconds), and the kill switch guarantees one within
// its own hydration safety net, so this only ever trips on a storage failure —
// where proceeding into the blackhole is no worse than today's behaviour.
const GATE_DECISION_TIMEOUT_SECONDS = 5;
const GATE_DECISION_TIMEOUT_MS = GATE_DECISION_TIMEOUT_SECONDS * MSINASECOND;

const requestTimeout = (seconds: number) =>
  seconds *
  MSINASECOND *
  (getNymGate() === "routed" ? MIXNET_TIMEOUT_MULTIPLIER : 1);

// Whether a getInfo response has been stored since launch. Drives the retry in
// `retryInitWhenNetworkReady` — a boot attempt that was blackholed by the
// mixnet kill switch leaves this false and must be repeated once the gate opens.
let infoLoaded = false;

export const isPeachInfoLoaded = () => infoLoaded;

const setPaymentMethodsFromStore = () => {
  setPaymentMethods(
    useConfigStore
      .getState()
      .paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)),
  );
};

export const getPeachInfo = async (): Promise<
  GetStatusResponse | APIError<"HUMAN_VERIFICATION_REQUIRED"> | null | undefined
> => {
  if (
    !useConfigStore.persist.hasHydrated() ||
    !usePaymentDataStore.persist.hasHydrated()
  ) {
    await new Promise((resolve) => setTimeout(resolve, MSINASECOND));
    return getPeachInfo();
  }

  // The kill switch blackholes traffic from App's first render, BEFORE the
  // persisted mixnet state has hydrated — so at this point a request may be
  // certain to fail without the mixnet being enabled at all. Waiting for the
  // decision costs milliseconds and, when the mixnet is off, means the request
  // goes out on a live connection instead of failing and reporting a spurious
  // "can't reach Peach" error. It deliberately does NOT wait for the mixnet to
  // connect: that takes ~30s and would hold the bootsplash.
  await whenGateDecided(GATE_DECISION_TIMEOUT_MS);

  const statusResponse = await calculateClientServerTimeDifference();
  if (!statusResponse || statusResponse.error) {
    error("Server not available", statusResponse);
    setPaymentMethodsFromStore();
    return statusResponse;
  }

  const { result: getInfoResponse, error: getInfoError } =
    await peachAPI.public.system.getInfo({
      signal: getAbortWithTimeout(requestTimeout(INFO_TIMEOUT_SECONDS)).signal,
    });

  if (getInfoError) {
    error("Error fetching peach info", getInfoError.error);
    setPaymentMethodsFromStore();
  } else if (getInfoResponse) {
    storePeachInfo(getInfoResponse);
    infoLoaded = true;
  }

  return statusResponse;
};

function storePeachInfo(peachInfo: GetInfoResponseBody) {
  const {
    setPaymentMethods: setPaymentMethodsStore,
    setPeachFee,
    setPeachPGPPublicKey,
    setWebAppAvailable,
    setShowPasteDesktopConnection,
  } = useConfigStore.getState();

  const paymentMethods = peachInfo.paymentMethods.filter(
    shouldUsePaymentMethod(PAYMENTCATEGORIES),
  );
  setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey);
  setPaymentMethodsStore(paymentMethods);
  setPaymentMethods(paymentMethods);
  setPeachFee(peachInfo.fees.escrow);
  setWebAppAvailable(peachInfo.webAppAvailable ?? false);
  setShowPasteDesktopConnection(peachInfo.showPasteDesktopConnection ?? false);
}

/**
 * Note: we estimate the time it took for the response to arrive from server to client
 * by dividing the round trip time in half
 * This is only an estimation as round trips are often asymmetric
 */
async function calculateClientServerTimeDifference() {
  const start = Date.now();
  const { result: peachStatusResponse, error: peachStatusErr } =
    await peachAPI.public.system.getStatus({
      signal: getAbortWithTimeout(requestTimeout(STATUS_TIMEOUT_SECONDS)).signal,
    });
  const end = Date.now();
  const roundTrip = (end - start) / 2;

  if (!peachStatusResponse || peachStatusErr) {
    error("Error peach server info", JSON.stringify(peachStatusErr));
    return peachStatusErr;
  }

  setClientServerTimeDifference(
    end - roundTrip - peachStatusResponse.serverTime,
  );
  return peachStatusResponse || peachStatusErr;
}
