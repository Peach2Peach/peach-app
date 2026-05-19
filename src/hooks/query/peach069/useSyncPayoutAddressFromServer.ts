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
import { useUploadPayoutAddressToServer } from "./useUploadPayoutAddressToServer";
import { user69DetailsKeys } from "./useUser69";

const REFRESH_INTERVAL = MSINAMINUTE * 1.5;
const NO_CIPHER_SENTINEL = "<<no-server-payout-address>>";

let lastAppliedCipher: string | null = null;
let lastWarnedCipher: string | null = null;

export const useSyncPayoutAddressFromServer = () => {
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);
  const setPopup = useSetPopup();
  const uploadPayoutAddressToServer = useUploadPayoutAddressToServer();

  const { data } = useQuery({
    queryKey: user69DetailsKeys.details(),
    queryFn: fetchSelfUser69,
    enabled: isLoggedIn && !!publicKey,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });

  const dataLoaded = data !== undefined;
  const encryptedCustomPayoutAddress =
    data?.encryptedCustomPayoutAddress ?? null;
  const encryptedCustomPayoutAddressSignature =
    data?.encryptedCustomPayoutAddressSignature ?? null;

  useEffect(() => {
    if (!dataLoaded) return;

    if (!encryptedCustomPayoutAddress || !encryptedCustomPayoutAddressSignature) {
      if (lastAppliedCipher !== NO_CIPHER_SENTINEL) {
        const state = useSettingsStore.getState();
        const hasLocal =
          state.payoutAddress !== undefined ||
          state.payoutAddressLabel !== undefined ||
          state.payoutAddressSignature !== undefined;
        if (hasLocal) {
          info(
            "[syncPayoutAddress] backfilling local payout address to server (server null)",
          );
          uploadPayoutAddressToServer();
        }
        lastAppliedCipher = NO_CIPHER_SENTINEL;
      }
      return;
    }

    if (encryptedCustomPayoutAddress === lastAppliedCipher) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await decryptAndApplyPayoutAddress(
          encryptedCustomPayoutAddress,
          encryptedCustomPayoutAddressSignature,
        );
        if (
          !cancelled &&
          result === null &&
          encryptedCustomPayoutAddress !== lastWarnedCipher
        ) {
          lastWarnedCipher = encryptedCustomPayoutAddress;
          setPopup(
            createElement(InvalidServerSignaturePopup, {
              source: "payoutAddress",
            }),
          );
          wipePayoutAddressOnServer(myPgpPubKey).catch((e) =>
            error(
              "[syncPayoutAddress] failed to wipe tampered server payout address",
              e,
            ),
          );
        }
      } catch (e) {
        if (!cancelled)
          error(
            "[syncPayoutAddress] failed to decrypt server payout address",
            e,
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    dataLoaded,
    encryptedCustomPayoutAddress,
    encryptedCustomPayoutAddressSignature,
    myPgpPubKey,
    setPopup,
    uploadPayoutAddressToServer,
  ]);
};

export async function decryptAndApplyPayoutAddress(
  encryptedCustomPayoutAddress: string,
  encryptedCustomPayoutAddressSignature: string,
): Promise<{
  address: string | undefined;
  label: string | undefined;
  bip322Signature: string | undefined;
} | null> {
  if (encryptedCustomPayoutAddress === lastAppliedCipher) {
    const { payoutAddress, payoutAddressLabel, payoutAddressSignature } =
      useSettingsStore.getState();
    return {
      address: payoutAddress,
      label: payoutAddressLabel,
      bip322Signature: payoutAddressSignature,
    };
  }
  const decrypted = await decrypt(encryptedCustomPayoutAddress);
  const { publicKey: ownPublicKey } = useAccountStore.getState().account.pgp;
  const isValid = await hasValidSignature({
    signature: encryptedCustomPayoutAddressSignature,
    message: decrypted,
    publicKeys: [{ publicKey: ownPublicKey }],
  });
  if (!isValid) {
    error("[syncPayoutAddress] invalid signature on server payout address");
    return null;
  }

  const parsed = JSON.parse(decrypted) as Record<string, unknown>;
  const address =
    typeof parsed.address === "string" ? parsed.address : undefined;
  const label = typeof parsed.label === "string" ? parsed.label : undefined;
  const bip322Signature =
    typeof parsed.bip322Signature === "string"
      ? parsed.bip322Signature
      : undefined;

  info("[syncPayoutAddress] applying server payout address", !!address);

  const state = useSettingsStore.getState();
  state.setPayoutAddress(address);
  state.setPayoutAddressLabel(label);
  state.setPayoutAddressSignature(bip322Signature);
  lastAppliedCipher = encryptedCustomPayoutAddress;
  return { address, label, bip322Signature };
}

async function wipePayoutAddressOnServer(myPgpPubKey: string) {
  const payload = JSON.stringify({
    address: null,
    label: null,
    confirmationPhrase: null,
    bip322Signature: null,
  });
  const { signature, encrypted } = await signAndEncrypt(payload, myPgpPubKey);
  await peachAPI.private.peach069.setEncryptedCustomPayoutAddressOnSelfUser69({
    encryptedCustomPayoutAddress: encrypted,
    encryptedCustomPayoutAddressSignature: signature,
  });
  info("[syncPayoutAddress] wiped tampered server payout address");
}

async function fetchSelfUser69() {
  const { result, error: err } =
    await peachAPI.private.peach069.getSelfUser69();

  if (err) {
    error("[syncPayoutAddress] getSelfUser69 failed", JSON.stringify(err));
    throw new Error("GET_SELF_USER_FAILED");
  }

  return result?.user ?? null;
}
