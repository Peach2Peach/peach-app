import { useQuery } from "@tanstack/react-query";
import { createElement, useEffect } from "react";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { MSINAMINUTE } from "../../../constants";
import { InvalidServerSignaturePopup } from "../../../popups/warning/InvalidServerSignaturePopup";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { error } from "../../../utils/log/error";
import { info } from "../../../utils/log/info";
import { peachAPI } from "../../../utils/peachAPI";
import { decrypt } from "../../../utils/pgp/decrypt";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { hasValidSignature } from "../../../views/contract/helpers/hasValidSignature";
import { useUploadRefundAddressToServer } from "./useUploadRefundAddressToServer";
import { user69DetailsKeys } from "./useUser69";

const REFRESH_INTERVAL = MSINAMINUTE * 1.5;
const NO_CIPHER_SENTINEL = "<<no-server-refund-address>>";

let lastAppliedCipher: string | null = null;
let lastWarnedCipher: string | null = null;

export const useSyncRefundAddressFromServer = () => {
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);
  const setPopup = useSetPopup();
  const uploadRefundAddressToServer = useUploadRefundAddressToServer();

  const { data } = useQuery({
    queryKey: user69DetailsKeys.details(),
    queryFn: fetchSelfUser69,
    enabled: isLoggedIn && !!publicKey,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });

  const dataLoaded = data !== undefined;
  const encryptedCustomRefundAddress =
    data?.encryptedCustomRefundAddress ?? null;
  const encryptedCustomRefundAddressSignature =
    data?.encryptedCustomRefundAddressSignature ?? null;

  useEffect(() => {
    if (!dataLoaded) return;

    if (!encryptedCustomRefundAddress || !encryptedCustomRefundAddressSignature) {
      if (lastAppliedCipher !== NO_CIPHER_SENTINEL) {
        const state = useSettingsStore.getState();
        const hasLocal =
          state.refundAddress !== undefined ||
          state.refundAddressLabel !== undefined;
        if (hasLocal) {
          info(
            "[syncRefundAddress] backfilling local refund address to server (server null)",
          );
          uploadRefundAddressToServer();
        }
        lastAppliedCipher = NO_CIPHER_SENTINEL;
      }
      return;
    }

    if (encryptedCustomRefundAddress === lastAppliedCipher) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await decryptAndApplyRefundAddress(
          encryptedCustomRefundAddress,
          encryptedCustomRefundAddressSignature,
        );
        if (
          !cancelled &&
          result === null &&
          encryptedCustomRefundAddress !== lastWarnedCipher
        ) {
          lastWarnedCipher = encryptedCustomRefundAddress;
          setPopup(
            createElement(InvalidServerSignaturePopup, {
              source: "refundAddress",
            }),
          );
          wipeRefundAddressOnServer(myPgpPubKey).catch((e) =>
            error(
              "[syncRefundAddress] failed to wipe tampered server refund address",
              e,
            ),
          );
        }
      } catch (e) {
        if (!cancelled)
          error(
            "[syncRefundAddress] failed to decrypt server refund address",
            e,
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    dataLoaded,
    encryptedCustomRefundAddress,
    encryptedCustomRefundAddressSignature,
    myPgpPubKey,
    setPopup,
    uploadRefundAddressToServer,
  ]);
};

async function wipeRefundAddressOnServer(myPgpPubKey: string) {
  const payload = JSON.stringify({ address: null, label: null });
  const { signature, encrypted } = await signAndEncrypt(payload, myPgpPubKey);
  await peachAPI.private.peach069.setEncryptedCustomRefundAddressOnSelfUser69({
    encryptedCustomRefundAddress: encrypted,
    encryptedCustomRefundAddressSignature: signature,
  });
  info("[syncRefundAddress] wiped tampered server refund address");
}

export async function decryptAndApplyRefundAddress(
  encryptedCustomRefundAddress: string,
  encryptedCustomRefundAddressSignature: string,
): Promise<{ address: string | undefined; label: string | undefined } | null> {
  if (encryptedCustomRefundAddress === lastAppliedCipher) {
    const { refundAddress, refundAddressLabel } = useSettingsStore.getState();
    return { address: refundAddress, label: refundAddressLabel };
  }
  const decrypted = await decrypt(encryptedCustomRefundAddress);
  const { publicKey: ownPublicKey } = useAccountStore.getState().account.pgp;
  const isValid = await hasValidSignature({
    signature: encryptedCustomRefundAddressSignature,
    message: decrypted,
    publicKeys: [{ publicKey: ownPublicKey }],
  });
  if (!isValid) {
    error("[syncRefundAddress] invalid signature on server refund address");
    return null;
  }

  const parsed = JSON.parse(decrypted) as Record<string, unknown>;
  const address =
    typeof parsed.address === "string" ? parsed.address : undefined;
  const label = typeof parsed.label === "string" ? parsed.label : undefined;

  info("[syncRefundAddress] applying server refund address", !!address);

  const state = useSettingsStore.getState();
  state.setRefundAddress(address);
  state.setRefundAddressLabel(label);
  lastAppliedCipher = encryptedCustomRefundAddress;
  return { address, label };
}

async function fetchSelfUser69() {
  const { result, error: err } =
    await peachAPI.private.peach069.getSelfUser69();

  if (err) {
    error("[syncRefundAddress] getSelfUser69 failed", JSON.stringify(err));
    throw new Error("GET_SELF_USER_FAILED");
  }

  return result?.user ?? null;
}
