import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Modal, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  const windowHeight = useWindowDimensions().height;
  const contentRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (isSmallScreen) return;

    setTimeout(() => {
      contentRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
        const bottom = pageY + height;

        if (bottom > windowHeight) {
          setIsSmallScreen(true);
        } else {
          setIsSmallScreen(false);
        }
      });
    }, 0);
  }, [visible, input]);

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
        <View
          ref={contentRef}
          onLayout={() => {}} // ensures layout events fire
          style={[tw`flex-col items-start self-stretch`, { gap: 16 }]}
        >
          {!isSmallScreen && (
            <View style={tw`self-center mt-30`}>
              {/* <PeachText
                style={[
                  {
                    textAlign: "center",
                    color: tw.color("text-primary-mild-1"),
                  },
                  tw`h5`,
                ]}
              >
                {i18n("yourAppIsPinProtected")}
              </PeachText> */}
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
          <PinCodeDisplay
            currentPin={input}
            isOverlay={true}
            inputSize={appPinCode?.length}
          />
          <PinCodeInput
            currentPin={input}
            isOverlay={true}
            onDigitPress={(s: string) => {
              setShowErrorMessage(false);
              if (appPinCode && input.length < appPinCode.length) {
                setInput(input + s);

                if (input.length + 1 === appPinCode.length) {
                  unlock(input + s);
                }
              }
            }}
            onDelete={() => {
              setInput(input.slice(0, -1));
            }}
          />

          {/* <Button
            disabled={!appPinCode || input.length < appPinCode?.length}
            onPress={unlock}
            style={[
              { backgroundColor: tw.color("text-primary-mild-1") },
              tw`self-center m-4`,
            ]}
          >
            <PeachText style={[{ color: tw.color("primary-main") }]}>
              {i18n("unlock")}
            </PeachText>
          </Button> */}
        </View>
      </View>
    </Modal>
  );
}
