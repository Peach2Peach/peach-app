import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib } from "bitcoinjs-lib";
import { useCallback } from "react";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { defaultAccount, useAccountStore } from "../utils/account/account";
import { accountStorage } from "../utils/account/accountStorage";
import { chatStorage } from "../utils/account/chatStorage";
import { updateAccount } from "../utils/account/updateAccount";
import { info } from "../utils/log/info";
import { getIndexedMap } from "../utils/storage/getIndexedMap";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { checkSupportedPaymentMethods } from "./dataMigration/checkSupportedPaymentMethods";
import { getPeachInfo } from "./getPeachInfo";
import { useUserUpdate } from "./useUserUpdate";

initEccLib(ecc);

export function useInitApp() {
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  const storedPublicKey = useAccountStore((state) => state.account.publicKey);
  const userUpdate = useUserUpdate();
  const { data: paymentMethods } = usePaymentMethods();

  const initApp = useCallback(async () => {
    const publicKey = storedPublicKey || (await loadAccount());
    try {
      const statusResponse = await getPeachInfo();
      if (!statusResponse?.error && publicKey) {
        setIsLoggedIn(true);
        userUpdate();
        if (paymentMethods) {
          checkSupportedPaymentMethods(paymentMethods);
        }
      }

      return statusResponse;
    } catch (err) {
      return null;
    }
  }, [paymentMethods, setIsLoggedIn, storedPublicKey, userUpdate]);

  return initApp;
}

async function loadAccount() {
  info("Loading full account from secure storage");
  const identity = loadIdentity();

  if (!identity?.publicKey) return null;

  const [tradingLimit, chats] = await Promise.all([
    loadTradingLimit(),
    loadChats(),
  ]);

  const acc = {
    ...identity,
    tradingLimit,
    chats,
  };

  info("Account loaded", acc.publicKey);
  updateAccount(acc);

  return acc.publicKey;
}

async function loadChats() {
  return (await getIndexedMap(chatStorage)) as Account["chats"];
}

const emptyIdentity: Identity = {
  publicKey: "",
  mnemonic: "",
  pgp: {
    publicKey: "",
    privateKey: "",
  },
};

function loadIdentity() {
  const identity = accountStorage.getMap("identity");

  if (identity) return identity as Identity;
  return emptyIdentity;
}

function loadTradingLimit() {
  const tradingLimit = accountStorage.getMap("tradingLimit");

  if (tradingLimit) return tradingLimit as Account["tradingLimit"];
  return defaultAccount.tradingLimit;
}
