import { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Offer69TradeRequestChatMessage } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { useBuyOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useBuyOfferTradeRequestBySelfUser";
import { useBuyOfferTradeRequestReceivedByIds } from "../../hooks/query/peach069/useBuyOfferTradeRequestReceivedByIds";
import { useChatMessagesOfTradeRequestPerformedToBuyOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestPerformedToBuyOffer";
import { useChatMessagesOfTradeRequestPerformedToSellOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestPerformedToSellOffer";
import { useChatMessagesOfTradeRequestReceivedToBuyOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestReceivedToBuyOffer";
import { useChatMessagesOfTradeRequestReceivedToSellOffer } from "../../hooks/query/peach069/useChatMessagesOfTradeRequestReceivedToSellOffer";
import { useSellOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useSellOfferTradeRequestBySelfUser";
import { useSellOfferTradeRequestReceivedByIds } from "../../hooks/query/peach069/useSellOfferTradeRequestReceivedByIds";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
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

  const {
    data: sellOfferTradeRequestReceivedMessages,
    refetch: sellOfferTradeRequestReceivedMessagesRefetch,
  } = useChatMessagesOfTradeRequestReceivedToSellOffer({
    sellOfferId: offerId,
    userId: requestingUserId,
    isEnabled:
      selfUser && selfUser.id !== requestingUserId && offerType === "sell",
  });
  const {
    data: sellOfferTradeRequestPerformedMessages,
    refetch: sellOfferTradeRequestPerformedMessagesRefetch,
  } = useChatMessagesOfTradeRequestPerformedToSellOffer({
    sellOfferId: offerId,
    isEnabled:
      selfUser && selfUser.id === requestingUserId && offerType === "sell",
  });

  const sendMessageAsBuyOfferOwner = async ({
    messageEncrypted,
    signature,
  }: {
    messageEncrypted: string;
    signature?: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfReceivedBuyOfferTradeRequest(
      {
        buyOfferId: offerId,
        userId: requestingUserId,
        messageEncrypted,
        signature,
      },
    );
  };

  const sendMessageAsBuyOfferTradeRequester = async ({
    messageEncrypted,
    signature,
  }: {
    messageEncrypted: string;
    signature?: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfPerformedBuyOfferTradeRequest(
      { buyOfferId: offerId, messageEncrypted, signature },
    );
  };

  const sendMessageAsSellOfferOwner = async ({
    messageEncrypted,
    signature,
  }: {
    messageEncrypted: string;
    signature?: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfReceivedSellOfferTradeRequest(
      {
        sellOfferId: offerId,
        userId: requestingUserId,
        messageEncrypted,
        signature,
      },
    );
  };

  const sendMessageAsSellOfferTradeRequester = async ({
    messageEncrypted,
    signature,
  }: {
    messageEncrypted: string;
    signature?: string;
  }): Promise<void> => {
    await peachAPI.private.peach069.sendChatMessagesOfPerformedSellOfferTradeRequest(
      { sellOfferId: offerId, messageEncrypted, signature },
    );
  };

  const [tradeRequest, messages, refetchFunction, sendMessageFunction] =
    selfUser && selfUser.id !== requestingUserId && offerType === "buy"
      ? [
          buyOfferTradeRequestReceived,
          buyOfferTradeRequestReceivedMessages,
          buyOfferTradeRequestReceivedMessagesRefetch,
          sendMessageAsBuyOfferOwner,
        ]
      : selfUser && selfUser.id === requestingUserId && offerType === "buy"
        ? [
            buyOfferTradeRequestPerformedBySelfUser,
            buyOfferTradeRequestPerformedMessages,
            buyOfferTradeRequestPerformedMessagesRefetch,
            sendMessageAsBuyOfferTradeRequester,
          ]
        : selfUser && selfUser.id !== requestingUserId && offerType === "sell"
          ? [
              sellOfferTradeRequestReceived,
              sellOfferTradeRequestReceivedMessages,
              sellOfferTradeRequestReceivedMessagesRefetch,
              sendMessageAsSellOfferOwner,
            ]
          : selfUser && selfUser.id === requestingUserId && offerType === "sell"
            ? [
                sellOfferTradeRequestPerformedBySelfUser,
                sellOfferTradeRequestPerformedMessages,
                sellOfferTradeRequestPerformedMessagesRefetch,
                sendMessageAsSellOfferTradeRequester,
              ]
            : [undefined, undefined, undefined, undefined];

  const [symmetricKey, setSymmetricKey] = useState("");

  useEffect(() => {
    const asyncFunc = async () => {
      if (tradeRequest) {
        const symmetricKey = await decrypt(tradeRequest.symmetricKeyEncrypted);
        setSymmetricKey(symmetricKey);
      }
    };

    asyncFunc();
  }, [tradeRequest]);

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
  sendMessageFunction: (args: {
    messageEncrypted: string;
    signature: string;
  }) => Promise<void>;
  refetchFunction: Function;
}) {
  const [newMessage, setNewMessage] = useState("");
  const [disableSend, setDisableSend] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
      signature: encryptionResult.signature,
    });

    await refetchFunction();

    setNewMessage("");
  };

  return (
    <Screen
      style={tw`p-0`}
      header={
        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <TradeRequestChatHeader />
        </View>
      }
    >
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <View style={[tw`flex-1`, !keyboardVisible && { paddingBottom: 0 }]}>
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
      </KeyboardAvoidingView>
    </Screen>
  );
}

function TradeRequestChatHeader() {
  const { offerId } = useRoute<"tradeRequestChat">().params;

  return <Header title={"Trade Request Chat - " + offerIdToHex(offerId)} />;
}
