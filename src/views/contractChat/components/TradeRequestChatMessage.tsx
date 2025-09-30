import { useEffect, useState } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { Offer69TradeRequestChatMessage } from "../../../../peach-api/src/@types/offer";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import { LinedText } from "../../../components/ui/LinedText";
import tw from "../../../styles/tailwind";
import { useAccountStore } from "../../../utils/account/account";
import { toTimeFormat } from "../../../utils/date/toTimeFormat";
import i18n from "../../../utils/i18n";
import { decryptSymmetric } from "../../../utils/pgp/decryptSymmetric";

type GetMessageMetaProps = {
  publicKey: string;
  message: Message;
  previous: Message;
  tradingPartner: string;
  online: boolean;
};
type MessageMeta = {
  online: boolean;
  showName: boolean;
  name: string;
  isYou: boolean;
  isTradingPartner: boolean;
  isMediator: boolean;
  isSystemMessage: boolean;
  readByCounterParty: boolean;
};

const getMessageMeta = ({
  message,
  previous,
  tradingPartner,
  online,
  publicKey,
}: GetMessageMetaProps): MessageMeta => {
  const isYou = message.from === publicKey;
  const isTradingPartner = message.from === tradingPartner;
  const isMediator = !isYou && !isTradingPartner;
  const isSystemMessage = message.from === "system";
  const readByCounterParty = message.readBy?.includes(tradingPartner);
  const showName = !previous || previous.from !== message.from;
  const name = i18n(
    isSystemMessage
      ? "chat.systemMessage"
      : isMediator
        ? "chat.mediator"
        : isYou
          ? "chat.you"
          : "chat.tradePartner",
  );
  return {
    online,
    showName,
    name,
    isYou,
    isTradingPartner,
    isMediator,
    isSystemMessage,
    readByCounterParty,
  };
};

type MessageStyling = {
  text: ViewStyle;
  bgColor: ViewStyle;
  statusIcon: IconType;
  statusIconColor: TextStyle;
};
const getMessageStyling = (
  message: Offer69TradeRequestChatMessage,
  whoAmI: "offerOwner" | "tradeRequester",
): MessageStyling => {
  const text = tw`text-black-65`; // no mediator here
  const bgColor =
    whoAmI === message.sender ? tw`bg-info-background` : tw`bg-black-5`;
  const statusIcon = message.seen ? "chatDoubleCheck" : "check";
  const statusIconColor =
    statusIcon === "chatDoubleCheck" ? tw`text-info-main` : tw`text-black-50`;
  return {
    text,
    bgColor,
    statusIcon,
    statusIconColor,
  };
};
type ChatMessageProps = {
  chatMessage: Offer69TradeRequestChatMessage;
  whoAmI: "offerOwner" | "tradeRequester";
  symmetricKey: string;
};

export const TradeRequestChatMessage = ({
  chatMessage,
  whoAmI,
  symmetricKey,
}: ChatMessageProps) => {
  const publicKey = useAccountStore((state) => state.account.publicKey);

  const { statusIcon, statusIconColor, text, bgColor } = getMessageStyling(
    chatMessage,
    whoAmI,
  );

  const messageDate = new Date(chatMessage.creationDate);

  // const isChangeDate =
  //   index === 0 ||
  //   toDateFormat(messageDate) !== toDateFormat(chatMessages[index - 1].date);
  const isChangeDate = false; // TODO: implement this

  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [failedDecrypting, setFailedDecrypting] = useState(false);

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const result = await decryptSymmetric(
          chatMessage.encryptedMessage,
          symmetricKey,
        );

        setDecryptedMessage(result);
      } catch (e) {
        setFailedDecrypting(true);
      }
    };

    asyncFunc();
  }, []);

  return (
    <>
      {isChangeDate && (
        <LinedText style={tw`mb-5 px-sm pt-7`}>
          <PeachText style={tw`text-black-50`}>
            {toDateFormat(messageDate)}
          </PeachText>
        </LinedText>
      )}
      <View
        onStartShouldSetResponder={() => true}
        style={[
          tw`w-10/12 bg-transparent px-sm`,
          chatMessage.sender === whoAmI && tw`self-end`,
        ]}
      >
        <View style={[tw`px-3 py-2 mt-2 rounded-2xl`, bgColor]}>
          <PeachText style={tw`shrink-0 text-black-100`} selectable>
            {decryptedMessage ||
              (failedDecrypting ? i18n("chat.decyptionFailed") : "")}
          </PeachText>
          <PeachText style={tw`pt-1 ml-auto leading-5 text-right`}>
            <PeachText style={tw`subtitle-2 leading-xs text-black-50`}>
              {toTimeFormat(messageDate.getHours(), messageDate.getMinutes())}
            </PeachText>
            {chatMessage.sender === whoAmI && (
              <View style={tw`pl-1`}>
                <Icon
                  id={statusIcon}
                  style={tw`relative w-4 h-4 -bottom-1`}
                  color={statusIconColor.color}
                />
              </View>
            )}
          </PeachText>
        </View>
        {/* {message.failedToSend && (
          <TouchableOpacity
            onPress={() => resendMessage(message)}
            style={tw`flex-row justify-end items-center mt-1 pr-3 mr-0.5`}
          >
            <PeachText style={tw`mr-1 text-error-main`}>
              {i18n("chat.failedToSend")}{" "}
              <PeachText style={tw`underline text-error-main`}>
                {i18n("retry")}
              </PeachText>
            </PeachText>
            <Icon
              id="refreshCcw"
              style={tw`w-3 h-3`}
              color={tw.color("error-main")}
            />
          </TouchableOpacity>
        )} */}
      </View>
    </>
  );
};

function toDateFormat(date: Date): string {
  const day = `${date.getDate()}${getDateSuffix(date.getDate())}`;
  return `${i18n(`month.short.${date.getMonth()}`)} ${day}, ${date.getFullYear()}`;
}

function getDateSuffix(date: number) {
  const SUFFIXES = ["th", "st", "nd", "rd"];
  const LAST_DIGIT_DIVISOR = 10;
  const LAST_TWO_DIGITS_DIVISOR = 100;

  const lastDigit = date % LAST_DIGIT_DIVISOR;
  const lastTwoDigits = date % LAST_TWO_DIGITS_DIVISOR;

  const SPECIAL_CASE_LOWER_BOUND = 11;
  const SPECIAL_CASE_UPPER_BOUND = 13;
  if (
    lastTwoDigits >= SPECIAL_CASE_LOWER_BOUND &&
    lastTwoDigits <= SPECIAL_CASE_UPPER_BOUND
  ) {
    return SUFFIXES[0];
  }

  return SUFFIXES[lastDigit] || SUFFIXES[0];
}
