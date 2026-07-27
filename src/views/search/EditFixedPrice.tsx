import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Button } from "../../components/buttons/Button";
import { NumberInput } from "../../components/inputs/NumberInput";
import { PremiumSlider } from "../../components/inputs/premiumSlider/PremiumSlider";
import { getPremiumColor } from "../../components/matches/utils/getPremiumColor";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { usePatchOffer } from "../../hooks/usePatchOffer";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { getOfferPrice } from "../../utils/offer/getOfferPrice";
import { getPremiumBounds } from "../../utils/offer/getPremiumBounds";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { priceFormat } from "../../utils/string/priceFormat";

export const EditFixedPrice = () => {
  const { offerId } = useRoute<"editFixedPrice">().params;
  const { offer } = useOfferDetail(offerId);

  if (offer && !isSellOffer(offer)) {
    throw new Error("Offer is not a sell offer");
  }

  const offerFixedPrice =
    offer && "fixedPrice" in offer ? offer.fixedPrice : undefined;
  // fixedPriceCurrency is typed as a plain string on the offer; the market
  // price lookup expects a Currency, and any live offer's currency is a valid
  // one, so the cast is safe.
  const currency = ((offer && "fixedPriceCurrency" in offer
    ? offer.fixedPriceCurrency
    : undefined) ?? "EUR") as Currency;
  const amount = offer?.amount ?? 0;

  const { data: priceBook, isSuccess } = useMarketPrices();
  const { bitcoinPrice: currentCHFPrice } = useBitcoinPrices(amount, "CHF");
  const { min, max } = getPremiumBounds(amount, currentCHFPrice);

  const canComputePrices = isSuccess && !!priceBook && amount > 0;
  const marketPrice = canComputePrices
    ? getOfferPrice({ amount, premium: 0, prices: priceBook, currency })
    : 0;

  // priceInput (a string) is the single source of truth; both the input and
  // the slider write to it.
  const [priceInput, setPriceInput] = useState<string>();
  const displayPrice =
    priceInput ??
    (offerFixedPrice !== undefined ? String(offerFixedPrice) : "");
  const fixedPrice = Number(displayPrice) || 0;

  // premium implied by the current price vs the current market price
  const premium =
    marketPrice > 0 ? round((fixedPrice / marketPrice - 1) * CENT, 2) : 0;
  // BTC/fiat rate the fixed price works out to (premium already baked in)
  const fixedPriceBtcRate =
    fixedPrice > 0 && amount > 0
      ? round((fixedPrice * SATSINBTC) / amount, 2)
      : 0;

  // PremiumSlider captures its setPremium once (in a ref-held PanResponder), so
  // this must be a stable callback; it reads marketPrice from a ref to stay
  // fresh once prices load.
  const marketPriceRef = useRef(marketPrice);
  marketPriceRef.current = marketPrice;
  const priceForPremium = (p: number) => round(marketPrice * (1 + p / CENT), 2);
  const setPriceFromPremium = useCallback((newPremium: number) => {
    const mp = marketPriceRef.current;
    if (mp <= 0) return;
    setPriceInput(String(round(mp * (1 + newPremium / CENT), 2)));
  }, []);

  // Validate the price against the exact bounds the slider produces, so its min
  // and max positions land on valid values (avoids rounding the round-tripped
  // premium past the limit).
  const minPrice = priceForPremium(min);
  const maxPrice = priceForPremium(max);
  const isValid =
    canComputePrices && fixedPrice >= minPrice && fixedPrice <= maxPrice;

  return (
    <Screen header={<EditFixedPriceHeader />}>
      <View style={tw`items-center justify-center grow gap-7`}>
        <View style={tw`items-center`}>
          <PeachText style={[tw`text-center h6`, tw`md:h5`]}>
            {i18n("sell.fixedPrice.title")}
          </PeachText>
          <View style={tw`flex-row items-center gap-1`}>
            <PeachText style={tw`text-center subtitle-1`}>
              {i18n("search.sellOffer")}
            </PeachText>
            <BTCAmount size="small" amount={amount} />
          </View>
        </View>

        <View style={tw`items-center self-stretch gap-1`}>
          <View style={tw`items-center self-stretch`}>
            <View style={tw`w-28`}>
              <NumberInput
                decimals={2}
                value={displayPrice}
                onChangeText={setPriceInput}
                textAlign="center"
                errorMessage={
                  !isValid && !!displayPrice
                    ? [i18n("sell.fixedPrice.outOfRange")]
                    : []
                }
              />
            </View>
            <View style={tw`absolute left-1/2 top-0 h-10 justify-center`}>
              <PeachText style={tw`ml-16 subtitle-1`}>{currency}</PeachText>
            </View>
          </View>
          {marketPrice > 0 && (
            <>
              <PeachText
                style={[
                  tw`text-center subtitle-1`,
                  getPremiumColor(premium, false),
                ]}
              >
                {Math.abs(premium)}%{" "}
                {i18n(
                  premium >= 0
                    ? "offer.summary.premium"
                    : "offer.summary.discount",
                )}
              </PeachText>
              <PeachText style={tw`text-center text-black-50`}>
                {priceFormat(fixedPriceBtcRate)} BTC{currency}
              </PeachText>
            </>
          )}
        </View>

        <PremiumSlider
          style={tw`items-center self-stretch gap-6px`}
          premium={premium}
          setPremium={setPriceFromPremium}
          currentAmount={amount}
          currentCHFPrice={currentCHFPrice}
        />
      </View>

      <ConfirmButton
        offerId={offerId}
        newFixedPrice={fixedPrice}
        disabled={!isValid}
      />
    </Screen>
  );
};

function EditFixedPriceHeader() {
  const { offerId } = useRoute<"editFixedPrice">().params;
  return <Header title={offerIdToHex(offerId)} />;
}

type ConfirmButtonProps = {
  offerId: string;
  newFixedPrice: number;
  disabled: boolean;
};
function ConfirmButton({
  offerId,
  newFixedPrice,
  disabled,
}: ConfirmButtonProps) {
  const { mutate: confirmFixedPrice, isPending } = usePatchOffer();
  const navigation = useStackNavigation();
  return (
    <Button
      onPress={() =>
        confirmFixedPrice(
          { offerId, newData: { fixedPrice: newFixedPrice } },
          { onSuccess: navigation.goBack },
        )
      }
      style={tw`self-center`}
      loading={isPending}
      disabled={disabled}
    >
      {i18n("confirm")}
    </Button>
  );
}
