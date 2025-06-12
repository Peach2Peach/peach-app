import { useState } from "react";
import { View } from "react-native";
import { SellOffer } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { PremiumInput } from "../../components/PremiumInput";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PremiumSlider } from "../../components/inputs/premiumSlider/PremiumSlider";
import { MeansOfPayment } from "../../components/offer/MeansOfPayment";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { usePatchOffer } from "../../hooks/usePatchOffer";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { hasMopsConfigured } from "../../utils/offer/hasMopsConfigured";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { priceFormat } from "../../utils/string/priceFormat";
import { AmountSelector } from "../offerPreferences/Sell";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";
import { Section } from "../offerPreferences/components/Section";

export const EditPremium = () => {
  const { offerId } = useRoute<"editPremium">().params;
  const { offer } = useOfferDetail(offerId);

  if (!offer) {
    throw new Error("offer not found");
  }

  const offerPremium =
    !!offer && "premium" in offer ? offer.premium : undefined;
  const [premium, setPremium] = useState(offerPremium);
  const displayPremium = premium ?? offerPremium ?? 0;
  const { data: priceBook, isSuccess } = useMarketPrices();

  if (offer && !isSellOffer(offer)) {
    throw new Error("Offer is not a sell offer");
  }

  const displayCurrency =
    (Object.keys(offer?.meansOfPayment ?? {})[0] as Currency) ?? "EUR";

  const getOfferPrice = (price = 0) =>
    round((price * offer?.amount * (1 + displayPremium / CENT)) / SATSINBTC, 2);
  const currentPrice =
    offer && isSuccess ? getOfferPrice(priceBook[displayCurrency]) : 0;

  return (
    <Screen header={<EditPremiumHeader />}>
      <MarketInfo
        type="buyOffers"
        meansOfPayment={offer?.meansOfPayment}
        maxPremium={displayPremium}
      />
      <OfferMethods offer={offer} />
      <AmountSelector
        setIsSliding={() => {}}
        amount={offer.amount}
        setAmount={() => {}}
        premium={offer.premium}
        setPremium={() => {}}
        showCompetingSellOffers={false}
        minPremiumSearchCase={false}
        justShow
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

function OfferMethods({ offer }: { offer: SellOffer }) {
  const meansOfPayment = offer.meansOfPayment;

  const hasSelectedMethods = hasMopsConfigured(meansOfPayment);

  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode
    ? tw.color("bg-card")
    : tw.color("bg-primary-background-dark");

  return (
    <Section.Container style={{ backgroundColor }}>
      {hasSelectedMethods ? (
        <MeansOfPayment
          meansOfPayment={meansOfPayment}
          style={tw`self-stretch `}
          noSelection
        />
      ) : (
        <Section.Title>
          {i18n("offerPreferences.allPaymentMethods")}
        </Section.Title>
      )}
    </Section.Container>
  );
}

function EditPremiumHeader() {
  const { offerId } = useRoute<"editPremium">().params;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="premium" />);
  return (
    <Header
      title={`${i18n("offer.edit")} ${offerIdToHex(offerId)}`}
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

function Premium({ premium, setPremium, offerPrice }: PremiumProps) {
  return (
    <View style={tw`items-center justify-center grow gap-7`}>
      <View style={tw`items-center`}>
        <PeachText style={[tw`text-center h6`, tw`md:h5`]}>
          {i18n("sell.premium.title")}
        </PeachText>
        {/* <View style={tw`flex-row items-center gap-1`}>
          <PeachText style={tw`text-center subtitle-1`}>
            {i18n("search.sellOffer")}
          </PeachText>
          <BTCAmount size="small" amount={amount} />
        </View> */}
      </View>
      <View style={tw`items-center gap-1`}>
        <PremiumInput premium={premium} setPremium={setPremium} />
        {offerPrice}
      </View>
      <PremiumSlider premium={premium} setPremium={setPremium} />
    </View>
  );
}
