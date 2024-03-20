import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { isSellOffer } from "../../utils/offer/isSellOffer";

import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { EscrowButton } from "../../components/EscrowButton";
import { Header } from "../../components/Header";
import { useWalletLabel } from "../../components/offer/useWalletLabel";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { LoadingScreen } from "../loading/LoadingScreen";

export const CanceledOfferDetails = () => {
  const { offerId } = useRoute<"offer">().params;
  const { offer } = useOfferDetail(offerId);

  return offer?.tradeStatus === "offerCanceled" && isSellOffer(offer) ? (
    <OfferDetailsScreen offer={offer} />
  ) : (
    <LoadingScreen />
  );
};

function OfferDetailsHeader({
  amount,
  premium,
}: {
  amount: number;
  premium: number;
}) {
  const { t } = useTranslate();
  return (
    <Header
      title={t("yourTrades.offerCanceled.subtitle")}
      theme={"cancel"}
      subtitle={
        <Header.Subtitle
          amount={amount}
          premium={premium}
          viewer={"seller"}
          theme={"cancel"}
        />
      }
    />
  );
}

function OfferDetailsScreen({ offer }: { offer: SellOffer }) {
  const { t } = useTranslate("contract");
  const { returnAddress, escrow } = offer;
  const walletLabel = useWalletLabel({ address: returnAddress });
  return (
    <Screen header={<OfferDetailsHeader {...offer} />}>
      <View style={tw`justify-center grow`}>
        <PeachText style={tw`md:body-l`}>
          {t("contract.seller.refunded", { wallet: walletLabel })}
        </PeachText>
      </View>

      <View style={tw`h-10`}>
        {!!escrow && <EscrowButton style={tw`self-center`} escrow={escrow} />}
      </View>
    </Screen>
  );
}
