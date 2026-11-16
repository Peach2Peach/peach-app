import { error } from "../log/error";
import { AddressIndex } from "./bdkShim";
import { saveLastAddressUsedIndex } from "./saveLastAddressUsedIndex";
import { peachWallet } from "./setWallet";
import { useWalletState } from "./walletStore";

/**
 * @description picks a release address that has never been handed out before
 * and records its index right away (locally and on the server).
 *
 * Three sources know which indices were already used and none of them is
 * reliable on its own: the server's lastAddressUsedIndex (the save can fail or
 * the cached user can be stale), the BDK wallet (the JS fallback below never
 * touches it, and it starts over when the db is lost or kept in memory) and the
 * locally persisted externalUsedIndices. The address is taken above the highest
 * index any of them knows.
 *
 * The index is recorded before the caller sends the address to the server: if
 * that request fails client side but went through server side, the address
 * must still count as used. Skipping an index that ends up unused costs nothing.
 */
export const getNewReleaseAddress = (lastAddressUsedIndex?: number | null) => {
  if (!peachWallet) throw Error("Wallet is not defined");

  const floor = Math.max(
    lastAddressUsedIndex ?? -1,
    ...useWalletState.getState().externalUsedIndices,
  );

  let index: number;
  let address: string;
  try {
    // the next index BDK has not revealed yet (revealed and marked used here)
    const next = peachWallet.getAddress(
      AddressIndex.LastUnused,
      "external",
      true,
    );
    const result =
      next.index > floor
        ? next
        : peachWallet.getAddress(floor + 1, "external", true);
    index = result.index;
    address = result.address;
  } catch (e) {
    // The BDK wallet can fail to resolve an address (e.g. not loaded yet).
    // Derive it from the JS wallet so the buyer can still go on.
    error("getNewReleaseAddress - BDK failed, using JS wallet", e);
    index = floor + 1;
    address = peachWallet.getAddressFromJsWallet(index);
    // BDK did not see this index: remember it locally so it is never reused
    useWalletState.getState().markExternalIndexUsed(index);
  }

  saveLastAddressUsedIndex(index);
  return { address, index };
};
