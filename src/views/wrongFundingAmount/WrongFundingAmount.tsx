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
import { sum } from "../../utils/math/sum";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { thousands } from "../../utils/string/thousands";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useConfirmEscrow } from "./hooks/useConfirmEscrow";
import { useTranslate } from "@tolgee/react";

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
  const { t } = useTranslate("unassigned");

  const actualAmount = sellOffer.funding.amounts.reduce(sum, 0);
  const fundingAmount = sellOffer.amount;
  return (
    <View style={tw`gap-3 grow`}>
      <Divider
        icon={<Icon id="download" size={20} />}
        text={t("offer.requiredAction.fundingAmountDifferent")}
      />
      <View style={tw`gap-1`}>
        <LabelAndAmount label={t("escrow.funded")} amount={actualAmount} />
        <LabelAndAmount
          label={t("amount", { ns: "global" })}
          amount={fundingAmount}
        />
      </View>
      <PeachText style={tw`body-s`}>
        {t("escrow.wrongFundingAmount.description", {
          actual: thousands(actualAmount),
          expected: thousands(fundingAmount),
        })}
      </PeachText>
      <PeachText style={tw`body-s`}>
        {t(
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
  const { t } = useTranslate("unassigned");

  return (
    <ConfirmSlider
      enabled={!!sellOffer}
      onConfirm={refundEscrow}
      label1={t("refundEscrow")}
      iconId="download"
    />
  );
}

function ContinueTradeSlider({ sellOffer }: Props) {
  const { mutate: confirmEscrow } = useConfirmEscrow();
  const { t } = useTranslate("unassigned");
  const confirmEscrowWithSellOffer = () =>
    confirmEscrow({ offerId: sellOffer.id, funding: sellOffer.funding });

  return (
    <ConfirmSlider
      enabled={!!sellOffer}
      onConfirm={confirmEscrowWithSellOffer}
      label1={t("continueTrade")}
      iconId="arrowRightCircle"
    />
  );
}
