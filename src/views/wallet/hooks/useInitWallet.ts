import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import { peachWallet } from "../../../utils/wallet/setWallet";

export const useInitWallet = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      if (!peachWallet) return;

      if (!peachWallet.initialized && !isInitializing) {
        setIsInitializing(true);

        // wait for the UI to render
        await InteractionManager.runAfterInteractions();

        try {
          await peachWallet.initWallet();
        } catch (err) {
          console.error("Wallet initialization failed", err);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initWallet();
  }, []);

  return { isInitializing, initialized: peachWallet?.initialized ?? false };
};
