import { useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PremiumInput } from "../../components/PremiumInput";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Button } from "../../components/buttons/Button";
import { PremiumSlider } from "../../components/inputs/premiumSlider/PremiumSlider";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { usePatchOffer } from "../../hooks/usePatchOffer";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { getOfferPrice } from "../../utils/offer/getOfferPrice";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { priceFormat } from "../../utils/string/priceFormat";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";

export const EditPremium = () => {
  const { offerId } = useRoute<"editPremium">().params;
  const { offer } = useOfferDetail(offerId);
  const offerPremium =
    !!offer && "premium" in offer ? offer.premium : undefined;
  const [premium, setPremium] = useState(offerPremium);
  const displayPremium = premium ?? offerPremium ?? 0;
  const { data: priceBook, isSuccess } = useMarketPrices();

  if (offer && !isSellOffer(offer)) {
    throw new Error("Offer is not a sell offer");
  }

  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const currentPrice =
    offer && isSuccess
      ? getOfferPrice({
          amount: offer?.amount,
          premium: displayPremium,
          prices: priceBook,
          currency: displayCurrency,
        })
      : 0;

  return (
    <Screen header={<EditPremiumHeader />}>
      <MarketInfo
        type="buyOffers"
        meansOfPayment={offer?.meansOfPayment}
        maxPremium={displayPremium}
      />
      <Premium
        premium={displayPremium}
        setPremium={setPremium}
        amount={offer?.amount ?? 0}
        offerPrice={
          <PeachText style={tw`text-center text-black-50`}>
            (
            {i18n(
              "sell.premium.currently",
              `${priceFormat(currentPrice)} ${displayCurrency}`,
            )}
            )
          </PeachText>
        }
      />
      <ConfirmButton offerId={offerId} newPremium={displayPremium} />
    </Screen>
  );
};

function EditPremiumHeader() {
  const { offerId } = useRoute<"editPremium">().params;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="premium" />);
  return (
    <Header
      title={offerIdToHex(offerId)}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  );
}

type Props = {
  offerId: string;
  newPremium: number;
};
function ConfirmButton({ offerId, newPremium }: Props) {
  const { mutate: confirmPremium, isPending } = usePatchOffer();
  const navigation = useStackNavigation();
  return (
    <Button
      onPress={() =>
        confirmPremium(
          { offerId, newData: { premium: newPremium } },
          { onSuccess: navigation.goBack },
        )
      }
      style={tw`self-center`}
      loading={isPending}
    >
      {i18n("confirm")}
    </Button>
  );
}

type PremiumProps = {
  premium: number;
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void;
  amount: number;
  offerPrice: React.ReactNode;
};

function Premium({ premium, setPremium, amount, offerPrice }: PremiumProps) {
  return (
    <View style={tw`items-center justify-center grow gap-7`}>
      <View style={tw`items-center`}>
        <PeachText style={[tw`text-center h6`, tw`md:h5`]}>
          {i18n("sell.premium.title")}
        </PeachText>
        <View style={tw`flex-row items-center gap-1`}>
          <PeachText style={tw`text-center subtitle-1`}>
            {i18n("search.sellOffer")}
          </PeachText>
          <BTCAmount size="small" amount={amount} />
        </View>
      </View>
      <View style={tw`items-center gap-1`}>
        <PremiumInput premium={premium} setPremium={setPremium} />
        {offerPrice}
      </View>
      <PremiumSlider
        style={tw`items-center self-stretch gap-6px`}
        premium={premium}
        setPremium={setPremium}
      />
    </View>
  );
}
