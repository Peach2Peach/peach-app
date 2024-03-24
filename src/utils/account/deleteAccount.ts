import analytics from "@react-native-firebase/analytics";
import { useConfigStore } from "../../store/configStore/configStore";
import { offerPreferencesStorage } from "../../store/offerPreferenes/useOfferPreferences";
import { settingsStorage } from "../../store/settingsStore/settingsStorage";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import {
  notificationStorage,
  useNotificationStore,
} from "../../views/home/notificationsStore";
import { info } from "../log/info";
import { peachAPI } from "../peachAPI";
import { clearPeachLiquidWallet, clearPeachWallet } from "../wallet/setWallet";
import { useLiquidWalletState } from "../wallet/useLiquidWalletState";
import { useWalletState, walletStorage } from "../wallet/walletStore";
import { defaultAccount, useAccountStore } from "./account";
import { accountStorage } from "./accountStorage";
import { chatStorage } from "./chatStorage";
import { updateAccount } from "./updateAccount";

export const deleteAccount = () => {
  info("Deleting account");

  updateAccount(defaultAccount, true);
  [
    accountStorage,
    walletStorage,
    offerPreferencesStorage,
    chatStorage,
    settingsStorage,
    notificationStorage,
  ].forEach((storage) => storage.clearStore());
  [
    useAccountStore,
    useNotificationStore,
    useConfigStore,
    useWalletState,
    useLiquidWalletState,
    useSettingsStore,
    usePaymentDataStore,
    useBoltzSwapStore,
  ].forEach((store) => store.getState().reset());

  clearPeachWallet();
  clearPeachLiquidWallet();
  peachAPI.setPeachAccount(null);
  analytics().logEvent("account_deleted");
};
