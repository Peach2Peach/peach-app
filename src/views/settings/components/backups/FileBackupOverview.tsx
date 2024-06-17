import { View } from "react-native";
import { Button } from "../../../../components/buttons/Button";
import { PeachText } from "../../../../components/text/PeachText";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import tw from "../../../../styles/tailwind";
import { toShortDateFormat } from "../../../../utils/date/toShortDateFormat";
import { useTranslate } from "@tolgee/react";

type Props = { next: () => void };

export const FileBackupOverview = ({ next }: Props) => {
  const { t } = useTranslate("settings");
  const lastFileBackupDate = useSettingsStore(
    (state) => state.lastFileBackupDate,
  );
  return (
    <View style={tw`items-center h-full`}>
      <PeachText style={tw`subtitle-1`}>
        {t("settings.backups.fileBackup.toRestore")}
      </PeachText>
      <View style={tw`items-center justify-center h-full shrink`}>
        {!!lastFileBackupDate && (
          <>
            <PeachText style={tw`h6`}>
              {t("settings.backups.fileBackup.lastBackup")}
            </PeachText>
            <PeachText style={tw`mt-2 mb-8`}>
              {toShortDateFormat(new Date(lastFileBackupDate), true)}
            </PeachText>
          </>
        )}
        <Button onPress={next} iconId="save">
          {t("settings.backups.fileBackup.createNew")}
        </Button>
      </View>
    </View>
  );
};
