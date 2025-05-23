import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { MSINASECOND } from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/offerKeys";
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
import { error } from "../../utils/log/error";
import { getOffer, getTradeRequest } from "../../utils/offer/getOffer";
import { peachAPI } from "../../utils/peachAPI";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ChatBox } from "./components/ChatBox";
import { useDecryptedTradeRequestData } from "./useDecryptedTradeRequestData";

export const TradeRequestChat = () => {
  const { offerId, requestingUserId } = useRoute<"tradeRequestChat">().params;

  const offer = getOffer(offerId);
  const tradeRequest = getTradeRequest(offerId, requestingUserId);

  return !offer || !tradeRequest ? (
    <LoadingScreen />
  ) : (
    <TradeRequestChatScreen offer={offer} tradeRequest={tradeRequest} />
  );
};

function TradeRequestChatScreen({
  offer,
  tradeRequest,
}: {
  offer: BuyOffer | SellOffer;
  tradeRequest: TradeRequest;
}) {
  // const requestingUserId = tradeRequest.userId
  //   ? tradeRequest.userId
  //   : tradeRequest.requestingUserId; // FIX THIS

  const requestingUserId = tradeRequest.requestingUserId;

  const queryClient = useQueryClient();

  const { user } = useSelfUser();

  const { data: decryptedData, isPending } =
    useDecryptedTradeRequestData(tradeRequest);

  const { connected, send, off, on } = useWebsocketContext();

  const { messages, isFetching, page, fetchNextPage } =
    useTradeRequestChatMessages({
      offerId: offer.id,
      requestingUserId,
      symmetricKey: decryptedData?.symmetricKey,
      isLoadingSymmetricKey: isPending,
    });

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const tradingPartner =
    user?.id === requestingUserId ? offer.user.id : requestingUserId;

  const chatId = offer.id + "-" + requestingUserId;

  const [chat, setChat] = useState(getChat(chatId));
  const [newMessage, setNewMessage] = useState(chat.draftMessage);
  const [disableSend, setDisableSend] = useState(false);

  const setAndSaveChat = useCallback(
    (id: string, c: Partial<Chat>, save = true) =>
      setChat(saveChat(id, c, save)),
    [],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!tradingPartner || !decryptedData?.symmetricKey || !message) return;

      const encryptedResult = await signAndEncryptSymmetric(
        message,
        decryptedData.symmetricKey,
      );

      const messageObject: Message = {
        roomId:
          offer.type === "ask"
            ? `trade-requests-sell-offer-${chatId}`
            : `trade-requests-buy-offer-${chatId}`,
        from: publicKey,
        date: new Date(),
        readBy: [],
        message,
        signature: encryptedResult.signature,
      };
      if (connected) {
        send(
          JSON.stringify({
            path: "/v1/offer/tradeRequest/chat",
            offerId: offer.id,
            requestingUserId,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        );
      } else {
        await peachAPI.private.offer.postTradeRequestChat({
          offerId: offer.id,
          requestingUserId,
          message: encryptedResult.encrypted,
          signature: encryptedResult.signature,
        });
      }

      setAndSaveChat(
        chatId,
        {
          messages: [messageObject],
          lastSeen: new Date(),
        },
        false,
      );
    },
    [
      chatId,
      tradingPartner,
      decryptedData?.symmetricKey,
      offer,
      requestingUserId,
      publicKey,
      connected,
      setAndSaveChat,
      send,
    ],
  );
  const resendMessage = async (message: Message) => {
    if (!connected) return;
    deleteMessage(chatId, message);
    await sendMessage(message.message);
  };

  const submit = async () => {
    if (
      !offer ||
      !tradingPartner ||
      !decryptedData?.symmetricKey ||
      !newMessage
    )
      return;
    setDisableSend(true);
    const enableDelay = 300;
    setTimeout(() => setDisableSend(false), enableDelay);

    await sendMessage(newMessage);
    setNewMessage("");
    setAndSaveChat(chatId, {
      draftMessage: "",
    });
  };

  useEffect(
    () => () => {
      setAndSaveChat(chatId, {
        draftMessage: newMessage,
      });
    },
    [chatId, offer, requestingUserId, newMessage, setAndSaveChat],
  );

  useEffect(() => {
    const timeoutSeconds = 5;
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages);
      if (unsentMessages.length === 0) return;

      setAndSaveChat(chatId, {
        messages: unsentMessages.map((message) => ({
          ...message,
          failedToSend: true,
        })),
      });
    }, timeoutSeconds * MSINASECOND);

    return () => clearTimeout(timeout);
  }, [chatId, chat.messages, setAndSaveChat]);

  useEffect(() => {
    const chatMessageHandler = async (message?: Message) => {
      if (!message) return;
      if (!offer) return;
      if (!message.message) return;
      if (
        !(
          message.roomId === `trade-requests-buy-offer-${chatId}` ||
          message.roomId === `trade-requests-sell-offer-${chatId}`
        )
      )
        return;

      let messageBody = "";

      if (!decryptedData || !decryptedData.symmetricKey) {
        throw Error;
      }
      try {
        messageBody = await decryptSymmetric(
          message.message,
          decryptedData.symmetricKey,
        );
      } catch {
        error(
          new Error(`Could not decrypt message for Trade Request ${chatId}`),
        );
      }
      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: messageBody,
      };
      setAndSaveChat(chatId, {
        messages: [decryptedMessage],
      });
      queryClient.setQueryData(
        tradeRequestKeys.chat(offer.id, requestingUserId),
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
            path: "/v1/offer/tradeRequest/chat/received",
            offerId: offer.id,
            requestingUserId,
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
    chatId,
    decryptedData,
    offer,
    requestingUserId,
    connected,
    on,
    send,
    off,
    decryptedData?.symmetricKey,
    publicKey,
    queryClient,
    setAndSaveChat,
  ]);

  useEffect(() => {
    if (messages) setAndSaveChat(chatId, { messages });
  }, [chatId, offer, messages, setAndSaveChat]);

  return (
    <Screen
      style={tw`p-0`}
      header={
        <TradeRequestChatHeader
          offer={offer}
          symmetricKey={decryptedData?.symmetricKey}
        />
      }
    >
      <View
        style={[tw`flex-1`, !decryptedData?.symmetricKey && tw`opacity-50`]}
      >
        <ChatBox
          tradingPartner={tradingPartner || ""}
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
            disabled={!decryptedData?.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
          />
        </View>
      }
    </Screen>
  );
}

type Props = {
  offer: BuyOffer | SellOffer;
  symmetricKey?: string;
};

function TradeRequestChatHeader({
  offer,
  // symmetricKey,
}: Props) {
  // const { contractId } = useRoute<"tradeRequestChat">().params;

  // const setPopup = useSetPopup();

  const title = "Trade Request " + offer.id + " Chat";

  return <Header title={title} icons={[]} />;
}
