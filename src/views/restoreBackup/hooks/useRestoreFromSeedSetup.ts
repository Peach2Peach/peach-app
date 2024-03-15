import { useCallback, useMemo, useState } from "react";
import { Keyboard } from "react-native";
import { useSetToast } from "../../../components/toast/Toast";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { createAccount } from "../../../utils/account/createAccount";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import { storeAccount } from "../../../utils/account/storeAccount";
import { useRecoverAccount } from "../../../utils/account/useRecoverAccount";
import { createWalletFromSeedPhrase } from "../../../utils/wallet/createWalletFromSeedPhrase";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { LOGIN_DELAY } from "../../restoreReputation/LOGIN_DELAY";
import { NUMBER_OF_WORDS } from "../../settings/components/backups/NUMBER_OF_WORDS";
import { setupPeachAccount } from "./setupPeachAccount";

export const bip39WordRules = {
  required: true,
  bip39Word: true,
};
const bip39Rules = {
  required: true,
  bip39: true,
};

export const useRestoreFromSeedSetup = () => {
  const setToast = useSetToast();
  const updateSeedBackupDate = useSettingsStore(
    (state) => state.updateSeedBackupDate,
  );

  const [words, setWords] = useState<string[]>(
    new Array(NUMBER_OF_WORDS).fill(""),
  );
  const [mnemonic, setMnemonic, isMnemonicValid] = useValidatedState<string>(
    "",
    bip39Rules,
  );
  const allWordsAreSet = useMemo(() => {
    const allSet = words.every((word) => !!word);
    if (allSet) {
      setMnemonic(words.join(" "));
    }
    return allSet;
  }, [setMnemonic, words]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn);

  const onError = useCallback(
    (errorMsg = "UNKNOWN_ERROR") => {
      setError(errorMsg);
      if (errorMsg !== "REGISTRATION_DENIED") {
        setToast({ msgKey: errorMsg, color: "red" });
      }
      deleteAccount();
    },
    [setToast],
  );

  const recoverAccount = useRecoverAccount();

  const createAndRecover = async () => {
    const recoveredAccount = await createAccount(
      createWalletFromSeedPhrase(mnemonic, getNetwork()),
    );

    const authError = await setupPeachAccount(recoveredAccount);

    if (authError) {
      onError(authError);
      setLoading(false);
      return;
    }
    const updatedAccount = await recoverAccount(recoveredAccount);

    await storeAccount(updatedAccount);
    setRestored(true);
    setLoading(false);
    updateSeedBackupDate();

    setTimeout(() => {
      setIsLoggedIn(true);
    }, LOGIN_DELAY);
  };

  const submit = () => {
    Keyboard.dismiss();
    setLoading(true);

    if (!isMnemonicValid) return;

    // creation a new account is render blocking, to show loading, we call it within a timeout
    setTimeout(createAndRecover);
  };
  return {
    restored,
    error,
    loading,
    setWords,
    allWordsAreSet,
    isMnemonicValid,
    submit,
  };
};
