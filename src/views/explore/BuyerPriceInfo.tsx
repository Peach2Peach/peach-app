import { useMemo } from "react";
import { View } from "react-native";
import { Pricebook } from "../../../peach-api/src/@types/global";
import { Icon } from "../../components/Icon";
import { getDisplayAmount } from "../../components/bitcoin/BTCAmount";
import { getMatchPrice } from "../../components/matches/utils/getMatchPrice";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { thousands } from "../../utils/string/thousands";

type PriceInfoProps = {
  matched: boolean;
  matchedPrice: number | null;
  prices: Pricebook;
  amount: number;
  premium: number;
  selectedCurrency: Currency;
  selectedPaymentMethod: PaymentMethod | undefined;
};
export function BuyerPriceInfo({
  matched,
  matchedPrice,
  prices,
  amount,
  premium,
  selectedCurrency,
  selectedPaymentMethod,
}: PriceInfoProps) {
  const { data: priceBook, isSuccess } = useMarketPrices();

  const amountInBTC = amount / SATSINBTC;
  const displayPrice = getMatchPrice(
    {
      matched,
      matchedPrice,
      prices,
    },
    selectedPaymentMethod,
    selectedCurrency,
  );

  const bitcoinPrice =
    priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice;
  const marketPrice = amountInBTC * bitcoinPrice;

  const displayPremium = matched
    ? isSuccess
      ? round((displayPrice / marketPrice - 1) * CENT, 2)
      : 0
    : premium;

  return (
    <PriceInfo
      satsAmount={amount}
      selectedCurrency={selectedCurrency}
      premium={displayPremium}
      price={displayPrice}
    />
  );
}

export function PriceInfo({
  satsAmount,
  selectedCurrency,
  premium,
  price,
}: {
  satsAmount: number;
  selectedCurrency: Currency;
  premium: number;
  price: number;
}) {
  const bitcoinPrice = price / (satsAmount / SATSINBTC);
  return (
    <View style={tw`items-center justify-center gap-5`}>
      <View style={tw`items-center gap-2`}>
        <LargeBitcoinAmount amount={satsAmount} />
        <PeachText style={tw`h5`}>
          for {price.toFixed(2)} {selectedCurrency}
        </PeachText>
      </View>
      <View style={tw`items-center justify-center`}>
        <PeachText style={tw`body-l`}>
          {thousands(Math.round(bitcoinPrice))} {selectedCurrency} / BTC
        </PeachText>
        <PeachText style={tw`body-l`}>
          {Math.abs(premium)} % {premium < 0 ? "under" : "over"} KYC price
        </PeachText>
      </View>
    </View>
  );
}

function LargeBitcoinAmount({ amount }: { amount: number }) {
  const [greyText, blackText] = useMemo(
    () => getDisplayAmount(amount),
    [amount],
  );

  const textStyle = tw`leading-normal h5`;

  return (
    <View style={tw`flex-row items-center gap-2px`}>
      <View style={tw`p-1`}>
        <Icon id={"bitcoinLogo"} size={24} />
      </View>

      <View style={tw`flex-row gap-1`}>
        <View style={tw`flex-row`}>
          <PeachText style={[tw`opacity-10`, textStyle]}>{greyText}</PeachText>
          <PeachText style={textStyle}>{blackText}</PeachText>
        </View>
        <PeachText style={textStyle}>{i18n("currency.SATS")}</PeachText>
      </View>
    </View>
  );
}
