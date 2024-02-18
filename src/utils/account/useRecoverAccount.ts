import analytics from "@react-native-firebase/analytics";
import { useCallback } from "react";
import { useUserUpdate } from "../../init/useUserUpdate";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { info } from "../log/info";
import { updateAccount } from "./updateAccount";

export function useRecoverAccount() {
  const setFCMToken = useSettingsStore((state) => state.setFCMToken);
  const userUpdate = useUserUpdate();

  const recoverAccount = useCallback(
    async (account: Account) => {
      info("Recovering account");

      setFCMToken("");

      updateAccount(account, true);

      await userUpdate();

      analytics().logEvent("account_restored");
      return account;
    },
    [setFCMToken, userUpdate],
  );

  return recoverAccount;
}
