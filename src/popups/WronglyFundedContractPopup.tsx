import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { WarningPopup } from "./WarningPopup";

export function WronglyFundedContractPopup({
  contractId,
}: {
  contractId: string;
}) {
  const navigation = useStackNavigation();
  const navigateToContractPage = () => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.buy" } },
        },
        { name: "contract", params: { contractId: contractId } },
      ],
    });
  };
  const title = i18n("warning.incorrectFundingContract.title");
  const content = i18n("warning.incorrectFundingContract.description");

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
              navigateToContractPage();
            }}
            reverseOrder
          />
        </>
      }
    />
  );
}
