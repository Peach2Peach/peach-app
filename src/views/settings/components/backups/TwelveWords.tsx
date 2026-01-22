import { View } from "react-native";

import { Icon } from "../../../../components/Icon";
import { PeachText } from "../../../../components/text/PeachText";
import { useThemeStore } from "../../../../store/theme";
import tw from "../../../../styles/tailwind";
import { useAccountStore } from "../../../../utils/account/account";
import i18n from "../../../../utils/i18n";
import { NUMBER_OF_WORDS } from "./NUMBER_OF_WORDS";
import { Word } from "./Word";

export function WarningFrame({ text }: { text: string }) {
  const { isDarkMode } = useThemeStore();

  return (
    <View
      style={[
        tw`rounded-lg py-10px px-12px max-w-300px w-full items-center`,
        { backgroundColor: tw.color("error-light") },
      ]}
    >
      <View style={tw`flex-row items-center justify-center gap-8px ml-7`}>
        <View>
          <Icon size={30} id="alertTriangle" color={tw.color("white")} />
        </View>

        <PeachText
          style={[
            tw`${isDarkMode ? "text-primary-background-light-color" : "text-white"}`,
            { textAlign: "left" },
          ]}
        >
          {text}
        </PeachText>
      </View>
    </View>
  );
}

export const TwelveWords = () => {
  const mnemonic = useAccountStore((state) => state.account?.mnemonic);
  return (
    <>
      <View style={[tw`items-center justify-center grow`]}>
        <WarningFrame text={i18n("wallet.twelveWords.dontShare")} />
      </View>
      <PeachText style={tw`self-center subtitle-1`}>
        {i18n("settings.backups.seedPhrase.yourSeedPhrase")}
      </PeachText>
      <View style={tw`flex-row gap-4 mt-4`}>
        <View style={tw`flex-1`}>
          {mnemonic
            ?.split(" ")
            .slice(0, NUMBER_OF_WORDS / 2)
            .map((word, i) => (
              <Word word={word} index={i + 1} key={`seedPhraseWord${i}`} />
            ))}
        </View>
        <View style={tw`flex-1`}>
          {mnemonic
            ?.split(" ")
            .slice(NUMBER_OF_WORDS / 2, NUMBER_OF_WORDS)
            .map((word, i) => (
              <Word
                word={word}
                index={i + NUMBER_OF_WORDS / 2 + 1}
                key={`seedPhraseWord${i + NUMBER_OF_WORDS / 2 + 1}`}
              />
            ))}
        </View>
      </View>
    </>
  );
};
