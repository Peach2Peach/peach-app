import { useAccountStore } from "../account/account";

export const getOffer = (id: string) =>
  useAccountStore.getState().account.offers.find((c) => c.id === id);
