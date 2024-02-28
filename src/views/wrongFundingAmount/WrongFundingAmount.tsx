import { View } from "react-native";
import { Divider } from "../../components/Divider";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { PeachText } from "../../components/text/PeachText";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useCancelAndStartRefundPopup } from "../../popups/useCancelAndStartRefundPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { sum } from "../../utils/math/sum";
import { getSellOfferFunding } from "../../utils/offer/getSellOfferFunding";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { thousands } from "../../utils/string/thousands";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useConfirmEscrow } from "./hooks/useConfirmEscrow";

export const WrongFundingAmount = () => {
  const { offerId } = useRoute<"wrongFundingAmount">().params;
  const { offer } = useOfferDetail(offerId);
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined;

  if (!sellOffer) return <LoadingScreen />;

  return (
    <Screen header={<Header title={offerIdToHex(offerId)} />}>
      <WrongFundingAmountSummary {...{ sellOffer }} />
      <View style={tw`items-center gap-3`}>
        <ContinueTradeSlider {...{ sellOffer }} />
        <RefundEscrowSlider {...{ sellOffer }} />
      </View>
    </Screen>
  );
};

type Props = {
  sellOffer: SellOffer;
};

function WrongFundingAmountSummary({ sellOffer }: Props) {
  const funding = getSellOfferFunding(sellOffer);
  const actualAmount = funding.amounts.reduce(sum, 0) || 0;
  const fundingAmount = sellOffer.amount || 0;
  return (
    <View style={tw`gap-3 grow`}>
      <Divider
        icon={<Icon id="download" size={20} />}
        text={i18n("offer.requiredAction.fundingAmountDifferent")}
      />
      <View style={tw`gap-1`}>
        <LabelAndAmount label={i18n("escrow.funded")} amount={actualAmount} />
        <LabelAndAmount label={i18n("amount")} amount={fundingAmount} />
      </View>
      <PeachText style={tw`body-s`}>
        {i18n(
          "escrow.wrongFundingAmount.description",
          thousands(actualAmount),
          thousands(fundingAmount),
        )}
      </PeachText>
      <PeachText style={tw`body-s`}>
        {i18n(
          "escrow.wrongFundingAmount.continueOrRefund",
          thousands(actualAmount),
        )}
      </PeachText>
    </View>
  );
}

type LabelAndAmountProps = {
  label: string;
  amount: number;
};

function LabelAndAmount({ label, amount }: LabelAndAmountProps) {
  return (
    <View style={tw`flex-row`}>
      <PeachText style={tw`w-20 text-black-50`}>{label}</PeachText>
      <BTCAmount amount={amount} size="small" />
    </View>
  );
}

function RefundEscrowSlider({ sellOffer }: Props) {
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup();
  const refundEscrow = () => cancelAndStartRefundPopup(sellOffer);

  return (
    <ConfirmSlider
      enabled={!!sellOffer}
      onConfirm={refundEscrow}
      label1={i18n("refundEscrow")}
      iconId="download"
    />
  );
}

function ContinueTradeSlider({ sellOffer }: Props) {
  const { mutate: confirmEscrow } = useConfirmEscrow();
  const confirmEscrowWithSellOffer = () =>
    confirmEscrow({
      offerId: sellOffer.id,
      funding: getSellOfferFunding(sellOffer),
    });

  return (
    <ConfirmSlider
      enabled={!!sellOffer}
      onConfirm={confirmEscrowWithSellOffer}
      label1={i18n("continueTrade")}
      iconId="arrowRightCircle"
    />
  );
}
