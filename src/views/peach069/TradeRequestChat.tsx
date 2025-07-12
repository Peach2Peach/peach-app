import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Offer69TradeRequestChatMessage } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { useBuyOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useBuyOfferTradeRequestBySelfUser";
import { useBuyOfferTradeRequestReceivedByIds } from "../../hooks/query/peach069/useBuyOfferTradeRequestReceivedByIds";
import { useChatMessagesOfTradeRequestPerformedToBuyOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestPerformedToBuyOffer";
import { useChatMessagesOfTradeRequestReceivedToBuyOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestReceivedToBuyOffer";
import { useSellOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useSellOfferTradeRequestBySelfUser";
import { useSellOfferTradeRequestReceivedByIds } from "../../hooks/query/peach069/useSellOfferTradeRequestReceivedByIds";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decrypt } from "../../utils/pgp/decrypt";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { TradeRequestChatBox } from "../contractChat/components/TradeRequestChatBox";
import { LoadingScreen } from "../loading/LoadingScreen";

export const TradeRequestChat = () => {
  const { offerType, offerId, requestingUserId } =
    useRoute<"tradeRequestChat">().params;

  const { user: selfUser } = useSelfUser();

  const whoAmI =
    selfUser && selfUser.id === requestingUserId
      ? "tradeRequester"
      : "offerOwner";

  const { data: buyOfferTradeRequestPerformedBySelfUser } =
    useBuyOfferTradeRequestBySelfUser({
      buyOfferId: offerId,
      isEnabled:
        selfUser && selfUser.id === requestingUserId && offerType === "buy",
    });

  const { data: sellOfferTradeRequestPerformedBySelfUser } =
    useSellOfferTradeRequestBySelfUser({
      sellOfferId: offerId,
      isEnabled:
        selfUser && selfUser.id === requestingUserId && offerType === "sell",
    });

  const { data: buyOfferTradeRequestReceived } =
    useBuyOfferTradeRequestReceivedByIds({
      buyOfferId: offerId,
      userId: requestingUserId,
      isEnabled:
        selfUser && selfUser.id !== requestingUserId && offerType === "buy",
    });

  const { data: sellOfferTradeRequestReceived } =
    useSellOfferTradeRequestReceivedByIds({
      sellOfferId: offerId,
      userId: requestingUserId,
      isEnabled:
        selfUser && selfUser.id !== requestingUserId && offerType === "sell",
    });

  const validData =
    sellOfferTradeRequestReceived ??
    buyOfferTradeRequestReceived ??
    sellOfferTradeRequestPerformedBySelfUser ??
    buyOfferTradeRequestPerformedBySelfUser;

  const [symmetricKey, setSymmetricKey] = useState("");

  useEffect(() => {
    const asyncFunc = async () => {
      if (validData) {
        const symmetricKey = await decrypt(validData.symmetricKeyEncrypted);
        setSymmetricKey(symmetricKey);
      }
    };

    asyncFunc();
  }, [validData]);

  // TODO: implement Sell Offer side

  const {
    data: buyOfferTradeRequestReceivedMessages,
    refetch: buyOfferTradeRequestReceivedMessagesRefetch,
  } = useChatMessagesOfTradeRequestReceivedToBuyOffer({
    buyOfferId: offerId,
    userId: requestingUserId,
    isEnabled:
      selfUser && selfUser.id !== requestingUserId && offerType === "buy",
  });
  const {
    data: buyOfferTradeRequestPerformedMessages,
    refetch: buyOfferTradeRequestPerformedMessagesRefetch,
  } = useChatMessagesOfTradeRequestPerformedToBuyOffer({
    buyOfferId: offerId,
    isEnabled:
      selfUser && selfUser.id === requestingUserId && offerType === "buy",
  });

  const [messages, refetchFunction] = buyOfferTradeRequestReceived
    ? [
        buyOfferTradeRequestReceivedMessages,
        buyOfferTradeRequestReceivedMessagesRefetch,
      ]
    : buyOfferTradeRequestPerformedBySelfUser
      ? [
          buyOfferTradeRequestPerformedMessages,
          buyOfferTradeRequestPerformedMessagesRefetch,
        ]
      : [undefined, undefined];

  const sendMessageAsBuyOfferOwner = async ({
    messageEncrypted,
  }: {
    messageEncrypted: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfReceivedBuyOfferTradeRequest(
      { buyOfferId: offerId, userId: requestingUserId, messageEncrypted },
    );
  };

  const sendMessageAsBuyOfferTradeRequester = async ({
    messageEncrypted,
  }: {
    messageEncrypted: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfPerformedBuyOfferTradeRequest(
      { buyOfferId: offerId, messageEncrypted },
    );
  };

  const sendMessageFunction = buyOfferTradeRequestReceived
    ? sendMessageAsBuyOfferOwner
    : buyOfferTradeRequestPerformedBySelfUser
      ? sendMessageAsBuyOfferTradeRequester
      : undefined;

  return !symmetricKey || !messages || !sendMessageFunction ? (
    <LoadingScreen />
  ) : (
    <ChatScreen
      messages={messages}
      symmetricKey={symmetricKey}
      whoAmI={whoAmI}
      sendMessageFunction={sendMessageFunction}
      refetchFunction={refetchFunction}
    />
  );
};

function ChatScreen({
  messages,
  symmetricKey,
  whoAmI,
  sendMessageFunction,
  refetchFunction,
}: {
  messages: Offer69TradeRequestChatMessage[];
  symmetricKey: string;
  whoAmI: "offerOwner" | "tradeRequester";
  sendMessageFunction: (args: { messageEncrypted: string }) => Promise<void>;
  refetchFunction: Function;
}) {
  const queryClient = useQueryClient();

  const { connected, send, off, on } = useWebsocketContext();

  const publicKey = useAccountStore((state) => state.account.publicKey);

  const [newMessage, setNewMessage] = useState("");
  const [disableSend, setDisableSend] = useState(false);

  //   const sendMessage = useCallback(
  //     async (message: string) => {
  //       if (!tradingPartner || !decryptedData?.symmetricKey || !message) return;

  //       const encryptedResult = await signAndEncryptSymmetric(
  //         message,
  //         decryptedData.symmetricKey,
  //       );
  //       const messageObject: Message = {
  //         roomId: `contract-${contractId}`,
  //         from: publicKey,
  //         date: new Date(),
  //         readBy: [],
  //         message,
  //         signature: encryptedResult.signature,
  //       };
  //       if (connected) {
  //         send(
  //           JSON.stringify({
  //             path: "/v1/contract/chat",
  //             contractId,
  //             message: encryptedResult.encrypted,
  //             signature: encryptedResult.signature,
  //           }),
  //         );
  //       }

  //       setAndSaveChat(
  //         contractId,
  //         {
  //           messages: [messageObject],
  //           lastSeen: new Date(),
  //         },
  //         false,
  //       );
  //     },
  //     [
  //       tradingPartner,
  //       decryptedData?.symmetricKey,
  //       contractId,
  //       publicKey,
  //       connected,
  //       setAndSaveChat,
  //       send,
  //     ],
  //   );
  //   const resendMessage = (message: Message) => {
  //     if (!connected) return;
  //     deleteMessage(contractId, message);
  //     sendMessage(message.message);
  //   };

  const submit = async () => {
    if (!newMessage) return;

    setDisableSend(true);
    const enableDelay = 300;

    setTimeout(() => setDisableSend(false), enableDelay);

    const encryptionResult = await signAndEncryptSymmetric(
      newMessage,
      symmetricKey,
    );

    await sendMessageFunction({
      messageEncrypted: encryptionResult.encrypted,
    });

    await refetchFunction();

    setNewMessage("");
  };

  return (
    <Screen style={tw`p-0`} header={<TradeRequestChatHeader />}>
      <View style={[tw`flex-1`]}>
        <TradeRequestChatBox
          messages={messages}
          whoAmI={whoAmI}
          symmetricKey={symmetricKey}
        />
      </View>

      <View style={tw`w-full`}>
        <MessageInput
          onChangeText={setNewMessage}
          onSubmit={submit}
          disabled={!symmetricKey}
          disableSubmit={disableSend}
          value={newMessage}
        />
      </View>
    </Screen>
  );
}

function TradeRequestChatHeader() {
  const { offerId } = useRoute<"tradeRequestChat">().params;

  return <Header title={"Trade Request Chat - " + offerIdToHex(offerId)} />;
}
