import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
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
  const [appIsPinCodeLocked, setAppIsPinCodeLocked] = useAtom(
    appPinProtectionLockAtom,
  );
  const [input, setInput] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (appIsPinCodeLocked && appPinCode) {
      const timeout = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(timeout);
    } else {
      setVisible(false);
    }
  }, [appIsPinCodeLocked, appPinCode]);

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

  if (!visible) return null;

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
            {
              <PeachText
                style={[
                  tw`text-lg text-center`,
                  { color: tw.color("text-primary-mild-1") },
                ]}
              >
                {showErrorMessage && i18n("wrongPinTryAgain")}
              </PeachText>
            }

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
          </View>
        </View>
      </View>
    </Modal>
  );
}
