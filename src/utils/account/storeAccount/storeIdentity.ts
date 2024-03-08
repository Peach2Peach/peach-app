import { info } from "../../log/info";
import { accountStorage } from "../accountStorage";

export const storeIdentity = async (acc: Account) => {
  if (!acc.publicKey) throw new Error("ERROR_SAVE_ACCOUNT");

  info("storeIdentity - Storing identity");
  await accountStorage.setMapAsync("identity", {
    publicKey: acc.publicKey,
    mnemonic: acc.mnemonic,
    pgp: acc.pgp,
    base58: acc.base58,
  });
};
