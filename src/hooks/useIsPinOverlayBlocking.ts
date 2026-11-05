import { useAtomValue } from "jotai";
import { appPinProtectionLockAtom } from "../PinProtectionLockAtom";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";

/**
 * Reactive twin of `isPinOverlayBlocking` in waitForPinUnlock: true while the
 * PIN overlay covers the UI. Users without a PIN are never gated (the lock
 * atom stays `true` for them).
 *
 * Other global Modals must stay hidden while this is true: on iOS sibling
 * Modals present from the same root view controller, so presenting one while
 * the PIN Modal is up fails silently and can leave the app unresponsive.
 */
export const useIsPinOverlayBlocking = () => {
  const isLocked = useAtomValue(appPinProtectionLockAtom);
  const hasPin = useSettingsStore((state) => !!state.appPinCode);
  return isLocked && hasPin;
};
