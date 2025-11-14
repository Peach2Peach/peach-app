import { useCallback } from "react";
import { ViewStyle } from "react-native";
import { IconType } from "../../assets/icons";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { SettingsItem } from "./components/SettingsItem";

export const PinCodeSetup = () => {
  const navigation = useStackNavigation();

  const modifyItems: {
    title: string;
    onPress: () => void;
    icon?: IconType;
    iconSize?: ViewStyle;
  }[] = [
    {
      title: "changePin",
      onPress: useCallback(
        () => navigation.navigate("changePin"),
        [navigation],
      ),
    },
    {
      title: "deletePin",
      onPress: useCallback(
        () => navigation.navigate("deletePin"),
        [navigation],
      ),
    },
  ];

  return (
    <Screen header={i18n("settings.aboutPeach")}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center flex-1`}
        contentStyle={tw`gap-6 py-3 px-6px`}
      >
        {modifyItems.map((item) => (
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
