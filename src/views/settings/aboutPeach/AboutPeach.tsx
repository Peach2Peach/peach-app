import { useCallback } from "react";
import { ViewStyle } from "react-native";
import { IconType } from "../../../assets/icons";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { useNavigation } from "../../../hooks/useNavigation";
import tw from "../../../styles/tailwind";
import i18n, { languageState } from "../../../utils/i18n";
import { getLocalizedLink } from "../../../utils/web/getLocalizedLink";
import { openURL } from "../../../utils/web/openURL";
import { SettingsItem } from "../components/SettingsItem";

export const AboutPeach = () => {
  const navigation = useNavigation();

  const items: {
    title: string;
    onPress: () => void;
    icon?: IconType;
    iconSize?: ViewStyle;
  }[] = [
    {
      title: "peachFees",
      onPress: useCallback(
        () => navigation.navigate("peachFees"),
        [navigation],
      ),
    },
    {
      title: "socials",
      onPress: useCallback(() => navigation.navigate("socials"), [navigation]),
    },
    {
      title: "bitcoinProducts",
      onPress: useCallback(
        () => navigation.navigate("bitcoinProducts"),
        [navigation],
      ),
    },
    {
      title: "website",
      onPress: () => openURL(getLocalizedLink("", languageState.locale)),
      icon: "externalLink",
      iconSize: tw`w-6 h-6`,
    },
    {
      title: "privacyPolicy",
      onPress: () =>
        openURL(getLocalizedLink("privacy-policy", languageState.locale)),
      icon: "externalLink",
      iconSize: tw`w-6 h-6`,
    },
    {
      title: "terms",
      onPress: () =>
        openURL(getLocalizedLink("terms-and-conditions", languageState.locale)),
      icon: "externalLink",
      iconSize: tw`w-6 h-6`,
    },
  ];

  return (
    <Screen header={i18n("settings.aboutPeach")}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center flex-1`}
        contentStyle={tw`gap-6 py-3 px-6px`}
      >
        {items.map((item) => (
          <SettingsItem
            key={item.title}
            title={item.title}
            onPress={item.onPress}
            iconId={item.icon}
            iconSize={item.iconSize}
          />
        ))}
      </PeachScrollView>
    </Screen>
  );
};
