import { useMemo } from "react";
import { View } from "react-native";
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
  match: Match;
  selectedCurrency: Currency;
  selectedPaymentMethod: PaymentMethod;
};
export function BuyerPriceInfo({
  match,
  selectedCurrency,
  selectedPaymentMethod,
}: PriceInfoProps) {
  const { data: priceBook, isSuccess } = useMarketPrices();

  const amountInBTC = match.amount / SATSINBTC;
  const displayPrice = getMatchPrice(
    match,
    selectedPaymentMethod,
    selectedCurrency,
  );

  const bitcoinPrice =
    priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice;
  const marketPrice = amountInBTC * bitcoinPrice;

  const premium = match.matched
    ? isSuccess
      ? round((displayPrice / marketPrice - 1) * CENT, 2)
      : 0
    : match.premium;

  return (
    <PriceInfo
      satsAmount={match.amount}
      selectedCurrency={selectedCurrency}
      premium={premium}
      price={displayPrice}
      bitcoinPrice={bitcoinPrice}
    />
  );
}

export function PriceInfo({
  satsAmount,
  selectedCurrency,
  premium,
  price,
  bitcoinPrice,
}: {
  satsAmount: number;
  selectedCurrency: Currency;
  premium: number;
  price: number;
  bitcoinPrice: number;
}) {
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
