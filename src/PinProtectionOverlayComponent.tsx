import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, Platform, View } from "react-native";
import BootSplash from "react-native-bootsplash";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PeachyBackground } from "./components/PeachyBackground";
import { PinCodeDisplay } from "./components/pin/PinCodeDisplay";
import { PinCodeInput } from "./components/pin/PinCodeInput";
import { PeachText } from "./components/text/PeachText";
import { appPinProtectionLockAtom } from "./PinProtectionLockAtom";
import { useSettingsStore } from "./store/settingsStore/useSettingsStore";
import tw from "./styles/tailwind";
import i18n, { useI18n } from "./utils/i18n";

export function PinProtectionOverlayComponent() {
  useI18n();
  const { appPinCode } = useSettingsStore();
  const [hydrated, setHydrated] = useState(() =>
    useSettingsStore.persist.hasHydrated(),
  );
  const [appIsPinCodeLocked, setAppIsPinCodeLocked] = useAtom(
    appPinProtectionLockAtom,
  );
  const [input, setInput] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (hydrated) return undefined;
    if (useSettingsStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }
    return useSettingsStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const unlock = (inputText?: string) => {
    const consideredInput = inputText === undefined ? input : inputText;
    if (consideredInput === appPinCode) {
      setInput("");
      setAppIsPinCodeLocked(false);
      setShowErrorMessage(false);
    } else {
      setInput("");
      setShowErrorMessage(true);
    }
  };

  const insets = useSafeAreaInsets();

  const showKeypad = appIsPinCodeLocked && hydrated && !!appPinCode;

  // Android only: once the peach keypad is fully covering the screen, dismiss
  // the native bootsplash instantly (no fade). On Android the splash sits on
  // the activity window behind this transparent Modal (a separate window), so
  // letting Screens fade it out later makes the fade bleed through the Modal as
  // a "splash flash". Hiding it now, behind the already-painted cover, makes
  // the handoff seamless. hide() is idempotent, so Screens' later
  // hide({ fade }) becomes a no-op. iOS doesn't expose the splash that way, so
  // we leave it on Screens' normal faded hide there.
  useEffect(() => {
    if (showKeypad && Platform.OS === "android")
      BootSplash.hide().catch(() => {});
  }, [showKeypad]);

  // The cover must be up from the very first frame so the app content never
  // flashes through. The lock atom defaults to `true`, so we start covered and
  // only lift once we can prove the app should be open: settings hydrated AND
  // either no PIN is set or the user has unlocked. While the settings store is
  // still hydrating (appPinCode unknown) we keep the peachy cover up without
  // the keypad, which reads as a brief launch splash.
  if (!appIsPinCodeLocked) return null;
  if (hydrated && !appPinCode) return null;

  return (
    <Modal transparent>
      <PeachyBackground />

      <View
        style={[
          tw`flex-1`,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={[tw`items-center`, { gap: 16 }]}>
            {showKeypad && (
              <>
                <PeachText
                  style={[
                    tw`text-lg text-center`,
                    { color: tw.color("text-primary-mild-1") },
                  ]}
                >
                  {showErrorMessage && i18n("wrongPinTryAgain")}
                </PeachText>

                <PinCodeDisplay
                  currentPin={input}
                  isOverlay
                  inputSize={appPinCode?.length}
                />

                <PinCodeInput
                  currentPin={input}
                  isOverlay
                  onDigitPress={(s: string) => {
                    setShowErrorMessage(false);

                    if (appPinCode && input.length < appPinCode.length) {
                      const next = input + s;
                      setInput(next);

                      if (next.length === appPinCode.length) {
                        unlock(next);
                      }
                    }
                  }}
                  onDelete={() => {
                    setInput(input.slice(0, -1));
                  }}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
