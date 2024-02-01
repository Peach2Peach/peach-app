import { NETWORK } from "@env";
import { crypto } from "bitcoinjs-lib";
import { useAccountStore } from "../account/account";
import { getMainAccount } from "../account/getMainAccount";
import { peachAPI } from "../peachAPI";
import { getWallet } from "../wallet/getWallet";

export const createUserRating = (
  userId: User["id"],
  rating: Rating["rating"],
): Rating => {
  const keyPair =
    peachAPI.apiOptions.peachAccount || getMainAccount(getWallet(), NETWORK);

  const signature = keyPair
    .sign(crypto.sha256(Buffer.from(userId)))
    .toString("hex");

  const ratedBy = useAccountStore.getState().account.publicKey;

  return {
    creationDate: new Date(),
    rating,
    ratedBy,
    signature,
  };
};
