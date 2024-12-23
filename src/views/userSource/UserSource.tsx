import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { MSINASECOND } from "../../constants";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";

const possibleSources = [
  "twitter",
  "google",
  "instagram",
  "friend",
  "telegram",
  "linkedin",
  "other",
] as const;

export function UserSource() {
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  const [selectedSource, setSelectedSource] =
    useState<(typeof possibleSources)[number]>();
  const { mutate: submitUserSource } = useSubmitUserSource();
  const submitSource = (source: (typeof possibleSources)[number]) => {
    if (selectedSource) return;
    setSelectedSource(source);
    submitUserSource(
      { source },
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsLoggedIn(true);
          }, MSINASECOND);
        },
      },
    );
  };

  return (
    <Screen gradientBackground>
      <View style={tw`items-center justify-center flex-1 gap-8`}>
        <View style={tw`items-center gap-2px`}>
          <PeachText
            style={tw`text-center h4 text-primary-background-light-color`}
          >
            {i18n("userSource.title")}
          </PeachText>
          <PeachText
            style={tw`text-center text-primary-background-light-color body-l`}
          >
            {i18n("userSource.subtitle")}
          </PeachText>
        </View>
        <View style={tw`items-stretch gap-10px`}>
          {possibleSources.map((source) => (
            <Button
              key={source}
              ghost={selectedSource !== source}
              style={
                source === selectedSource &&
                tw`bg-primary-background-light-color`
              }
              textColor={
                source === selectedSource ? tw.color("primary-main") : undefined
              }
              onPress={() => submitSource(source)}
            >
              {i18n(source)}
            </Button>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function useSubmitUserSource() {
  return useMutation({
    mutationFn: peachAPI.private.user.submitUserSource,
  });
}
