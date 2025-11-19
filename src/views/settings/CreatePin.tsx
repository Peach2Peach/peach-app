import { useAtom } from "jotai";
import { useState } from "react";
import { View } from "react-native";
import { appPinProtectionLockAtom } from "../../PinProtectionLockAtom";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PinCodeDisplay } from "../../components/pin/PinCodeDisplay";
import { PinCodeInput } from "../../components/pin/PinCodeInput";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
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
      <View
        style={tw`flex-1 flex-col justify-between items-start pb-4 self-stretch`}
      >
        <View style={[tw`flex-col items-start self-stretch`, { gap: 16 }]}>
          <View style={[tw`flex-col items-start self-stretch`, { gap: 8 }]}>
            <PeachText style={[tw`body-l`, { fontWeight: "bold" }]}>
              {!firstPin
                ? i18n("settings.createPin.insertYourPin")
                : i18n("settings.createPin.confirmYourPin")}
            </PeachText>
            <PeachText style={tw`text-black-50`}>
              {!firstPin
                ? i18n("settings.createPin.insertYourPin")
                : i18n("settings.createPin.confirmYourPin")}
            </PeachText>
          </View>
          <PinCodeDisplay currentPin={curPin} />
          <PinCodeInput
            onDigitPress={(digitString: string) =>
              setCurPin(curPin + digitString)
            }
            onDelete={() => setCurPin(curPin.slice(0, -1))}
          />
          {showErrorMessage && (
            <PeachText>{i18n("settings.createPin.pinsDontMatch")}</PeachText>
          )}
        </View>

        <Button
          disabled={curPin.length < 4}
          onPress={onConfirm}
          style={tw`self-center self-stretch`}
        >
          {i18n("confirm")}
        </Button>
      </View>
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
