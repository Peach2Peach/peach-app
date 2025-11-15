import { useAtom } from "jotai";
import { useState } from "react";
import { View } from "react-native";
import { appPinProtectionLockAtom } from "../../PinProtectionLockAtom";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { PIN_CODE_MAX_SIZE } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const CreatePin = () => {
  const [_appIsPinCodeLocked, setAppIsPinCodeLocked] = useAtom(
    appPinProtectionLockAtom,
  );
  const { isDarkMode } = useThemeStore();
  const navigation = useStackNavigation();
  const { appPinCode, setAppPinCode } = useSettingsStore();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [firstPin, setFirstPin] = useState("");

  const [curPin, setCurPin] = useState("");
  const setPopup = useSetPopup();

  if (appPinCode !== undefined && firstPin === "") {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "homeScreen",
          params: {
            screen: "home",
          },
        },
      ],
    });
  }

  const onChangeText = (text: string) => {
    setCurPin(text.replace(/[^0-9]/g, ""));
  };

  const onConfirm = () => {
    if (curPin === "") {
      return;
    }

    if (firstPin === "") {
      setFirstPin(curPin);
      setCurPin("");
      setShowErrorMessage(false);
      return;
    }

    if (curPin !== firstPin) {
      setShowErrorMessage(true);
      setFirstPin("");
      setCurPin("");
      return;
    }
    setAppIsPinCodeLocked(false);
    setAppPinCode(curPin);
    setPopup(<PinCreatedSuccessPopup />);
    navigation.goBack();
  };

  return (
    <Screen header={<CreatePinHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center gap-3 grow`}
      >
        <View>
          <PeachText>
            {!firstPin
              ? i18n("settings.createPin.insertYourPin")
              : i18n("settings.createPin.confirmYourPin")}
          </PeachText>
          <Input
            value={curPin}
            maxLength={PIN_CODE_MAX_SIZE}
            onChangeText={onChangeText}
            keyboardType="numeric"
            secureTextEntry
            style={[
              tw`px-4 py-2 border-2 rounded-lg`,
              isDarkMode
                ? tw`bg-transparent border-2 border-black-50 text-backgroundLight-light`
                : tw`bg-white text-black-100`,
            ]}
            onSubmitEditing={onConfirm}
          />

          <Button
            disabled={curPin.length < 4}
            onPress={onConfirm}
            style={tw`self-center`}
          >
            {i18n("confirm")}
          </Button>
          {showErrorMessage && (
            <PeachText>{i18n("settings.createPin.pinsDontMatch")}</PeachText>
          )}
        </View>
      </PeachScrollView>
    </Screen>
  );
};

function CreatePinHeader() {
  return <Header title={i18n("settings.createPin")} icons={[]} />;
}

function PinCreatedSuccessPopup() {
  return (
    <SuccessPopup
      title={i18n("settings.createPin.success.title")}
      content={i18n("settings.createPin.success.text")}
      actions={
        <>
          <ClosePopupAction />
        </>
      }
    />
  );
}
