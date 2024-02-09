import { useAccountStore } from "../account/account";
import { getChat } from "./getChat";

export const deleteMessage = (id: string, message: Message) => {
  const savedChat = getChat(id);

  if (!savedChat) return false;

  useAccountStore.getState().setChat(id, {
    ...savedChat,
    messages: savedChat.messages.filter(
      ({ date, message: msg }) =>
        date !== message.date && msg !== message.message,
    ),
  });

  return true;
};
