import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n, { useI18n } from "../../utils/i18n";
import {
  PAGESIZE,
  useOfferMatches,
} from "../../views/search/hooks/useOfferMatches";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { PeachText } from "../text/PeachText";
import { Match } from "./Match";
import { getPremiumColor } from "./utils/getPremiumColor";

const MEDIUM_SCREEN_OFFSET = 48;
const SMALL_SCREEN_OFFSET = 40;

export const Matches = ({ offer }: { offer: SellOffer }) => {
  useI18n();
  const { width } = useWindowDimensions();
  const isMediumScreen = useIsMediumScreen();
  const { offerId } = useRoute<"search">().params;
  const {
    allMatches: matches,
    fetchNextPage,
    hasNextPage,
  } = useOfferMatches(offerId);
  const [currentPage, setCurrentPage] = useState(0);

  const onSnapToItem = (index: number) => {
    const newIndex = Math.min(index, matches.length - 1);
    setCurrentPage(Math.floor(newIndex / PAGESIZE));
    if (newIndex === matches.length - 1 && hasNextPage) fetchNextPage();
  };

  return (
    <View style={tw`h-full`}>
      <MatchInformation offer={offer} />
      <View style={tw`shrink`}>
        <Carousel
          {...{ width, onSnapToItem }}
          loop={false}
          snapEnabled
          mode="parallax"
          style={tw`grow`}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: isMediumScreen
              ? MEDIUM_SCREEN_OFFSET
              : SMALL_SCREEN_OFFSET,
          }}
          data={matches}
          renderItem={({ item: match }) => (
            <Match {...{ match, offer, currentPage }} />
          )}
        />
      </View>
    </View>
  );
};

function MatchInformation({ offer }: { offer: SellOffer }) {
  const { offerId } = useRoute<"search">().params;
  const { allMatches: matches } = useOfferMatches(offerId);
  const color = getPremiumColor(offer.premium || 0, false);

  return (
    <View>
      <PeachText style={tw`text-center h4 text-primary-main`}>
        {i18n(`search.youGot${matches.length === 1 ? "AMatch" : "Matches"}`)}
      </PeachText>
      <PeachText style={tw`text-center body-l text-black-65`}>
        {i18n("search.sellOffer")}:
      </PeachText>
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount amount={offer.amount} size="medium" />
        {offer.premium !== undefined && (
          <PeachText style={[tw`leading-loose body-l`, color]}>
            {" "}
            ({offer.premium > 0 ? "+" : ""}
            {String(offer.premium)}%)
          </PeachText>
        )}
      </View>
    </View>
  );
}
