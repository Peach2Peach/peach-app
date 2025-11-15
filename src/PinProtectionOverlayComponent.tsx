import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./components/buttons/Button";
import { Input } from "./components/inputs/Input";
import { PeachyBackground } from "./components/PeachyBackground";
import { PeachText } from "./components/text/PeachText";
import { PIN_CODE_MAX_SIZE } from "./constants";
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
        <View style={[tw`flex-1 p-sm md:p-md items-center justify-center`]}>
          <PeachText style={tw`text-white text-lg mb-4`}>
            {i18n("enterPin")}
          </PeachText>
          <Input
            value={input}
            onChangeText={setInput}
            maxLength={PIN_CODE_MAX_SIZE}
            keyboardType="numeric"
            secureTextEntry
            style={tw`bg-white w-40 p-2 rounded mb-2`}
            onSubmitEditing={unlock}
          />
          <Button disabled={input.length < 4} onPress={unlock}>
            {i18n("unlock")}
          </Button>
          {showErrorMessage && (
            <PeachText style={tw`text-white text-lg mb-4 mt-4`}>
              {i18n("wrongPinTryAgain")}
            </PeachText>
          )}
        </View>
      </View>
    </Modal>
  );
}
