import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { PeachText } from "../components/text/PeachText";
import { useConfigStore } from "../store/configStore/configStore";
import tw from "../styles/tailwind";
import { sum } from "../utils/math/sum";
import { thousands } from "../utils/string/thousands";
import { WarningPopup } from "./WarningPopup";
import { useCancelAndStartRefundPopup } from "./useCancelAndStartRefundPopup";
import { useTranslate } from "@tolgee/react";

export function WronglyFundedPopup({ sellOffer }: { sellOffer: SellOffer }) {
  const maxTradingAmount = useConfigStore((state) => state.maxTradingAmount);
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup();

  const utxos = sellOffer.funding.txIds.length;
  const { t } = useTranslate();
  const title = t(
    // @ts-ignore
    utxos === 1
      ? "warning.wrongFundingAmount.title"
      : { key: "warning.incorrectFunding.title", ns: "sell" },
  );
  const content =
    utxos === 1 ? (
      <View style={tw`gap-4`}>
        <PeachText>
          {t("warning.fundingAmountDifferent.description.1")}
        </PeachText>
        <BTCAmount
          amount={sellOffer.funding.amounts.reduce(sum, 0)}
          size="medium"
        />
        <PeachText>
          {t("warning.fundingAmountDifferent.description.2")}
        </PeachText>
        <BTCAmount amount={sellOffer.amount} size="medium" />
        <PeachText>
          {t("warning.wrongFundingAmount.description", {
            amount: thousands(maxTradingAmount),
          })}
        </PeachText>
      </View>
    ) : (
      t("warning.incorrectFunding.description", {
        ns: "sell",
        utxos: String(utxos),
      })
    );

  return (
    <WarningPopup
      title={title}
      content={content}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <PopupAction
            label={t("refundEscrow")}
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
