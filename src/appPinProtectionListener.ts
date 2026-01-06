import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { appPinProtectionLockAtom } from "./PinProtectionLockAtom";

const PIN_GRACE_PERIOD_MS = 30_000;

export const useAppPinProtection = () => {
  const [, setAppIsPinCodeLocked] = useAtom(appPinProtectionLockAtom);

  const lastBackgroundAt = useRef<number | null>(null);

  useEffect(() => {
    // Initial lock shortly after app start
    const timeout = setTimeout(() => {
      setAppIsPinCodeLocked(true);
    }, 300);

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          lastBackgroundAt.current = Date.now();
          return;
        }

        if (nextAppState === "active") {
          const now = Date.now();
          const elapsed =
            lastBackgroundAt.current == null
              ? Infinity
              : now - lastBackgroundAt.current;

          if (elapsed > PIN_GRACE_PERIOD_MS) {
            setAppIsPinCodeLocked(true);
          }
        }
      },
    );

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [setAppIsPinCodeLocked]);
};
