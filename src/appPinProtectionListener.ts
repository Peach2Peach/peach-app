import { useAtom } from "jotai";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { appPinProtectionLockAtom } from "./PinProtectionLockAtom";

export const useAppPinProtection = () => {
  const [_appIsPinCodeLocked, setAppIsPinCodeLocked] = useAtom(
    appPinProtectionLockAtom,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppIsPinCodeLocked(true);
    }, 300);

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          setAppIsPinCodeLocked(true);
        }
      },
    );

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [setAppIsPinCodeLocked]);
};
