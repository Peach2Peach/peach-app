import { useState } from "react";
import { Keyboard } from "react-native";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { decryptAccount } from "../../../utils/account/decryptAccount";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import { storeAccount } from "../../../utils/account/storeAccount";
import { useRecoverAccount } from "../../../utils/account/useRecoverAccount";
import { parseError } from "../../../utils/result/parseError";
import { useRegisterUser } from "../../newUser/useRegisterUser";
import { LOGIN_DELAY } from "../../restoreReputation/LOGIN_DELAY";
import { setupPeachAccount } from "./setupPeachAccount";

const passwordRules = { password: true, required: true };

export const useRestoreFromFileSetup = () => {
  const [file, setFile] = useState({
    name: "",
    content: "",
  });

  const [password, setPassword, , passwordError] = useValidatedState<string>(
    "",
    passwordRules,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);

  const updateFileBackupDate = useSettingsStore(
    (state) => state.updateFileBackupDate,
  );
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn);

  const onError = (errorMsg = "UNKNOWN_ERROR") => {
    if (errorMsg !== "WRONG_PASSWORD") setError(errorMsg);
    deleteAccount();
  };

  const { mutate: register } = useRegisterUser();
  const recoverAccount = useRecoverAccount();
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData);

  const decryptAndRecover = async () => {
    const [recoveredAccount, err] = decryptAccount({
      encryptedAccount: file.content,
      password,
    });
    const mnemonic = recoveredAccount?.mnemonic;

    const handleError = (errorMsg: string) => {
      setLoading(false);
      onError(errorMsg);
    };

    if (!mnemonic) {
      handleError(parseError(err));
      return;
    }

    const onSuccess = async () => {
      const updatedAccount = await recoverAccount(recoveredAccount);

      if (recoveredAccount.paymentData)
        recoveredAccount.paymentData.map(addPaymentData);

      await storeAccount(updatedAccount);
      setRestored(true);
      setLoading(false);
      updateFileBackupDate();

      setTimeout(() => {
        setIsLoggedIn(true);
      }, LOGIN_DELAY);
    };

    const authErr = await setupPeachAccount({ ...recoveredAccount, mnemonic });
    if (authErr === "NOT_FOUND") {
      register(
        { ...recoveredAccount, mnemonic },
        {
          onError: ({ message }) => handleError(message),
          onSuccess: () => onSuccess(),
        },
      );
    } else {
      if (authErr) {
        onError(authErr);
        return;
      }
      await onSuccess();
    }
  };

  const submit = () => {
    Keyboard.dismiss();
    setLoading(true);

    // decrypting is render blocking, to show loading, we call it within a timeout
    setTimeout(decryptAndRecover);
  };

  return {
    restored,
    error,
    loading,
    file,
    setFile,
    password,
    setPassword,
    passwordError,
    submit,
  };
};
