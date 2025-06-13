import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { MSINASECOND } from "../../constants";
import { PAGE_SIZE } from "../../hooks/query/useChatMessages";

import { matchChatKeys } from "../../hooks/query/offerKeys";
import { useMatchChatMessages } from "../../hooks/query/useMatchChatMessages";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { deleteMessage } from "../../utils/chat/deleteMessage";
import { getChat } from "../../utils/chat/getChat";
import { getUnsentMessages } from "../../utils/chat/getUnsentMessages";
import { saveChat } from "../../utils/chat/saveChat";
import { error } from "../../utils/log/error";
import { peachAPI } from "../../utils/peachAPI";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { useOffer } from "../explore/useOffer";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ChatBox } from "./components/ChatBox";
import { useDecryptedMatchData } from "./useDecryptedMatchData";

export const MatchChat = () => {
  const { offerId, matchingOfferId } = useRoute<"matchChat">().params;

  const { data: offer } = useOffer(offerId);

  const [symmetricKeyEncrypted, setSymmetricKeyEncrypted] = useState("");

  const [matchingOffer, setMatchingOffer] = useState<GetOfferResponseBody>();

  useEffect(() => {
    const callback = async () => {
      const { result } = await peachAPI.private.offer.isAllowedToMatchChat({
        offerId,
        matchingOfferId,
      });
      if (result) {
        setSymmetricKeyEncrypted(result.symmetricKeyEncrypted);

        const { result: matchingOfferResult } =
          await peachAPI.public.offer.getOffer({
            offerId: matchingOfferId,
          });
        if (!matchingOfferResult) throw Error("Invalid Matching Offer");
        setMatchingOffer(matchingOfferResult);
      }
    };
    void callback();
  }, [offerId, matchingOfferId]);

  return !offer ||
    !matchingOfferId ||
    !symmetricKeyEncrypted ||
    !matchingOffer ? (
    <LoadingScreen />
  ) : (
    <MatchChatScreen
      offer={offer}
      matchingOffer={matchingOffer}
      symmetricKeyEncrypted={symmetricKeyEncrypted}
    />
  );
};

function MatchChatScreen({
  offer,
  matchingOffer,
  symmetricKeyEncrypted,
}: {
  offer: GetOfferResponseBody;
  matchingOffer: GetOfferResponseBody;
  symmetricKeyEncrypted: string;
}) {
  const queryClient = useQueryClient();

  const { user } = useSelfUser();

  const { data: decryptedData, isPending } = useDecryptedMatchData(
    offer.id,
    matchingOffer.id,
    symmetricKeyEncrypted,
  );

  const { connected, send, off, on } = useWebsocketContext();
  const { messages, isFetching, page, fetchNextPage } = useMatchChatMessages({
    offerId: offer.id,
    matchingOfferId: matchingOffer.id,
    symmetricKey: decryptedData?.symmetricKey,
    isLoadingSymmetricKey: isPending,
  });

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const tradingPartner =
    user?.id === offer.user.id ? matchingOffer.user.id : offer.user.id;

  const sellOfferId = offer.type === "ask" ? offer.id : matchingOffer.id;
  const buyOfferId = offer.type === "bid" ? offer.id : matchingOffer.id;

  const chatId = `${sellOfferId}-offer-${buyOfferId}`;

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
        roomId: `trade-requests-sell-offer-${chatId}`,
        from: publicKey,
        date: new Date(),
        readBy: [],
        message,
        signature: encryptedResult.signature,
      };
      if (connected) {
        send(
          JSON.stringify({
            path: "/v1/offer/match/chat",
            offerId: offer.id,
            matchingOfferId: matchingOffer.id,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        );
      } else {
        await peachAPI.private.offer.postMatchChat({
          offerId: offer.id,
          matchingOfferId: matchingOffer.id,
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
      matchingOffer,
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
    [chatId, offer, matchingOffer, newMessage, setAndSaveChat],
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
      if (!(message.roomId === `trade-requests-sell-offer-${chatId}`)) return;

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
        error(new Error(`Could not decrypt message for Match ${chatId}`));
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
        matchChatKeys.chat(offer.id, matchingOffer.id),
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
            path: "/v1/offer/match/chat/received",
            offerId: offer.id,
            matchingOfferId: matchingOffer.id,
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
    matchingOffer,
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
    <Screen style={tw`p-0`} header={`Trade Request ${offer.id} Chat`}>
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
