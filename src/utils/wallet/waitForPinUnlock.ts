import { getDefaultStore } from "jotai";
import { appPinProtectionLockAtom } from "../../PinProtectionLockAtom";
import { waitForHydration } from "../../store/waitForHydration";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";

/**
 * True while the PIN overlay is covering the UI and owns the user's taps.
 * It only blocks when the app is locked AND a PIN is actually set — users
 * without a PIN are never gated (the lock atom stays `true` for them).
 */
const isPinOverlayBlocking = () =>
  getDefaultStore().get(appPinProtectionLockAtom) &&
  !!useSettingsStore.getState().appPinCode;

/**
 * Resolves once the PIN overlay is no longer blocking the UI.
 *
 * The bdk-rn v3 `Persister.newSqlite` / `Wallet.load` calls are synchronous
 * JSI calls that freeze the JS thread for their full duration. On a real
 * device with a populated wallet DB that freeze lasts long enough to make the
 * PIN overlay's taps unresponsive. Gating the load on unlock keeps the single
 * JS thread free for the PIN until the user is through it; the unavoidable
 * freeze then happens after unlock, where it reads as "loading wallet".
 */
export const waitForPinUnlock = async (): Promise<void> => {
  await waitForHydration(useSettingsStore);

  if (!isPinOverlayBlocking()) return;

  await new Promise<void>((resolve) => {
    const check = () => {
      if (isPinOverlayBlocking()) return;
      unsubscribeAtom();
      unsubscribeSettings();
      resolve();
    };
    const unsubscribeAtom = getDefaultStore().sub(
      appPinProtectionLockAtom,
      check,
    );
    const unsubscribeSettings = useSettingsStore.subscribe(check);
  });
};
