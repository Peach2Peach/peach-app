import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useNavigation } from "../../hooks/useNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const PaymentMade = ({ contractId }: { contractId: string }) => {
  const navigation = useNavigation();
  const setOverlay = useSetOverlay();

  const close = () => setOverlay(undefined);

  const goToTrade = () => {
    close();
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "yourTrades" } },
        { name: "contract", params: { contractId } },
      ],
    });
  };

  return (
    <OverlayComponent
      title={i18n("contract.paymentMade.title")}
      text={i18n("contract.paymentMade.description")}
      iconId="dollarSignCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw`text-primary-main`}
            onPress={goToTrade}
          >
            {i18n("goToTrade")}
          </Button>
          <Button onPress={close} ghost>
            {i18n("close")}
          </Button>
        </>
      }
    />
  );
};
