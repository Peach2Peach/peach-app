import { useSetOverlay } from "../../Overlay";
import { IconType } from "../../assets/icons";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { badgeIconMap } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const NewBadge = ({ badges }: { badges: Medal[] }) => {
  const navigation = useStackNavigation();
  const setOverlay = useSetOverlay();
  const badge = badges[0];
  const icon = `${badgeIconMap[badge]}CircleInverted` as IconType;
  const remainingBadges = badges.slice(1, badges.length);
  const { t } = useTranslate("notification");

  const close = () =>
    setOverlay(
      remainingBadges.length > 0 ? (
        <NewBadge badges={remainingBadges} />
      ) : undefined,
    );

  const goToProfile = () => {
    navigation.navigate("myProfile");
    setOverlay(undefined);
  };

  return (
    <OverlayComponent
      title={t("notification.user.badge.unlocked.title")}
      text={t("notification.user.badge.unlocked.text", {
        badge: t(`peachBadges.${badge}`),
      })}
      iconId={icon}
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToProfile}
          >
            {t("goToProfile", { ns: "global" })}
          </Button>
          <Button onPress={close} ghost>
            {t("close", { ns: "global" })}
          </Button>
        </>
      }
    />
  );
};
