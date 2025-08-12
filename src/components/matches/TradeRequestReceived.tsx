import { TouchableOpacity, View } from "react-native";

import { useState } from "react";
import {
  BuyOffer69TradeRequest,
  SellOffer69TradeRequest,
} from "../../../peach-api/src/@types/offer";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { useUser } from "../../views/publicProfile/useUser";
import { Icon } from "../Icon";
import { ProfileInfo } from "../ProfileInfo";
import { NewBubble as Bubble } from "../bubble/Bubble";
import { PeachText } from "../text/PeachText";
import { HorizontalLine } from "../ui/HorizontalLine";
import { options } from "./buttons/options";
import { PriceInfo } from "./components/PriceInfo";
import { getPremiumOfMatchedOffer } from "./getPremiumOfMatchedOffer";
import { useCashPaymentMethodName } from "./useCashPaymentMethodName";

export const TradeRequestReceived = ({
  tradeRequest,
  offer,
  acceptTradeRequestFunction,
  rejectTradeRequestFunction,
  goToChatFunction,
  type,
}: {
  tradeRequest: SellOffer69TradeRequest | BuyOffer69TradeRequest;
  offer: SellOffer | BuyOffer69;
  acceptTradeRequestFunction: () => void;
  rejectTradeRequestFunction: () => void;
  goToChatFunction: () => void;
  type: "sell" | "buy";
}) => {
  console.log("GO TO CHAT:", goToChatFunction);
  const {
    paymentMethod,
    userId,
    price: matchedPrice,
    currency: selectedCurrency,
  } = tradeRequest;

  const selectedPaymentMethod = paymentMethod as PaymentMethod;

  const { amount, amountSats } = offer;

  const { user } = useUser(userId);

  // const tradingLimitReached = isLimitReached(
  //   unavailable.exceedsLimit || [],
  //   selectedPaymentMethod,
  // );

  // const currentOptionName = useMemo(
  //   () =>
  //     matched
  //       ? "offerMatched"
  //       : tradingLimitReached
  //         ? "tradingLimitReached"
  //         : !selectedPaymentMethod
  //           ? "missingSelection"
  //           : "acceptMatch",
  //   [matched, selectedPaymentMethod, tradingLimitReached],
  // );
  const currentOptionName = "acceptTradeRequest";
  const currentRejectOptionName = "rejectTradeRequest";
  const currentGoToChatOptionName = "goToChat";

  const { isDarkMode } = useThemeStore();

  return (
    <View style={tw`justify-center flex-1`}>
      <View
        style={[
          tw`overflow-hidden border-4 rounded-2xl`,
          options[currentOptionName].backgroundColor,
          {
            borderColor:
              options[currentOptionName].backgroundColor.backgroundColor,
          },
        ]}
        onStartShouldSetResponder={() => true}
      >
        <View
          style={tw.style(
            "gap-4 p-4",
            isDarkMode ? "bg-card" : "bg-primary-background-light-color",
          )}
        >
          {user && <ProfileInfo user={user} isOnMatchCard />}

          <HorizontalLine />

          <SellerPriceInfo
            amount={type === "sell" ? amount : amountSats}
            price={matchedPrice}
            currency={selectedCurrency as Currency}
          />

          <HorizontalLine />

          <View style={tw`gap-4`}>
            <PaymentDetail
              label={i18n("match.selectedCurrency")}
              value={selectedCurrency}
            />
            {selectedPaymentMethod && (
              <>
                {isCashTrade(selectedPaymentMethod) ? (
                  <CashPaymentDetail method={selectedPaymentMethod} />
                ) : (
                  <PaymentDetail
                    label={i18n("match.selectedPaymentMethod")}
                    value={i18n(`paymentMethod.${selectedPaymentMethod}`)}
                  />
                )}
              </>
            )}
          </View>
        </View>
        <AcceptTradeRequestButton
          optionName={currentOptionName}
          acceptFunction={acceptTradeRequestFunction}
        />
        <RejectTradeRequestButton
          optionName={currentRejectOptionName}
          rejectFunction={rejectTradeRequestFunction}
        />
        <GoToChatButton
          optionName={currentGoToChatOptionName}
          goToChatFunction={goToChatFunction}
        />
      </View>
    </View>
  );
};

