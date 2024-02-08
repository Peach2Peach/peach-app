import analytics from "@react-native-firebase/analytics";
import { useCallback } from "react";
import { useUserUpdate } from "../../init/useUserUpdate";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { error } from "../log/error";
import { info } from "../log/info";
import { peachAPI } from "../peachAPI";
import { updateAccount } from "./updateAccount";

export function useRecoverAccount() {
  const setFCMToken = useSettingsStore((state) => state.setFCMToken);
  const userUpdate = useUserUpdate();

  const recoverAccount = useCallback(
    async (account: Account) => {
      info("Recovering account");

      setFCMToken("");

      updateAccount(account, true);

      info("Get offers");
      const [{ result: getOffersResult, error: getOffersErr }] =
        await Promise.all([peachAPI.private.offer.getOffers(), userUpdate()]);

      analytics().logEvent("account_restored");
      if (getOffersResult?.length) {
        info(`Got ${getOffersResult.length} offers`);
        return {
          ...account,
          offers: getOffersResult,
        };
      } else if (getOffersErr) {
        error("Error", getOffersErr);
      }

      return account;
    },
    [setFCMToken, userUpdate],
  );

  return recoverAccount;
}
