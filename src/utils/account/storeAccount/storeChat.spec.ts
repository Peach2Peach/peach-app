import * as accountData from "../../../../tests/unit/data/accountData";
import { defaultAccount, setAccount } from "../account";
import { chatStorage } from "../chatStorage";
import { storeChat } from "./storeChat";

describe("storeChat", () => {
  beforeEach(() => {
    setAccount(defaultAccount);
  });

  it("would store chats", () => {
    storeChat(accountData.buyer.chats["313-312"]);
    expect(chatStorage.setMap).toHaveBeenCalledWith(
      "313-312",
      accountData.buyer.chats["313-312"],
    );
  });
});
