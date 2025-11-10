import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
} from "@dr.pogodin/react-native-fs";
import { NETWORK } from "@env";
import { useMemo, useRef, useState } from "react";
import { Keyboard, Platform, TextInput, View } from "react-native";
import Share from "react-native-share";
import { useSetGlobalOverlay } from "../../../../Overlay";
import { PeachScrollView } from "../../../../components/PeachScrollView";
import { Button } from "../../../../components/buttons/Button";
import { PasswordInput } from "../../../../components/inputs/PasswordInput";
import { PeachText } from "../../../../components/text/PeachText";
import { useValidatedState } from "../../../../hooks/useValidatedState";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../../../styles/tailwind";
import { PEACH_ID_LENGTH } from "../../../../utils/account/PEACH_ID_LENGTH";
import { useAccountStore } from "../../../../utils/account/account";
import { writeFile } from "../../../../utils/file/writeFile";
import i18n from "../../../../utils/i18n";
import { error } from "../../../../utils/log/error";
import { info } from "../../../../utils/log/info";
import { parseError } from "../../../../utils/parseError";
import { BackupCreated } from "./BackupCreated";

type Props = {
  toggle: () => void;
};

const passwordRules = { required: true, password: true };

export const BackupPasswordPrompt = ({ toggle }: Props) => {
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

  const setOverlay = useSetGlobalOverlay();

  const startAccountBackup = async () => {
    if (isBackingUp || !validate()) return;

    Keyboard.dismiss();

    setIsBackingUp(true);
    info("Backing up account");
    const account = useAccountStore.getState().account;
    const currentTimestamp = Date.now().toString();
    try {
      const destinationFileName =
        NETWORK === "bitcoin"
          ? `peach-account-${account.publicKey.substring(0, PEACH_ID_LENGTH)}-${currentTimestamp}.json`
          : `peach-account-${NETWORK}-${account.publicKey.substring(0, PEACH_ID_LENGTH)}-${currentTimestamp}.json`;

      await writeFile(
        `/${destinationFileName}`,
        JSON.stringify({
          ...account,
          paymentData: Object.values(
            usePaymentDataStore.getState().paymentData,
          ),
          settings: useSettingsStore.getState().getPureState(),
          offers: [],
          chats: {},
        }),
        password,
      );

      const filePath =
        Platform.OS === "android"
          ? `${CachesDirectoryPath}/${destinationFileName}`
          : `${DocumentDirectoryPath}/${destinationFileName}`;

      Share.open({
        title: destinationFileName,
        url: `file://${filePath}`,
        subject: destinationFileName,
      })
        .then(({ message, success, dismissedAction }) => {
          info("Backed up account", message, success);
          if (dismissedAction) {
            info("User dismissed share dialog");
            setIsBackingUp(false);
          } else if (success) {
            info("Shared successfully", message);
            updateFileBackupDate();
            setIsBackingUp(false);
            toggle();
            setOverlay(<BackupCreated />);
          } else {
            error(message);
            setIsBackingUp(false);
          }
        })
        .catch((e) => {
          if (parseError(e) === "User did not share") {
            info("User dismissed share dialog");
            setIsBackingUp(false);
          } else {
            error(e);
            setIsBackingUp(false);
          }
        });
    } catch (e) {
      error(e);
      setIsBackingUp(false);
    }
  };

  let $passwordRepeat = useRef<TextInput>(null).current;
  const focusToPasswordRepeat = () => $passwordRepeat?.focus();

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`grow`}>
        <View style={tw`justify-center h-full`}>
          <PeachText style={tw`self-center mb-4 tooltip`}>
            {i18n("settings.backups.createASecurePassword")}
          </PeachText>
          <PasswordInput
            placeholder={i18n("form.password.placeholder")}
            onChangeText={setPassword}
            onSubmitEditing={focusToPasswordRepeat}
            value={password}
            errorMessage={passwordError}
            style={passwordIsValid && tw`border-black-65`}
            iconColor={tw.color("black-65")}
          />
          <PasswordInput
            placeholder={i18n("form.repeatpassword.placeholder")}
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
        {i18n("settings.backups.fileBackup.createNew")}
      </Button>
    </>
  );
};
