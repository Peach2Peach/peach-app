import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { MSINASECOND } from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { PAGE_SIZE } from "../../hooks/query/useChatMessages";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useTradeRequestChatMessages } from "../../hooks/query/useTradeRequestChatMessages";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { deleteMessage } from "../../utils/chat/deleteMessage";
import { getChat } from "../../utils/chat/getChat";
import { getUnsentMessages } from "../../utils/chat/getUnsentMessages";
import { saveChat } from "../../utils/chat/saveChat";
import { peachAPI } from "../../utils/peachAPI";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { usePublicOffer } from "../explore/usePublicOffer";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ChatBox } from "./components/ChatBox";
import { useSymmetricKey } from "./useSymmetricKey";

export const TradeRequestChat = () => {
  const { chatRoomId } = useRoute<"tradeRequestChat">().params;
  const [offerId] = chatRoomId.split("-");

  const { data: offer } = usePublicOffer(offerId);

  return !offer ? (
    <LoadingScreen />
  ) : (
    <TradeRequestChatScreen
      offerType={offer.type === "ask" ? "sellOffer" : "buyOffer"}
      offerUserId={offer.user.id}
    />
  );
};

type Props = {
  offerType: "buyOffer" | "sellOffer";
  offerUserId: string;
};

function TradeRequestChatScreen({ offerType, offerUserId }: Props) {
  const { chatRoomId } = useRoute<"tradeRequestChat">().params;
  const [offerId, requestingId] = chatRoomId.split("-");

  const queryClient = useQueryClient();

  const { user } = useSelfUser();

  const { data: symmetricKey } = useSymmetricKey(offerType, chatRoomId);

  const { connected, send, off, on } = useWebsocketContext();

  const { messages, isFetching, page, fetchNextPage } =
    useTradeRequestChatMessages({
      chatRoomId,
      symmetricKey,
      offerType,
    });

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const tradingPartner = user?.id === requestingId ? offerUserId : requestingId;

  const [chat, setChat] = useState(getChat(chatRoomId));
  const [newMessage, setNewMessage] = useState(chat.draftMessage);
  const [disableSend, setDisableSend] = useState(false);

  const setAndSaveChat = useCallback(
    (id: string, c: Partial<Chat>, save = true) =>
      setChat(saveChat(id, c, save)),
    [],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!tradingPartner || !symmetricKey || !message) return;

      const encryptedResult = await signAndEncryptSymmetric(
        message,
        symmetricKey,
      );

      const messageObject: Message = {
        roomId: chatRoomId,
        from: publicKey,
        date: new Date(),
        readBy: [],
        message,
        signature: encryptedResult.signature,
      };
      if (connected) {
        send(
          JSON.stringify({
            path: `/v1/chat/tradeRequest`,
            chatRoomId,
            offerType,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        );
      } else {
        await peachAPI.private.offer.postTradeRequestChat({
          chatRoomId,
          offerType,
          message: encryptedResult.encrypted,
          signature: encryptedResult.signature,
        });
      }

      setAndSaveChat(
        chatRoomId,
        {
          messages: [messageObject],
          lastSeen: new Date(),
        },
        false,
      );
    },
    [
      chatRoomId,
      connected,
      offerType,
      publicKey,
      send,
      setAndSaveChat,
      symmetricKey,
      tradingPartner,
    ],
  );
  const resendMessage = async (message: Message) => {
    if (!connected) return;
    deleteMessage(chatRoomId, message);
    await sendMessage(message.message);
  };

  const submit = async () => {
    if (!tradingPartner || !symmetricKey || !newMessage) return;
    setDisableSend(true);
    const enableDelay = 300;
    setTimeout(() => setDisableSend(false), enableDelay);

    await sendMessage(newMessage);
    setNewMessage("");
    setAndSaveChat(chatRoomId, {
      draftMessage: "",
    });
  };

  useEffect(
    () => () => {
      setAndSaveChat(chatRoomId, {
        draftMessage: newMessage,
      });
    },
    [chatRoomId, newMessage, setAndSaveChat],
  );

  useEffect(() => {
    const timeoutSeconds = 5;
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages);
      if (unsentMessages.length === 0) return;

      setAndSaveChat(chatRoomId, {
        messages: unsentMessages.map((message) => ({
          ...message,
          failedToSend: true,
        })),
      });
    }, timeoutSeconds * MSINASECOND);

    return () => clearTimeout(timeout);
  }, [chat.messages, chatRoomId, setAndSaveChat]);

  useEffect(() => {
    const chatMessageHandler = async (message?: Message) => {
      if (!message) return;
      if (!message.message) return;
      if (!(message.roomId === chatRoomId)) return;

      let messageBody = "";

      if (!symmetricKey || !symmetricKey) {
        throw Error;
      }
      try {
        messageBody = await decryptSymmetric(message.message, symmetricKey);
      } catch {
        throw new Error(
          `Could not decrypt message for Trade Request ${chatRoomId}`,
        );
      }
      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: messageBody,
      };
      setAndSaveChat(chatRoomId, {
        messages: [decryptedMessage],
      });
      queryClient.setQueryData(
        tradeRequestKeys.chat(offerId, requestingId),
        (oldQueryData: InfiniteData<Message[]> | undefined) => {
          if (!oldQueryData) {
            return { pageParams: [], pages: [[decryptedMessage]] };
          }
          if (oldQueryData.pages.length > PAGE_SIZE)
            oldQueryData.pages[0].shift();
          oldQueryData.pages[0] = [decryptedMessage, ...oldQueryData.pages[0]];
          return oldQueryData;
        },
      );

      if (!message.readBy.includes(publicKey)) {
        send(
          JSON.stringify({
            path: "/v1/chat/tradeRequest/received",
            offerId,
            requestingUserId: requestingId,
            start: message.date,
            end: message.date,
          }),
        );
      }
    };
    const unsubscribe = () => {
      off("message", chatMessageHandler);
    };

    if (!connected) return unsubscribe;
    on("message", chatMessageHandler);
    return unsubscribe;
  }, [
    chatRoomId,
    connected,
    off,
    offerId,
    on,
    publicKey,
    queryClient,
    requestingId,
    send,
    setAndSaveChat,
    symmetricKey,
  ]);

  useEffect(() => {
    if (messages) setAndSaveChat(chatRoomId, { messages });
  }, [chatRoomId, messages, setAndSaveChat]);

  return (
    <Screen style={tw`p-0`} header={`Trade Request ${offerId} Chat`}>
      <View style={[tw`flex-1`, !symmetricKey && tw`opacity-50`]}>
        <ChatBox
          tradingPartner={tradingPartner}
          online={connected}
          chat={chat}
          setAndSaveChat={setAndSaveChat}
          page={page}
          fetchNextPage={fetchNextPage}
          isLoading={isFetching}
          resendMessage={resendMessage}
        />
      </View>
      {
        <View style={tw`w-full`}>
          <MessageInput
            onChangeText={setNewMessage}
            onSubmit={submit}
            disabled={!symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
          />
        </View>
      }
    </Screen>
  );
}
