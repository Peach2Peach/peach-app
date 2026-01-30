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
import { useBuyOfferDetail } from "../../hooks/query/peach069/useBuyOffer";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { getOfferPrice } from "../../utils/offer/getOfferPrice";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { priceFormat } from "../../utils/string/priceFormat";

export const EditPremiumOfBuyOffer = () => {
  const { offerId, preferedDisplayCurrency } =
    useRoute<"editPremiumOfBuyOffer">().params;
  const { buyOffer } = useBuyOfferDetail(offerId);
  const offerPremium = buyOffer ? buyOffer.premium : undefined;
  const [premium, setPremium] = useState(offerPremium);
  const displayPremium = premium ?? offerPremium ?? 0;
  const { data: priceBook, isSuccess } = useMarketPrices();

  const displayCurrency =
    preferedDisplayCurrency !== undefined
      ? preferedDisplayCurrency
      : ((Object.keys(buyOffer?.meansOfPayment ?? {})[0] as Currency) ?? "EUR");
  const currentPrice =
    buyOffer && isSuccess
      ? getOfferPrice({
          amount: buyOffer?.amountSats,
          premium: displayPremium,
          prices: priceBook,
          currency: displayCurrency,
        })
      : 0;

  return (
    <Screen header={<EditPremiumHeader />}>
      <Premium
        premium={displayPremium}
        setPremium={setPremium}
        amount={buyOffer?.amountSats ?? 0}
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
  const { offerId } = useRoute<"editPremiumOfBuyOffer">().params;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="premiumBuy" />);
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
  const editPremiumFunc = async () => {
    await peachAPI.private.peach069.patchBuyOfferPremiumById({
      buyOfferId: offerId,
      premium: newPremium,
    });
  };
  const [isPending, setIsPending] = useState(false);
  const navigation = useStackNavigation();
  return (
    <Button
      onPress={async () => {
        setIsPending(true);
        await editPremiumFunc();
        navigation.goBack();
      }}
      style={tw`self-center bg-success-main`}
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
            {i18n("search.buyOffer")}
          </PeachText>
          <BTCAmount size="small" amount={amount} />
        </View>
      </View>
      <View style={tw`items-center gap-1`}>
        <PremiumInput premium={premium} setPremium={setPremium} type={"buy"} />
        {offerPrice}
      </View>
      <PremiumSlider
        style={tw`items-center self-stretch gap-6px`}
        premium={premium}
        setPremium={setPremium}
        green
      />
    </View>
  );
}
