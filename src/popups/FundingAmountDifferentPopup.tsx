import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PeachText } from "../components/text/PeachText";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import { sum } from "../utils/math/sum";
import { thousands } from "../utils/string/thousands";
import { WarningPopup } from "./WarningPopup";
import { useTranslate } from "@tolgee/react";

export function FundingAmountDifferentPopup({
  sellOffer,
}: {
  sellOffer: SellOffer;
}) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();

  const actualAmount = sellOffer.funding.amounts.reduce(sum, 0);
  const { t } = useTranslate("unassigned");
  return (
    <WarningPopup
      title={t("warning.fundingAmountDifferent.title")}
      content={
        <View style={tw`gap-4`}>
          <PeachText>
            {t("warning.fundingAmountDifferent.description.1")}
          </PeachText>
          <BTCAmount amount={actualAmount} size="medium" />
          <PeachText>
            {t("warning.fundingAmountDifferent.description.2")}
          </PeachText>
          <BTCAmount amount={sellOffer.amount} size="medium" />
          <PeachText>
            {t(
              "warning.fundingAmountDifferent.description.3",
              thousands(actualAmount),
            )}
          </PeachText>
        </View>
      }
      actions={
        <PopupAction
          style={tw`justify-center`}
          label={t({ key: "goToTrade", ns: "global" })}
          iconId="arrowRightCircle"
          textStyle={tw`text-black-100`}
          reverseOrder
          onPress={() => {
            closePopup();
            navigation.navigate("wrongFundingAmount", {
              offerId: sellOffer.id,
            });
          }}
        />
      }
    />
  );
}
