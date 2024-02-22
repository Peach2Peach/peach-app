import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const OfferPublished = ({
  shouldGoBack,
  offerId,
}: {
  shouldGoBack: boolean;
  offerId: string;
}) => {
  const navigation = useStackNavigation();
  const setOverlay = useSetOverlay();
  const closeOverlay = () => setOverlay(undefined);
  const goBackHome = () => {
    navigation.navigate("homeScreen", { screen: "home" });
    closeOverlay();
  };
  const { t } = useTranslate();
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
      title={t("offer.published.title", { ns: "offer" })}
      text={t("offer.published.description", { ns: "offer" })}
      iconId="checkCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToOffer}
          >
            {t({ key: "showOffer" })}
          </Button>
          <Button ghost onPress={shouldGoBack ? closeOverlay : goBackHome}>
            {t({ key: "close" })}
          </Button>
        </>
      }
    />
  );
};
