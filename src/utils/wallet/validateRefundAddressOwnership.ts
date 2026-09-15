import { Psbt } from "bitcoinjs-lib";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { isAddressMine } from "./isAddressMine";
import { peachWallet } from "./setWallet";

export const UNKNOWN_REFUND_ADDRESS_ERROR = "REFUND_ADDRESS_NOT_OWNED";

/**
 * @description a refund sweeps the whole escrow UTXO back to the return
 * address, and it is Peach that builds the PSBT - so a wrong or swapped return
 * address would otherwise be signed blindly. Unless the user opted out via
 * `validateReturnAddressOwnership`, refuse to sign anything that does not pay
 * back into the Peach Wallet.
 *
 * Fails closed: an address that cannot be parsed, or a wallet that is not
 * loaded yet, counts as "not ours".
 */
export const validateRefundAddressOwnership = (psbt: Psbt) => {
  if (!useSettingsStore.getState().validateReturnAddressOwnership) return;
  if (!peachWallet?.wallet) throw new Error("WALLET_NOT_READY");

  const allOutputsAreMine = psbt.txOutputs.every((output) => {
    try {
      return !!output.address && isAddressMine(output.address);
    } catch {
      return false;
    }
  });

  if (!allOutputsAreMine) throw new Error(UNKNOWN_REFUND_ADDRESS_ERROR);
};
