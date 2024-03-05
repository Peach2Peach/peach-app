import { APIError } from "../../peach-api/src/@types/global";
import { MSINASECOND, setClientServerTimeDifference } from "../constants";
import { PAYMENTCATEGORIES, setPaymentMethods } from "../paymentMethods";
import { useConfigStore } from "../store/configStore/configStore";
import { usePaymentDataStore } from "../store/usePaymentDataStore";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import { error } from "../utils/log/error";
import { shouldUsePaymentMethod } from "../utils/paymentMethod/shouldUsePaymentMethod";
import { peachAPI } from "../utils/peachAPI";

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
  const statusResponse = await calculateClientServerTimeDifference();
  if (!statusResponse || statusResponse.error) {
    error("Server not available", statusResponse);
    setPaymentMethodsFromStore();
    return statusResponse;
  }

  const NUMBER_OF_SECONDS = 5;
  const { result: getInfoResponse, error: getInfoError } =
    await peachAPI.public.system.getInfo({
      signal: getAbortWithTimeout(NUMBER_OF_SECONDS * MSINASECOND).signal,
    });

  if (getInfoError) {
    error("Error fetching peach info", getInfoError.error);
    setPaymentMethodsFromStore();
  } else if (getInfoResponse) {
    storePeachInfo(getInfoResponse);
  }

  return statusResponse;
};

function storePeachInfo(peachInfo: GetInfoResponse) {
  const {
    setPaymentMethods: setPaymentMethodsStore,
    setLatestAppVersion,
    setMinAppVersion,
    setPeachFee,
    setPeachPGPPublicKey,
  } = useConfigStore.getState();

  const paymentMethods = peachInfo.paymentMethods.filter(
    shouldUsePaymentMethod(PAYMENTCATEGORIES),
  );
  setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey);
  setPaymentMethodsStore(paymentMethods);
  setPaymentMethods(paymentMethods);
  setPeachFee(peachInfo.fees.escrow);
  setLatestAppVersion(peachInfo.latestAppVersion);
  setMinAppVersion(peachInfo.minAppVersion);
}

/**
 * Note: we estimate the time it took for the response to arrive from server to client
 * by dividing the round trip time in half
 * This is only an estimation as round trips are often asymmetric
 */
const AMOUNT_OF_SECONDS = 10;
async function calculateClientServerTimeDifference() {
  const start = Date.now();
  const { result: peachStatusResponse, error: peachStatusErr } =
    await peachAPI.public.system.getStatus({
      signal: getAbortWithTimeout(AMOUNT_OF_SECONDS * MSINASECOND).signal,
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
