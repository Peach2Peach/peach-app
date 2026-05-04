import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { MSINAMINUTE } from "../../../constants";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { error } from "../../../utils/log/error";
import { info } from "../../../utils/log/info";
import { peachAPI } from "../../../utils/peachAPI";
import { decrypt } from "../../../utils/pgp/decrypt";
import { user69DetailsKeys } from "./useUser69";

const REFRESH_INTERVAL = MSINAMINUTE * 1.5;

let lastAppliedCipher: string | null = null;

export const useSyncPaymentDataFromServer = () => {
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const publicKey = useAccountStore((state) => state.account.publicKey);

  const { data } = useQuery({
    queryKey: user69DetailsKeys.details(),
    queryFn: fetchSelfUser69,
    enabled: isLoggedIn && !!publicKey,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });

  const encryptedPaymentData = data?.encryptedPaymentData ?? null;

  useEffect(() => {
    if (!encryptedPaymentData || encryptedPaymentData === lastAppliedCipher)
      return;
    let cancelled = false;
    (async () => {
      try {
        await decryptAndApplyPaymentData(encryptedPaymentData);
      } catch (e) {
        if (!cancelled)
          error("[syncPaymentData] failed to decrypt server payment data", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [encryptedPaymentData]);
};

export async function decryptAndApplyPaymentData(
  encryptedPaymentData: string,
): Promise<Record<string, PaymentData>> {
  if (encryptedPaymentData === lastAppliedCipher) {
    return usePaymentDataStore.getState().paymentData;
  }
  const decrypted = await decrypt(encryptedPaymentData);
  const parsed = JSON.parse(decrypted) as Record<string, unknown>;
  const cleaned = sanitizePaymentDataMap(parsed);
  info(
    "[syncPaymentData] applying server payment data",
    Object.keys(cleaned).length,
    "entries (",
    Object.keys(parsed).length - Object.keys(cleaned).length,
    "dropped)",
  );
  usePaymentDataStore.getState().replaceAllPaymentData(cleaned);
  lastAppliedCipher = encryptedPaymentData;
  return cleaned;
}

function sanitizePaymentDataMap(
  raw: Record<string, unknown>,
): Record<string, PaymentData> {
  const result: Record<string, PaymentData> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!isValidPaymentData(value)) {
      error("[syncPaymentData] dropping malformed entry", key);
      continue;
    }
    result[key] = value;
  }
  return result;
}

function isValidPaymentData(value: unknown): value is PaymentData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.type === "string" &&
    typeof v.label === "string" &&
    Array.isArray(v.currencies)
  );
}

async function fetchSelfUser69() {
  const { result, error: err } =
    await peachAPI.private.peach069.getSelfUser69();

  if (err) {
    error("[syncPaymentData] getSelfUser69 failed", JSON.stringify(err));
    throw new Error("GET_SELF_USER_FAILED");
  }

  return result?.user ?? null;
}
