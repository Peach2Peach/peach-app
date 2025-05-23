import { View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { NUMBER_OF_WORDS } from "../settings/components/backups/NUMBER_OF_WORDS";
import { RestoreBackupError } from "./RestoreBackupError";
import { RestoreBackupLoading } from "./RestoreBackupLoading";
import { RestoreSuccess } from "./RestoreSuccess";
import { SeedPhraseInput } from "./SeedPhraseInput";
import { useRestoreFromSeedSetup } from "./hooks/useRestoreFromSeedSetup";

export const RestoreFromSeed = () => {
  const {
    restored,
    error,
    loading,
    setWords,
    allWordsAreSet,
    isMnemonicValid,
    submit,
  } = useRestoreFromSeedSetup();

  if (loading) return <RestoreBackupLoading />;
  if (error) return <RestoreBackupError err={error} />;
  if (restored) return <RestoreSuccess />;
  return (
    <View style={tw`flex-1 gap-4`}>
      <PeachScrollView
        contentContainerStyle={tw`py-4`}
        contentStyle={tw`gap-4`}
      >
        <PeachText style={tw`text-center text-primary-background-light-color`}>
          {i18n("restoreBackup.seedPhrase.useBackupFile")}
        </PeachText>
        <PeachText
          style={tw`text-center subtitle-1 text-primary-background-light-color`}
        >
          {i18n("restoreBackup.seedPhrase.enter")}
        </PeachText>
        <View style={tw`flex-row gap-4`}>
          <View style={tw`flex-1`}>
            {Array(NUMBER_OF_WORDS / 2)
              .fill(0)
              .map((e, index) => (
                <SeedPhraseInput
                  key={`seedPhraseInput-${index}`}
                  {...{ index, setWords }}
                />
              ))}
          </View>
          <View style={tw`flex-1`}>
            {Array(NUMBER_OF_WORDS / 2)
              .fill(0)
              .map((e, index) => (
                <SeedPhraseInput
                  key={`seedPhraseInput-${index + NUMBER_OF_WORDS / 2}`}
                  index={index + NUMBER_OF_WORDS / 2}
                  setWords={setWords}
                />
              ))}
          </View>
        </View>
        {allWordsAreSet && !isMnemonicValid && (
          <PeachText
            style={[
              tw`text-center tooltip text-primary-background-light-color`,
            ]}
          >
            {i18n("form.bip39.error")}
          </PeachText>
        )}
      </PeachScrollView>
      <Button
        style={tw`self-center bg-primary-background-light-color`}
        textColor={tw.color("primary-main")}
        disabled={!isMnemonicValid}
        iconId="save"
        onPress={submit}
      >
        {i18n("restoreBackup")}
      </Button>
    </View>
  );
};
