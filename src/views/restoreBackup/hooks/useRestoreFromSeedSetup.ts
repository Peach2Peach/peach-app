import { useCallback, useMemo, useState } from "react";
import { Keyboard } from "react-native";
import { useSetToast } from "../../../components/toast/Toast";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useUserUpdate } from "../../../init/useUserUpdate";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { createAccount } from "../../../utils/account/createAccount";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import { storeAccount } from "../../../utils/account/storeAccount";
import { updateAccount } from "../../../utils/account/updateAccount";
import { useRecoverAccount } from "../../../utils/account/useRecoverAccount";
import { createWalletFromSeedPhrase } from "../../../utils/wallet/createWalletFromSeedPhrase";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { useRegisterUser } from "../../newUser/useRegisterUser";
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
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);

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
  const { mutateAsync: registerUser } = useRegisterUser();
  const userUpdate = useUserUpdate();

  const finishLogin = async (
    recoveredAccount: Account & { mnemonic: string },
  ) => {
    const updatedAccount = await recoverAccount(recoveredAccount);

    await storeAccount(updatedAccount);
    setRestored(true);
    setLoading(false);
    updateSeedBackupDate();

    setTimeout(() => {
      setIsLoggedIn(true);
    }, LOGIN_DELAY);
  };

  const createAndRecover = async () => {
    const recoveredAccount = await createAccount(
      createWalletFromSeedPhrase(mnemonic, getNetwork()),
    );

    let authToken: { accessToken: string; expiry: number } | undefined;
    try {
      authToken = await setupPeachAccount(recoveredAccount);
    } catch (e) {
      onError(e instanceof Error ? e.message : "UNKNOWN_ERROR");
      setLoading(false);
      return;
    }

    if (!authToken) {
      try {
        await registerUser(recoveredAccount);
        await updateAccount(recoveredAccount, true);
        await userUpdate();
      } catch (e) {
        onError(e instanceof Error ? e.message : "UNKNOWN_ERROR");
        setLoading(false);
        return;
      }
    }

    await finishLogin(recoveredAccount);
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
