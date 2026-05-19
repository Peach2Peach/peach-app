import { useQuery } from "@tanstack/react-query";
import { createElement, useEffect } from "react";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { MSINAMINUTE } from "../../../constants";
import { InvalidServerSignaturePopup } from "../../../popups/warning/InvalidServerSignaturePopup";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { error } from "../../../utils/log/error";
import { info } from "../../../utils/log/info";
import { peachAPI } from "../../../utils/peachAPI";
import { decrypt } from "../../../utils/pgp/decrypt";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { hasValidSignature } from "../../../views/contract/helpers/hasValidSignature";
import { useUploadPaymentDataToServer } from "./useUploadPaymentDataToServer";
import { user69DetailsKeys } from "./useUser69";

const REFRESH_INTERVAL = MSINAMINUTE * 1.5;
const NO_CIPHER_SENTINEL = "<<no-server-payment-data>>";

let lastAppliedCipher: string | null = null;
let lastWarnedCipher: string | null = null;

export const useSyncPaymentDataFromServer = () => {
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);
  const setPopup = useSetPopup();
  const uploadPaymentDataToServer = useUploadPaymentDataToServer();

  const { data } = useQuery({
    queryKey: user69DetailsKeys.details(),
    queryFn: fetchSelfUser69,
    enabled: isLoggedIn && !!publicKey,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });

  const dataLoaded = data !== undefined;
  const encryptedPaymentData = data?.encryptedPaymentData ?? null;
  const encryptedPaymentDataSignature =
    data?.encryptedPaymentDataSignature ?? null;

  useEffect(() => {
    if (!dataLoaded) return;

    if (!encryptedPaymentData || !encryptedPaymentDataSignature) {
      if (lastAppliedCipher !== NO_CIPHER_SENTINEL) {
        const localPaymentData = usePaymentDataStore.getState().paymentData;
        const hasLocal = Object.keys(localPaymentData).length > 0;
        if (hasLocal) {
          info(
            "[syncPaymentData] backfilling local payment data to server (server null)",
          );
          uploadPaymentDataToServer();
        }
        lastAppliedCipher = NO_CIPHER_SENTINEL;
      }
      return;
    }

    if (encryptedPaymentData === lastAppliedCipher) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await decryptAndApplyPaymentData(
          encryptedPaymentData,
          encryptedPaymentDataSignature,
        );
        if (
          !cancelled &&
          result === null &&
          encryptedPaymentData !== lastWarnedCipher
        ) {
          lastWarnedCipher = encryptedPaymentData;
          setPopup(
            createElement(InvalidServerSignaturePopup, {
              source: "paymentData",
            }),
          );
          wipePaymentDataOnServer(myPgpPubKey).catch((e) =>
            error(
              "[syncPaymentData] failed to wipe tampered server payment data",
              e,
            ),
          );
        }
      } catch (e) {
        if (!cancelled)
          error("[syncPaymentData] failed to decrypt server payment data", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    dataLoaded,
    encryptedPaymentData,
    encryptedPaymentDataSignature,
    myPgpPubKey,
    setPopup,
    uploadPaymentDataToServer,
  ]);
};

async function wipePaymentDataOnServer(myPgpPubKey: string) {
  const payload = JSON.stringify({});
  const { signature, encrypted } = await signAndEncrypt(payload, myPgpPubKey);
  await peachAPI.private.peach069.setEncryptedPaymentDataOnSelfUser69({
    encryptedPaymentData: encrypted,
    encryptedPaymentDataSignature: signature,
  });
  info("[syncPaymentData] wiped tampered server payment data");
}

export async function decryptAndApplyPaymentData(
  encryptedPaymentData: string,
  encryptedPaymentDataSignature: string,
): Promise<Record<string, PaymentData> | null> {
  if (encryptedPaymentData === lastAppliedCipher) {
    return usePaymentDataStore.getState().paymentData;
  }
  const decrypted = await decrypt(encryptedPaymentData);
  const { publicKey: ownPublicKey } = useAccountStore.getState().account.pgp;
  const isValid = await hasValidSignature({
    signature: encryptedPaymentDataSignature,
    message: decrypted,
    publicKeys: [{ publicKey: ownPublicKey }],
  });
  if (!isValid) {
    error("[syncPaymentData] invalid signature on server payment data");
    return null;
  }
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
