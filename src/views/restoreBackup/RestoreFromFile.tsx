import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { FileInput } from "../../components/inputs/FileInput";
import { PasswordInput } from "../../components/inputs/PasswordInput";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { RestoreBackupError } from "./RestoreBackupError";
import { RestoreBackupLoading } from "./RestoreBackupLoading";
import { RestoreSuccess } from "./RestoreSuccess";
import { useRestoreFromFileSetup } from "./hooks/useRestoreFromFileSetup";
import { useTranslate } from "@tolgee/react";

export const RestoreFromFile = () => {
  const { t } = useTranslate("unassigned");
  const {
    restored,
    error,
    loading,
    file,
    setFile,
    password,
    setPassword,
    passwordError,
    submit,
  } = useRestoreFromFileSetup();

  if (loading) return <RestoreBackupLoading />;
  if (error) return <RestoreBackupError err={error} />;
  if (restored) return <RestoreSuccess />;

  return (
    <View style={tw`justify-between shrink`}>
      <View style={tw`justify-center h-full shrink`}>
        <PeachText
          style={tw`pb-2 text-center subtitle-1 text-primary-background-light`}
        >
          {t("restoreBackup.manual.description.1")}
        </PeachText>
        <View style={tw`w-full px-2`}>
          <FileInput fileName={file.name} onChange={setFile} />
        </View>
        <View style={tw`px-2`}>
          <PasswordInput
            theme="inverted"
            onChangeText={setPassword}
            onSubmitEditing={(e) => {
              setPassword(e.nativeEvent.text);
              if (file.name) submit();
            }}
            placeholder={t("restoreBackup.decrypt.password")}
            value={password}
            errorMessage={passwordError}
          />
        </View>
      </View>

      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw.color("primary-main")}
        disabled={!file.content || !password}
        iconId="save"
        onPress={submit}
      >
        {t("restoreBackup")}
      </Button>
    </View>
  );
};
