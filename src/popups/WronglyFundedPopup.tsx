import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { PeachText } from "../components/text/PeachText";
import { useConfigStore } from "../store/configStore/configStore";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { sum } from "../utils/math/sum";
import { thousands } from "../utils/string/thousands";
import { WarningPopup } from "./WarningPopup";
import { useCancelAndStartRefundPopup } from "./useCancelAndStartRefundPopup";

export function WronglyFundedPopup({ sellOffer }: { sellOffer: SellOffer }) {
  const maxTradingAmount = useConfigStore((state) => state.maxTradingAmount);
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup();

  const utxos = sellOffer.funding.txIds.length;
  const title = i18n(
    utxos === 1
      ? "warning.wrongFundingAmount.title"
      : "warning.incorrectFunding.title",
  );
  const content =
    utxos === 1 ? (
      <View style={tw`gap-4`}>
        <PeachText>
          {i18n("warning.fundingAmountDifferent.description.1")}
        </PeachText>
        <BTCAmount
          amount={sellOffer.funding.amounts.reduce(sum, 0)}
          size="medium"
        />
        <PeachText>
          {i18n("warning.fundingAmountDifferent.description.2")}
        </PeachText>
        <BTCAmount amount={sellOffer.amount} size="medium" />
        <PeachText>
          {i18n(
            "warning.wrongFundingAmount.description",
            thousands(maxTradingAmount),
          )}
        </PeachText>
      </View>
    ) : (
      i18n("warning.incorrectFunding.description", String(utxos))
    );

  return (
    <WarningPopup
      title={title}
      content={content}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <PopupAction
            label={i18n("refundEscrow")}
            iconId="arrowRightCircle"
            textStyle={tw`text-black-100`}
            onPress={() => {
              cancelAndStartRefundPopup(sellOffer);
            }}
            reverseOrder
          />
        </>
      }
    />
  );
}
