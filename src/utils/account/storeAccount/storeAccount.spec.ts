import * as accountData from "../../../../tests/unit/data/accountData";
import { getIndexedMap } from "../../storage/getIndexedMap";
import { defaultAccount, setAccount } from "../account";
import { accountStorage } from "../accountStorage";
import { chatStorage } from "../chatStorage";
import { storeAccount } from "../storeAccount";

describe("storeAccount", () => {
  beforeEach(() => {
    setAccount(defaultAccount);
  });

  it("should store whole account", async () => {
    await storeAccount(accountData.buyer);
    const identity = accountStorage.getMap("identity") as Identity;
    const [tradingLimit, chats] = await Promise.all([
      accountStorage.getMap("tradingLimit") || defaultAccount.tradingLimit,
      getIndexedMap(chatStorage),
    ]);
    expect({ ...identity, tradingLimit, chats }).toStrictEqual(
      accountData.buyer,
    );
  });
});
