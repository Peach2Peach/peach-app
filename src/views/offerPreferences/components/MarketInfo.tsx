import { View } from "react-native";
import { MeansOfPayment } from "../../../../peach-api/src/@types/payment";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { Section } from "./Section";
import { useFilteredMarketStats } from "./useFilteredMarketStats";

export function MarketInfo({
  type,
  ...preferences
}: {
  type: "buyOffers" | "sellOffers";
  meansOfPayment?: MeansOfPayment;
  maxPremium?: number;
  minReputation?: number;
  buyAmountRange?: [number, number];
  sellAmount?: number;
}) {
  const textStyle =
    type === "buyOffers" ? tw`text-success-main` : tw`text-primary-main`;

  const {
    data: { offersWithinRange, averagePremium },
  } = useFilteredMarketStats({
    type: type === "buyOffers" ? "bid" : "ask",
    ...preferences,
  });

  return (
    <Section.Container style={tw`gap-0`}>
      <View style={tw`items-center`}>
        <View style={tw`-gap-13px`}>
          <PeachText style={[tw`h5`, textStyle]}>
            {i18n(`offerPreferences.${type}`, String(offersWithinRange.length))}
          </PeachText>
          <PeachText style={[tw`subtitle-2`, textStyle]}>
            {i18n("offerPreferences.forYourPreferences")}
          </PeachText>
        </View>
      </View>
      {type === "sellOffers" && (
        <AveragePremium
          averagePremium={averagePremium}
          offersWithinRange={offersWithinRange}
        />
      )}
    </Section.Container>
  );
}

function AveragePremium({
  averagePremium,
  offersWithinRange,
}: {
  averagePremium: number;
  offersWithinRange: (
    | Pick<SellOffer, "premium" | "amount">
    | Pick<BuyOffer, "amount">
  )[];
}) {
  return (
    <PeachText
      style={[
        tw`body-s text-primary-main`,
        offersWithinRange.length === 0 && tw`opacity-0`,
      ]}
    >
      {i18n("home.averagePremium", String(averagePremium))}
    </PeachText>
  );
}
