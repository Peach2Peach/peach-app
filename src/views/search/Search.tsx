import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Matches } from "../../components/matches/Matches";
import { SellOfferSummary } from "../../components/offer/SellOfferSummary";
import { useWalletLabel } from "../../components/offer/useWalletLabel";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { FIFTEEN_SECONDS } from "../../constants";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { HelpPopup } from "../../popups/HelpPopup";
import { SellSorters } from "../../popups/sorting/SellSorters";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isBuyOffer } from "../../utils/offer/isBuyOffer";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { NewLoadingScreen as LoadingScreen } from "../loading/LoadingScreen";
import { useOfferMatches } from "./hooks/useOfferMatches";
import { useRefetchOnNotification } from "./hooks/useRefetchOnNotification";

export const Search = () => {
  const navigation = useStackNavigation();
  const { offerId } = useRoute<"search">().params;
  const { allMatches: matches, refetch } = useOfferMatches(
    offerId,
    FIFTEEN_SECONDS,
  );

  const { offer } = useOfferDetail(offerId);
  useRefetchOnNotification(refetch);

  if (offer?.contractId)
    navigation.replace("contract", {
      contractId: offer.contractId,
    });

  if (!offer || !isSellOffer(offer) || offer.contractId)
    return <LoadingScreen />;
  return (
    <Screen
      style={!!matches.length && tw`px-0`}
      header={<SearchHeader offer={offer} />}
      showTradingLimit
    >
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        bounces={false}
      >
        {matches.length ? (
          <Matches offer={offer} />
        ) : (
          <NoMatchesYet offer={offer} />
        )}
      </PeachScrollView>
    </Screen>
  );
};

function NoMatchesYet({ offer }: { offer: SellOffer }) {
  return (
    <View style={tw`gap-8`}>
      <PeachText style={tw`text-center subtitle-1`}>
        {i18n("search.weWillNotifyYou")}
      </PeachText>

      <SellOfferSummary
        offer={offer}
        walletLabel={<WalletLabel address={offer.returnAddress} />}
      />
    </View>
  );
}

function WalletLabel({ address }: { address: string }) {
  const walletLabel = useWalletLabel({ address });
  return (
    <PeachText style={tw`text-center subtitle-1`}>{walletLabel}</PeachText>
  );
}

function SearchHeader({ offer }: { offer: SellOffer }) {
  const { offerId } = useRoute<"search">().params;
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const showMatchPopup = useCallback(
    () => setPopup(<HelpPopup id="matchmatchmatch" />),
    [setPopup],
  );
  const showAcceptMatchPopup = useCallback(
    () => setPopup(<HelpPopup id="acceptMatch" />),
    [setPopup],
  );
  const showSortAndFilterPopup = useCallback(
    () => setPopup(<SellSorters />),
    [setPopup],
  );
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );

  const goToEditPremium = useCallback(
    () => navigation.navigate("editPremium", { offerId }),
    [navigation, offerId],
  );

  const memoizedHeaderIcons = useMemo(() => {
    if (!offer) return undefined;
    const icons = [
      { ...headerIcons.sellFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.percent, onPress: goToEditPremium },
      { ...headerIcons.cancel, onPress: cancelOffer },
    ];

    if (offer.matches.length > 0) {
      icons.push({
        ...headerIcons.help,
        onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup,
      });
    }
    return icons;
  }, [
    offer,
    cancelOffer,
    goToEditPremium,
    showMatchPopup,
    showAcceptMatchPopup,
    showSortAndFilterPopup,
  ]);

  return <Header title={offerIdToHex(offerId)} icons={memoizedHeaderIcons} />;
}
