import { dataMigrationAfterLoadingWallet } from "../../init/dataMigration/dataMigrationAfterLoadingWallet";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { tolgee } from "../../tolgee";
import i18n from "../i18n";
import { getDeviceLocale } from "../system/getDeviceLocale";
import { defaultAccount, useAccountStore } from "./account";
import { loadWalletFromAccount } from "./loadWalletFromAccount";
import { setWallets } from "./setWallets";

export const updateAccount = async (acc: Account, overwrite?: boolean) => {
  const newAccount = overwrite
    ? acc
    : {
        ...defaultAccount,
        ...acc,
        tradingLimit: defaultAccount.tradingLimit,
      };
  useAccountStore.setState({ account: newAccount });

  const newLocale =
    useSettingsStore.getState().locale || getDeviceLocale() || "en";
  i18n.setLocale(newLocale);
  tolgee.changeLanguage(newLocale);
  const account = useAccountStore.getState().account;
  const { mnemonic } = account;
  if (mnemonic) {
    const wallet = loadWalletFromAccount({ ...account, mnemonic });
    await setWallets(wallet, mnemonic);
    if (!account.base58) {
      dataMigrationAfterLoadingWallet(wallet, account);
    }
  }
};
