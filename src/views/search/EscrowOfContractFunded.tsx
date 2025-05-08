import { useSetGlobalOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const EscrowOfContractFunded = ({
  shouldGoBack,
  contractId,
}: {
  shouldGoBack: boolean;
  contractId: string;
}) => {
  const navigation = useStackNavigation();
  const setOverlay = useSetGlobalOverlay();
  const closeOverlay = () => setOverlay(undefined);
  const goBackHome = () => {
    navigation.navigate("homeScreen", { screen: "home" });
    closeOverlay();
  };
  const goToContract = () => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.sell" } },
        },
        { name: "contract", params: { contractId } },
      ],
    });
    closeOverlay();
  };

  return (
    <OverlayComponent
      title={i18n("contract.escrowFunded.title")}
      text={i18n("contract.escrowFunded.description")}
      iconId="checkCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToContract}
          >
            {i18n("showContract")}
          </Button>
          <Button ghost onPress={shouldGoBack ? closeOverlay : goBackHome}>
            {i18n("close")}
          </Button>
        </>
      }
    />
  );
};
