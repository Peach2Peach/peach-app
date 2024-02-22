import { useTranslate } from "@tolgee/react";
import { useRef, useState } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Header, HeaderIcon } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { PeachText } from "../../components/text/PeachText";
import { Progress } from "../../components/ui/Progress";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useLanguage } from "../../hooks/useLanguage";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { AWalletYouControl } from "./AWalletYouControl";
import { LetsGetStarted } from "./LetsGetStarted";
import { PeachOfMind } from "./PeachOfMind";
import { PeerToPeer } from "./PeerToPeer";
import { PrivacyFirst } from "./PrivacyFirst";

export const screens = [
  PeerToPeer,
  PeachOfMind,
  PrivacyFirst,
  AWalletYouControl,
  LetsGetStarted,
];

export const Welcome = () => {
  const { width } = useWindowDimensions();
  const $carousel = useRef<ICarouselInstance>(null);
  const [page, setPage] = useState(0);
  const { t } = useTranslate();

  const next = () => {
    $carousel.current?.next();
    setPage((p) => p + 1);
  };
  const goToEnd = () => {
    $carousel.current?.next({ count: screens.length - 1 - page });
    setPage(screens.length - 1);
  };
  const progress = (page + 1) / screens.length;
  const endReached = progress === 1;
  const keyboardOpen = useKeyboard();

  return (
    <Screen header={<OnboardingHeader />} gradientBackground>
      <Progress
        percent={progress}
        backgroundStyle={tw`opacity-50 bg-primary-background-light`}
        barStyle={tw`bg-primary-background-light`}
        style={tw`h-2`}
      />
      <TouchableOpacity
        onPress={goToEnd}
        style={[
          tw`flex-row items-center self-end h-8 gap-1`,
          endReached && tw`opacity-0`,
        ]}
      >
        <PeachText style={tw`text-primary-background-light`}>
          {t("skip", { ns: "global" })}
        </PeachText>
        <Icon
          id="skipForward"
          size={12}
          color={tw.color("primary-background-light")}
        />
      </TouchableOpacity>
      <View style={tw`items-center h-full shrink`}>
        <Carousel
          ref={$carousel}
          data={screens}
          snapEnabled={true}
          loop={false}
          width={width}
          onSnapToItem={setPage}
          renderItem={({ item: Item }) => (
            <View
              onStartShouldSetResponder={() => !keyboardOpen}
              style={tw`h-full px-6`}
            >
              <Item />
            </View>
          )}
        />
      </View>
      {!keyboardOpen && (
        <Button
          style={[
            tw`self-center bg-primary-background-light`,
            page === screens.length - 1 && tw`opacity-0`,
          ]}
          textColor={tw.color("primary-main")}
          onPress={next}
          iconId="arrowRightCircle"
        >
          {t("next")}
        </Button>
      )}
    </Screen>
  );
};

function OnboardingHeader() {
  const navigation = useStackNavigation();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);
  const { locale, updateLocale } = useLanguage();
  const { t } = useTranslate("global");

  const openLanguageDrawer = () => {
    updateDrawer({
      title: t("language.select"),
      options: i18n.getLocales().map((l) => ({
        // @ts-ignore
        title: t(`languageName.${l}`),
        onPress: () => {
          updateLocale(l);
          updateDrawer({ show: false });
        },
        iconRightID: l === locale ? "check" : undefined,
      })),
      show: true,
    });
  };
  const headerIcons: HeaderIcon[] = [
    {
      id: "mail",
      color: tw.color("primary-background-light"),
      onPress: () => navigation.navigate("contact"),
    },
    {
      id: "globe",
      color: tw.color("primary-background-light"),
      onPress: openLanguageDrawer,
    },
  ];
  return (
    <Header
      title={t("welcome.welcomeToPeach.title", { ns: "welcome" })}
      icons={headerIcons}
      theme="transparent"
      hideGoBackButton
    />
  );
}
