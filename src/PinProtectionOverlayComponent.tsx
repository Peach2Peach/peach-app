import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./components/buttons/Button";
import { PeachyBackground } from "./components/PeachyBackground";
import { PinCodeDisplay } from "./components/pin/PinCodeDisplay";
import { PinCodeInput } from "./components/pin/PinCodeInput";
import { PeachText } from "./components/text/PeachText";
import { appPinProtectionLockAtom } from "./PinProtectionLockAtom";
import { useSettingsStore } from "./store/settingsStore/useSettingsStore";
import tw from "./styles/tailwind";
import i18n from "./utils/i18n";

export function PinProtectionOverlayComponent() {
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

  const unlock = () => {
    if (input === appPinCode) {
      setInput("");
      setAppIsPinCodeLocked(false);
      setShowErrorMessage(false);
    } else {
      setInput("");
      setShowErrorMessage(true);
    }
  };

  const insets = useSafeAreaInsets();

  const { height } = useWindowDimensions();
  const isSmallScreen = height < 650;

  if (!visible) return null;

  return (
    <Modal>
      <PeachyBackground />
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <View style={[tw`flex-col items-start self-stretch`, { gap: 16 }]}>
          {!isSmallScreen && (
            <View style={tw`self-center mt-30`}>
              <PeachText
                style={[
                  {
                    textAlign: "center",
                    color: tw.color("text-primary-mild-1"),
                  },
                  tw`h5`,
                ]}
              >
                {i18n("yourAppIsPinProtected")}
              </PeachText>
              {
                <PeachText
                  style={[
                    {
                      textAlign: "center",
                      color: tw.color("text-primary-mild-1"),
                    },
                    tw`text-lg`,
                  ]}
                >
                  {showErrorMessage ? i18n("wrongPinTryAgain") : ""}
                </PeachText>
              }
            </View>
          )}
          <PinCodeDisplay currentPin={input} isOverlay={true} />
          <PinCodeInput
            currentPin={input}
            isOverlay={true}
            onDigitPress={(s: string) => {
              setShowErrorMessage(false);
              if (input.length < 8) {
                setInput(input + s);
              }
            }}
            onDelete={() => {
              setInput(input.slice(0, -1));
            }}
          />

          <Button
            disabled={input.length < 4}
            onPress={unlock}
            style={[
              { backgroundColor: tw.color("text-primary-mild-1") },
              tw`self-center m-4`,
            ]}
          >
            <PeachText style={[{ color: tw.color("primary-main") }]}>
              {i18n("unlock")}
            </PeachText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
