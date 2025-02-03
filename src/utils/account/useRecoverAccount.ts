import { useCallback } from "react";
import { useUserUpdate } from "../../init/useUserUpdate";
import { info } from "../log/info";
import { updateAccount } from "./updateAccount";

export function useRecoverAccount() {
  const userUpdate = useUserUpdate();

  const recoverAccount = useCallback(
    async (account: Account) => {
      info("Recovering account");

      updateAccount(account, true);

      await userUpdate();

      return account;
    },
    [userUpdate],
  );

  return recoverAccount;
}
