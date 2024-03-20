import { View } from "react-native";

import { Button } from "../../../../components/buttons/Button";
import { PeachText } from "../../../../components/text/PeachText";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import tw from "../../../../styles/tailwind";
import { toShortDateFormat } from "../../../../utils/date/toShortDateFormat";
import { useTranslate } from "@tolgee/react";

type Props = { goBackToStart: () => void };

export const LastSeedBackup = ({ goBackToStart }: Props) => {
  const { t } = useTranslate("settings");
  const lastSeedBackupDate = useSettingsStore(
    (state) => state.lastSeedBackupDate,
  );
  return (
    <View style={tw`items-center gap-10`}>
      <View style={tw`items-center gap-2`}>
        <PeachText style={tw`h6`}>
          {t("settings.backups.seedPhrase.lastBackup")}
        </PeachText>
        {!!lastSeedBackupDate && (
          <PeachText>
            {toShortDateFormat(new Date(lastSeedBackupDate), true)}
          </PeachText>
        )}
      </View>
      <Button onPress={goBackToStart} iconId="rotateCounterClockwise">
        {t("settings.backups.seedPhrase.checkWords")}
      </Button>
    </View>
  );
};
