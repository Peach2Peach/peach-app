import { info } from "../../log/info";
import { storeChats } from "./storeChats";
import { storeIdentity } from "./storeIdentity";
import { storeTradingLimit } from "./storeTradingLimit";

export const storeAccount = async (acc: Account) => {
  info("storeAccount - Storing account");

  if (!acc.publicKey) throw new Error("ERROR_SAVE_ACCOUNT");

  await Promise.all([
    storeIdentity(acc),
    storeTradingLimit(acc.tradingLimit),
    storeChats(acc.chats),
  ]);
};
