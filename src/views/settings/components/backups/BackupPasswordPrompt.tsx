import { useMemo, useRef, useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { useSetOverlay } from "../../../../Overlay";
import { PeachScrollView } from "../../../../components/PeachScrollView";
import { Button } from "../../../../components/buttons/Button";
import { PasswordInput } from "../../../../components/inputs/PasswordInput";
import { PeachText } from "../../../../components/text/PeachText";
import { useValidatedState } from "../../../../hooks/useValidatedState";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import tw from "../../../../styles/tailwind";
import { backupAccount } from "../../../../utils/account/backupAccount";
import { BackupCreated } from "./BackupCreated";
import { useTranslate } from "@tolgee/react";

type Props = {
  toggle: () => void;
};

const passwordRules = { required: true, password: true };

export const BackupPasswordPrompt = ({ toggle }: Props) => {
  const { t } = useTranslate("settings");
  const updateFileBackupDate = useSettingsStore(
    (state) => state.updateFileBackupDate,
  );

  const [password, setPassword, passwordIsValid, passwordError] =
    useValidatedState<string>("", passwordRules);
  const [
    passwordRepeat,
    setPasswordRepeat,
    passwordRepeatIsValid,
    passwordRepeatError,
  ] = useValidatedState<string>("", passwordRules);

  const [isBackingUp, setIsBackingUp] = useState(false);

  const passwordsMatch = useMemo(
    () => password === passwordRepeat,
    [password, passwordRepeat],
  );
  const validate = () =>
    !!password && !!passwordRepeat && passwordIsValid && passwordsMatch;

  const setOverlay = useSetOverlay();

  const startAccountBackup = () => {
    if (isBackingUp || !validate()) return;

    Keyboard.dismiss();

    setIsBackingUp(true);
    backupAccount({
      password,
      onSuccess: () => {
        updateFileBackupDate();
        setIsBackingUp(false);
        toggle();
        setOverlay(<BackupCreated />);
      },
      onCancel: () => {
        setIsBackingUp(false);
      },
      onError: () => {
        setIsBackingUp(false);
      },
    });
  };

  let $passwordRepeat = useRef<TextInput>(null).current;
  const focusToPasswordRepeat = () => $passwordRepeat?.focus();

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`grow`}>
        <View style={tw`justify-center h-full`}>
          <PeachText style={tw`self-center mb-4 tooltip`}>
            {t("settings.backups.createASecurePassword")}
          </PeachText>
          <PasswordInput
            placeholder={t("form.password.placeholder", { ns: "form" })}
            onChangeText={setPassword}
            onSubmitEditing={focusToPasswordRepeat}
            value={password}
            errorMessage={passwordError}
            style={passwordIsValid && tw`border-black-65`}
            iconColor={tw.color("black-65")}
          />
          <PasswordInput
            placeholder={t("form.repeatpassword.placeholder", { ns: "form" })}
            reference={(el) => ($passwordRepeat = el)}
            onChangeText={setPasswordRepeat}
            onSubmitEditing={(e) => setPasswordRepeat(e.nativeEvent.text)}
            value={passwordRepeat}
            errorMessage={passwordRepeatError}
            style={passwordRepeatIsValid && tw`border-black-65`}
            iconColor={tw.color("black-65")}
          />
        </View>
      </PeachScrollView>
      <Button
        disabled={!validate()}
        style={tw`self-center`}
        onPress={startAccountBackup}
        iconId="save"
      >
        {t("settings.backups.fileBackup.createNew")}
      </Button>
    </>
  );
};
