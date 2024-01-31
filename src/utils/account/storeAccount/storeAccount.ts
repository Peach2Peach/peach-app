import { info } from "../../log/info";
import { storeChats } from "./storeChats";
import { storeIdentity } from "./storeIdentity";
import { storeOffers } from "./storeOffers";
import { storeTradingLimit } from "./storeTradingLimit";

export const storeAccount = async (acc: Account): Promise<void> => {
  info("storeAccount - Storing account");

  if (!acc.publicKey) throw new Error("ERROR_SAVE_ACCOUNT");

  await Promise.all([
    storeIdentity(acc),
    storeTradingLimit(acc.tradingLimit),
    storeOffers(acc.offers),
    storeChats(acc.chats),
  ]);
};
