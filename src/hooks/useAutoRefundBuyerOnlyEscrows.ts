import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";
import { ContractSummary } from "../../peach-api/src/@types/contract";
import { useSetToast } from "../components/toast/Toast";
import { MSINAMINUTE, MSINASECOND } from "../constants";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../utils/account/account";
import {
  BuyerOnlyEscrowRefundResult,
  refundBuyerOnlyEscrow,
} from "../utils/contract/refundBuyerOnlyEscrow";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { parseError } from "../utils/parseError";
import { createStorage } from "../utils/storage/createStorage";
import { getWallet } from "../utils/wallet/getWallet";
import { contractKeys } from "./query/useContractDetail";
import { getContractSummariesQuery } from "./query/useContractSummaries";

// statuses a canceled contract can show the buyer while its refund is open
const CANDIDATE_STATUSES: TradeStatus[] = [
  "tradeCanceled",
  "refundTxSignatureRequired",
];

// contracts that were refunded or can never need a refund from us, so old
// canceled trades aren't fetched again on every app open
const settledStorage = createStorage("buyerOnlyEscrowRefunds");
const SETTLED_KEY = "settledContractIds";

const getSettled = () =>
  new Set((settledStorage.getArray<string>(SETTLED_KEY) ?? []).map(String));
const markSettled = (contractId: string) => {
  const settled = getSettled();
  settled.add(contractId);
  settledStorage.setArray(SETTLED_KEY, [...settled]);
};

const isSettled = (result: BuyerOnlyEscrowRefundResult) =>
  result === "refunded" || result === "never";

type Summary = Pick<ContractSummary, "id" | "type" | "tradeStatus" | "refunded">;

// a contract that failed or wasn't due yet is tried again at most this often
const RETRY_AFTER = MSINAMINUTE;
const lastAttempt = new Map<string, number>();

const getCandidates = (summaries: Summary[]) => {
  const settled = getSettled();
  const now = Date.now();
  return summaries.filter(
    ({ id, type, tradeStatus, refunded }) =>
      type === "bid" &&
      CANDIDATE_STATUSES.includes(tradeStatus) &&
      !refunded &&
      !settled.has(id) &&
      now - (lastAttempt.get(id) ?? 0) >= RETRY_AFTER,
  );
};

let running: Promise<void> | null = null;

/**
 * @description signs every refund that is due on our canceled escrowVersion 3
 * contracts. Silent: errors are only logged, the user is told on success.
 * Pass the summaries when they are at hand, otherwise they are fetched.
 * A call while a run is going on is dropped: the next trigger catches up.
 */
export function runAutoBuyerRefunds(
  onRefunded: (contractId: string) => void,
  summaries?: Summary[],
) {
  if (!running) {
    running = refundAll(onRefunded, summaries).finally(() => {
      running = null;
    });
  }
  return running;
}

async function refundAll(
  onRefunded: (contractId: string) => void,
  knownSummaries?: Summary[],
) {
  // right after login the wallet may not be loaded yet; the next summaries
  // refresh tries again instead of failing every contract now
  if (!getWallet()) {
    info("[autoBuyerRefund] wallet not ready yet, will retry");
    return;
  }
  try {
    if (knownSummaries && getCandidates(knownSummaries).length === 0) return;
    const summaries = knownSummaries ?? (await getContractSummariesQuery());
    const candidates = getCandidates(summaries);
    if (candidates.length > 0) {
      info(
        "[autoBuyerRefund] checking",
        candidates.map(({ id }) => id).join(","),
      );
    }

    // one at a time: each signs with a fresh PSBT
    for (const { id } of candidates) {
      lastAttempt.set(id, Date.now());
      try {
        // eslint-disable-next-line no-await-in-loop -- deliberately sequential
        const result = await refundBuyerOnlyEscrow(id);
        info("[autoBuyerRefund]", id, result);
        if (isSettled(result)) markSettled(id);
        if (result === "refunded") {
          info("[autoBuyerRefund] refunded", id);
          onRefunded(id);
        }
      } catch (e) {
        error("[autoBuyerRefund] failed", id, parseError(e));
      }
    }
  } catch (e) {
    error("[autoBuyerRefund] could not load contracts", parseError(e));
  }
}

/**
 * @description tells the user a refund went out and refreshes the contract
 */
export const useOnBuyerRefunded = () => {
  const queryClient = useQueryClient();
  const setToast = useSetToast();

  return useCallback(
    (contractId: string) => {
      markSettled(contractId);
      setToast({
        msgKey: "contract.buyer.refundEscrow.success",
        color: "yellow",
        duration: MSINASECOND * 5,
      });
      invalidateContract(queryClient, contractId);
    },
    [queryClient, setToast],
  );
};

function invalidateContract(queryClient: QueryClient, contractId: string) {
  queryClient.invalidateQueries({ queryKey: contractKeys.detail(contractId) });
  queryClient.invalidateQueries({ queryKey: contractKeys.summaries() });
}

/**
 * @description runs the buyer refunds when the app opens, every time it comes
 * back to the foreground, and whenever the contract summaries refresh
 */
export const useAutoRefundBuyerOnlyEscrows = () => {
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const onBuyerRefunded = useOnBuyerRefunded();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn || !publicKey) return undefined;

    runAutoBuyerRefunds(onBuyerRefunded);
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") runAutoBuyerRefunds(onBuyerRefunded);
      },
    );

    // the home screen and trades list refresh the summaries every few
    // seconds: reuse that data, so a trade canceled meanwhile is picked up
    const summariesKey = JSON.stringify(contractKeys.summaries());
    const unsubscribeCache = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type !== "updated" ||
        event.action.type !== "success" ||
        JSON.stringify(event.query.queryKey) !== summariesKey
      ) {
        return;
      }
      const summaries = event.query.state.data as Summary[] | undefined;
      if (summaries) runAutoBuyerRefunds(onBuyerRefunded, summaries);
    });

    return () => {
      appStateSubscription.remove();
      unsubscribeCache();
    };
  }, [isLoggedIn, publicKey, onBuyerRefunded, queryClient]);
};
