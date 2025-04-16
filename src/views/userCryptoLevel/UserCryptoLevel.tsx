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

const possibleCryptoLevels = [
  "firstTime",
  "firstTimeP2P",
  "bitcoiner",
] as const;

export function UserCryptoLevel() {
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  const [selectedCryptoLevel, setSelectedCryptoLevel] =
    useState<(typeof possibleCryptoLevels)[number]>();
  const { mutate: submitUserCryptoLevel } = useSubmitUserCryptoLevel();
  const submitCryptoLevel = (
    cryptoLevel: (typeof possibleCryptoLevels)[number],
  ) => {
    if (selectedCryptoLevel) return;
    setSelectedCryptoLevel(cryptoLevel);
    submitUserCryptoLevel(
      { cryptoLevel },
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
          <PeachText style={tw`text-center h4 text-primary-background-light`}>
            {i18n("userSource.title")}
          </PeachText>
          <PeachText
            style={tw`text-center text-primary-background-light body-l`}
          >
            {i18n("userCryptoLevel.subtitle")}
          </PeachText>
        </View>
        <View style={tw`items-stretch gap-10px`}>
          {possibleCryptoLevels.map((cryptoLevelOption) => (
            <Button
              key={cryptoLevelOption}
              ghost={selectedCryptoLevel !== cryptoLevelOption}
              style={
                cryptoLevelOption === selectedCryptoLevel &&
                tw`bg-primary-background-light`
              }
              textColor={
                cryptoLevelOption === selectedCryptoLevel
                  ? tw.color("primary-main")
                  : undefined
              }
              onPress={() => submitCryptoLevel(cryptoLevelOption)}
            >
              {i18n("userCryptoLevel.answer." + cryptoLevelOption)}
            </Button>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function useSubmitUserCryptoLevel() {
  return useMutation({
    mutationFn: peachAPI.private.user.submitUserCryptoLevel,
  });
}
