import * as chatData from "../../../tests/unit/data/chatData";
import {
  defaultAccount,
  setAccount,
  useAccountStore,
} from "../account/account";
import { saveChat } from "./saveChat";

describe("saveChat", () => {
  beforeEach(() => {
    setAccount(defaultAccount);
  });

  it("saves a new chat", () => {
    const savedChat = saveChat(chatData.chat1.id, chatData.chat1);
    expect(savedChat).toStrictEqual(chatData.chat1);
    const account = useAccountStore.getState().account;
    expect(account.chats[chatData.chat1.id]).toStrictEqual(chatData.chat1);
  });
  it("does not duplicate messages when overwriting existing chat", () => {
    saveChat(chatData.chat1.id, chatData.chat1);
    saveChat(chatData.chat1.id, chatData.chat1);
    const account = useAccountStore.getState().account;
    expect(account.chats[chatData.chat1.id].messages).toHaveLength(
      chatData.chat1.messages.length,
    );
  });
  it("removes duplicate messages", () => {
    const savedChat = saveChat(
      chatData.chatWithDuplicate.id,
      chatData.chatWithDuplicate,
    );
    expect(savedChat.messages).toHaveLength(2);
  });
  it("sorts message by date", () => {
    const savedChat = saveChat(chatData.chatUnsorted.id, chatData.chatUnsorted);
    expect(savedChat.messages[0].date).toStrictEqual(
      new Date("2022-09-14T16:15:17.000Z"),
    );
    expect(savedChat.messages[1].date).toStrictEqual(
      new Date("2022-09-15T07:22:42.531Z"),
    );
    expect(savedChat.messages[2].date).toStrictEqual(
      new Date("2022-09-15T07:53:14.346Z"),
    );
  });
});
