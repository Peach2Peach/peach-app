import { Contract } from "../../../peach-api/src/@types/contract";
import { useAccountStore } from "../account/account";

export const getOfferIdFromContract = (contract: Contract) => {
  const publicKey = useAccountStore.getState().account.publicKey;
  return contract.id.split("-")[publicKey === contract.seller.id ? 0 : 1];
};
