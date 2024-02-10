import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useNavigation } from "../../hooks/useNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const OfferPublished = ({
  shouldGoBack,
  offerId,
}: {
  shouldGoBack: boolean;
  offerId: string;
}) => {
  const navigation = useNavigation();
  const setOverlay = useSetOverlay();
  const closeOverlay = () => setOverlay(undefined);
  const goBackHome = () => {
    navigation.navigate("homeScreen", { screen: "home" });
    closeOverlay();
  };
  const goToOffer = () => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.sell" } },
        },
        { name: "search", params: { offerId } },
      ],
    });
    closeOverlay();
  };

  return (
    <OverlayComponent
      title={i18n("offer.published.title")}
      text={i18n("offer.published.description")}
      iconId="checkCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw`text-primary-main`}
            onPress={goToOffer}
          >
            {i18n("showOffer")}
          </Button>
          <Button ghost onPress={shouldGoBack ? closeOverlay : goBackHome}>
            {i18n("close")}
          </Button>
        </>
      }
    />
  );
};
