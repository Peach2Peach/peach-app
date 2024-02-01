import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { useClosePopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import { PeachText } from "../components/text/PeachText";
import { useNavigation } from "../hooks/useNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { sum } from "../utils/math/sum";
import { thousands } from "../utils/string/thousands";
import { WarningPopup } from "./WarningPopup";

export function FundingAmountDifferentPopup({
  sellOffer,
}: {
  sellOffer: SellOffer;
}) {
  const navigation = useNavigation();
  const closePopup = useClosePopup();

  const actualAmount = sellOffer.funding.amounts.reduce(sum, 0);
  return (
    <WarningPopup
      title={i18n("warning.fundingAmountDifferent.title")}
      content={
        <View style={tw`gap-4`}>
          <PeachText>
            {i18n("warning.fundingAmountDifferent.description.1")}
          </PeachText>
          <BTCAmount amount={actualAmount} size="medium" />
          <PeachText>
            {i18n("warning.fundingAmountDifferent.description.2")}
          </PeachText>
          <BTCAmount amount={sellOffer.amount} size="medium" />
          <PeachText>
            {i18n(
              "warning.fundingAmountDifferent.description.3",
              thousands(actualAmount),
            )}
          </PeachText>
        </View>
      }
      actions={
        <PopupAction
          style={tw`justify-center`}
          label={i18n("goToTrade")}
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
