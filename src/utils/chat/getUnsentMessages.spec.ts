import * as chatData from "../../../tests/unit/data/chatData";
import { defaultAccount, setAccount } from "../account/account";
import { getUnsentMessages } from "./getUnsentMessages";
import { saveChat } from "./saveChat";

describe("getUnsentMessages", () => {
  beforeEach(() => {
    setAccount({
      ...defaultAccount,
      publicKey:
        "0366497c46fef0ba126a42993ed0390c17b99eb1cc1285cef10e2496478ad709b4",
    });
  });

  it("gets unsent messages from a chat", () => {
    saveChat(
      chatData.chatWithUnsentMessages.id,
      chatData.chatWithUnsentMessages,
    );
    const unsentMessages = getUnsentMessages(
      chatData.chatWithUnsentMessages.messages,
    );
    expect(unsentMessages.map((m) => m.message)).toStrictEqual(["Test", "D"]);
    expect(unsentMessages.map((m) => m.readBy.length)).toStrictEqual([0, 0]);
  });
});
