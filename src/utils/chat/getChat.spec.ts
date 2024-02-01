import { chat1 } from "../../../tests/unit/data/chatData";
import {
  defaultAccount,
  setAccount,
  useAccountStore,
} from "../account/account";
import { getChat } from "./getChat";
import { saveChat } from "./saveChat";

const now = new Date();
jest.useFakeTimers({ now });
describe("getChat", () => {
  beforeEach(() => {
    setAccount(defaultAccount);
  });

  it("gets a chat", () => {
    saveChat(chat1.id, chat1);
    const chat = getChat(chat1.id);
    expect(chat).toEqual(chat1);
    const account = useAccountStore.getState().account;
    expect(account.chats[chat1.id]).toEqual(chat1);
  });
  it("returns an empty chat for non existing chats", () => {
    const chat = getChat("doesntExist");
    expect(chat.id).toBe("doesntExist");
    expect(chat.messages.length).toBe(0);
    expect(chat.lastSeen).toEqual(now);
  });
});