function CashPaymentDetail({ method }: { method: `cash.${string}` }) {
  const value = useCashPaymentMethodName(method);

  return (
    <PaymentDetail label={i18n("match.selectedPaymentMethod")} value={value} />
  );
}

function PaymentDetail({ label, value }: { label: string; value?: string }) {
  return (
    <View style={tw`flex-row justify-between`}>
      <PeachText style={tw`text-black-50`}>{label}</PeachText>
      <Bubble disabled color="orange" ghost>
        {value}
      </Bubble>
    </View>
  );
}

type AcceptTradeRequestButtonProps = {
  optionName: keyof typeof options;
  acceptFunction: () => void;
};
function AcceptTradeRequestButton({
  optionName,
  acceptFunction,
}: AcceptTradeRequestButtonProps) {
  const currentOption = options[optionName];
  const [hasPressed, setHasPressed] = useState(false);

  const onPress = () => {
    console.log(999, optionName);
    if (optionName === "acceptTradeRequest") {
      console.log("sdffdsafsda");
      setHasPressed(true);
      acceptFunction();
    }
  };

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-center py-2 gap-10px`}
      onPress={onPress}
      disabled={optionName === "offerMatched" || hasPressed}
    >
      <PeachText style={tw`button-large text-primary-background-light-color`}>
        {i18n(currentOption.text)}
      </PeachText>
      <Icon
        id={currentOption.iconId}
        color={tw.color("primary-background-light-color")}
        size={24}
      />
    </TouchableOpacity>
  );
}

type RejectTradeRequestButtonProps = {
  optionName: keyof typeof options;
  rejectFunction: () => void;
};
function RejectTradeRequestButton({
  optionName,
  rejectFunction,
}: RejectTradeRequestButtonProps) {
  const currentOption = options[optionName];
  const [hasPressed, setHasPressed] = useState(false);

  const onPress = () => {
    setHasPressed(true);
    rejectFunction();
  };

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-center py-2 gap-10px`}
      onPress={onPress}
      disabled={hasPressed}
    >
      <PeachText style={tw`button-large text-primary-background-light-color`}>
        {i18n(currentOption.text)}
      </PeachText>
      <Icon
        id={currentOption.iconId}
        color={tw.color("primary-background-light-color")}
        size={24}
      />
    </TouchableOpacity>
  );
}

type GoToChatButtonProps = {
  optionName: keyof typeof options;
  goToChatFunction: () => void;
};
function GoToChatButton({ optionName, goToChatFunction }: GoToChatButtonProps) {
  const currentOption = options[optionName];
  const [hasPressed, setHasPressed] = useState(false);

  const onPress = () => {
    setHasPressed(true);
    goToChatFunction();
  };

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-center py-2 gap-10px`}
      onPress={onPress}
      disabled={optionName === "offerMatched" || hasPressed}
    >
      <PeachText style={tw`button-large text-primary-background-light-color`}>
        {i18n(currentOption.text)}
      </PeachText>
      <Icon
        id={currentOption.iconId}
        color={tw.color("primary-background-light-color")}
        size={24}
      />
    </TouchableOpacity>
  );
}

type PriceInfoProps = {
  amount: number;
  price: number | null;
  currency?: Currency;
};

function SellerPriceInfo({ amount, price, currency }: PriceInfoProps) {
  const { data: priceBook } = useMarketPrices();
  if (!price || !currency) return null;

  const premium = getPremiumOfMatchedOffer(
    { amount, price, currency },
    priceBook,
  );

  return (
    <PriceInfo
      amount={amount}
      price={price}
      currency={currency}
      premium={premium}
    />
  );
}
