import { useState } from "react";
import { Keyboard } from "react-native";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { decryptAccount } from "../../../utils/account/decryptAccount";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import { deriveDeterministicPgp } from "../../../utils/account/deriveDeterministicPgp";
import { storeAccount } from "../../../utils/account/storeAccount";
import { useRecoverAccount } from "../../../utils/account/useRecoverAccount";
import { error as logError } from "../../../utils/log/error";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";
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
  const [wrongPassword, setWrongPassword] = useState(false);

  const updateFileBackupDate = useSettingsStore(
    (state) => state.updateFileBackupDate,
  );
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);

  const onError = (errorMsg = "UNKNOWN_ERROR") => {
    if (errorMsg !== "WRONG_PASSWORD") setError(errorMsg);
    setWrongPassword(true);
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

    const authToken = await setupPeachAccount({
      ...recoveredAccount,
      mnemonic,
    });
    if (!authToken) {
      onError();
      return;
    }

    // If the server already holds the seed-derived (deterministic) PGP key, the
    // backup's PGP key is stale — restore only the seed and derive the PGP key
    // from it instead.
    try {
      const deterministic = deriveDeterministicPgp(mnemonic);
      const { result: user } = await peachAPI.private.user.getSelfUser();
      if (user?.pgpPublicKeys?.[0]?.publicKey === deterministic.publicKey) {
        recoveredAccount.pgp = deterministic;
      }
    } catch (e) {
      logError(
        "[restoreFromFile] failed to evaluate deterministic pgp",
        parseError(e),
      );
    }

    await onSuccess();
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
    wrongPassword,
  };
};
