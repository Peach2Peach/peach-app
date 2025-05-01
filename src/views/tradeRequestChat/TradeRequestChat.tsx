import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { MSINASECOND } from "../../constants";
import { PAGE_SIZE } from "../../hooks/query/useChatMessages";
import { useTradeRequestChatMessages } from "../../hooks/query/useTradeRequestChatMessages";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { deleteMessage } from "../../utils/chat/deleteMessage";
import { getChat } from "../../utils/chat/getChat";
import { getUnsentMessages } from "../../utils/chat/getUnsentMessages";
import { saveChat } from "../../utils/chat/saveChat";
import { error } from "../../utils/log/error";
import { getOffer } from "../../utils/offer/getOffer";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ChatBox } from "./components/ChatBox";

export const TradeRequestChat = () => {
  const { offerId, requestingUserId } = useRoute<"tradeRequestChat">().params;
  const { offer } = getOffer(offerId);

  return !offer ? (
    <LoadingScreen />
  ) : (
    <TradeRequestScreen offer={offer} requestingUserId={requestingUserId} />
  );
};

function TradeRequestScreen({
  offer,
  requestingUserId,
}: {
  offer: BuyOffer | SellOffer;
  requestingUserId: string;
}) {
  const queryClient = useQueryClient();
  const { data: decryptedData, isPending } = useDecryptedContractData(contract);
  // const { contractId } = useRoute<"tradeRequestChat">().params;

  const { connected, send, off, on } = useWebsocketContext();
  const { messages, isFetching, page, fetchNextPage } =
    useTradeRequestChatMessages({
      offerId: offer.id,
      requestingUserId,
      symmetricKey: decryptedData?.symmetricKey,
      isLoadingSymmetricKey: isPending,
    });
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const tradingPartner = contract
    ? publicKey === contract.seller.id
      ? contract.buyer
      : contract.seller
    : null;

  const chatId = offer.id + requestingUserId;

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
          offer.type === "bid"
            ? `trade-requests-sell-offer-${offer.id}-${requestingUserId}`
            : `trade-requests-buy-offer-${offer.id}-${requestingUserId}`,
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
      tradingPartner,
      decryptedData?.symmetricKey,
      contractId,
      publicKey,
      connected,
      setAndSaveChat,
      send,
    ],
  );
  const resendMessage = async (message: Message) => {
    if (!connected) return;
    deleteMessage(contractId, message);
    await sendMessage(message.message);
  };

  const submit = async () => {
    if (
      !contract ||
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
    setAndSaveChat(contractId, {
      draftMessage: "",
    });
  };

  useEffect(
    () => () => {
      setAndSaveChat(contractId, {
        draftMessage: newMessage,
      });
    },
    [contractId, newMessage, setAndSaveChat],
  );

  useEffect(() => {
    const timeoutSeconds = 5;
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages);
      if (unsentMessages.length === 0) return;

      setAndSaveChat(offerId, {
        messages: unsentMessages.map((message) => ({
          ...message,
          failedToSend: true,
        })),
      });
    }, timeoutSeconds * MSINASECOND);

    return () => clearTimeout(timeout);
  }, [offerId, chat.messages, setAndSaveChat]);

  useEffect(() => {
    const chatMessageHandler = async (message?: Message) => {
      if (!message) return;
      if (!offer) return;
      if (!message.message) return;
      if (
        !(
          message.roomId ===
            `trade-requests-buy-offer-${offer.id}-${requestingUserId}` ||
          message.roomId ===
            `trade-requests-sell-offer-${offer.id}-${requestingUserId}`
        )
      )
        return;

      let messageBody = "";
      try {
        messageBody = await decryptSymmetric(
          message.message,
          decryptedData.symmetricKey,
        );
      } catch {
        error(
          new Error(`Could not decrypt message for contract ${contract.id}`),
        );
      }
      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: messageBody,
      };
      setAndSaveChat(contractId, {
        messages: [decryptedMessage],
      });
      queryClient.setQueryData(
        offerKeys.chat(offerId, requestingUserId),
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
            requestingUserId: requestingUserId,
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
    offer,
    offerId,
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
    if (messages) setAndSaveChat(offerId, requestingUserId, { messages });
  }, [offerId, messages, setAndSaveChat]);

  return (
    <Screen
      style={tw`p-0`}
      header={
        <TradeRequestChatHeader
          offer={offer}
          requestingUserId={requestingUserId}
          symmetricKey={decryptedData?.symmetricKey}
        />
      }
    >
      <View
        style={[tw`flex-1`, !decryptedData?.symmetricKey && tw`opacity-50`]}
      >
        <ChatBox
          tradingPartner={tradingPartner?.id || ""}
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
  requestingUserId: string;
  symmetricKey?: string;
};

function TradeRequestChatHeader({
  offer,
  requestingUserId,
  // symmetricKey,
}: Props) {
  // const { contractId } = useRoute<"tradeRequestChat">().params;

  // const setPopup = useSetPopup();

  const title = "Offer " + offer.id + "-" + requestingUserId + " Chat";

  return <Header title={title} icons={[]} />;
}
