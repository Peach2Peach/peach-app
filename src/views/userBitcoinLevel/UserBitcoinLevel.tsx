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

const possibleBitcoinLevels = [
  "firstTime",
  "firstTimeP2P",
  "bitcoiner",
] as const;

export function UserBitcoinLevel() {
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  const [selectedBitcoinLevel, setSelectedBitcoinLevel] =
    useState<(typeof possibleBitcoinLevels)[number]>();
  const { mutate: submitUserBitcoinLevel } = useSubmitUserBitcoinLevel();
  const submitBitcoinLevel = (
    bitcoinLevel: (typeof possibleBitcoinLevels)[number],
  ) => {
    if (selectedBitcoinLevel) return;
    setSelectedBitcoinLevel(bitcoinLevel);
    submitUserBitcoinLevel(
      { bitcoinLevel },
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
            {i18n("userBitcoinLevel.subtitle")}
          </PeachText>
        </View>
        <View style={tw`items-stretch gap-10px`}>
          {possibleBitcoinLevels.map((bitcoinLevelOption) => (
            <Button
              key={bitcoinLevelOption}
              ghost={selectedBitcoinLevel !== bitcoinLevelOption}
              style={
                bitcoinLevelOption === selectedBitcoinLevel &&
                tw`bg-primary-background-light`
              }
              textColor={
                bitcoinLevelOption === selectedBitcoinLevel
                  ? tw.color("primary-main")
                  : undefined
              }
              onPress={() => submitBitcoinLevel(bitcoinLevelOption)}
            >
              {i18n("userBitcoinLevel.answer." + bitcoinLevelOption)}
            </Button>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function useSubmitUserBitcoinLevel() {
  return useMutation({
    mutationFn: peachAPI.private.user.submitUserBitcoinLevel,
  });
}
