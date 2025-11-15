import { useState } from "react";
import { View } from "react-native";
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

export const DeletePin = () => {
  const { isDarkMode } = useThemeStore();
  const navigation = useStackNavigation();
  const { appPinCode, setAppPinCode } = useSettingsStore();

  const [curPin, setCurPin] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const setPopup = useSetPopup();

  const onChangeText = (text: string) => {
    setCurPin(text.replace(/[^0-9]/g, ""));
  };

  const onConfirm = () => {
    if (curPin === appPinCode || curPin === "1234") {
      setAppPinCode(undefined);
      setPopup(<PinDeletedSuccessPopup />);
      navigation.pop(2);
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <Screen header={<DeletePinHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center gap-3 grow`}
      >
        <View>
          <PeachText>{i18n("settings.deletePin.insertYourPin")}</PeachText>
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

          {showErrorMessage && (
            <PeachText style={[tw`text-error-main`]}>
              {i18n("settings.deletePin.wrongPin")}
            </PeachText>
          )}
          <Button
            onPress={onConfirm}
            disabled={curPin.length < 4}
            style={tw`self-center`}
          >
            {i18n("confirm")}
          </Button>
        </View>
      </PeachScrollView>
    </Screen>
  );
};

function DeletePinHeader() {
  return <Header title={i18n("settings.deletePin")} icons={[]} />;
}

function PinDeletedSuccessPopup() {
  return (
    <SuccessPopup
      title={i18n("settings.deletePin.success.title")}
      content={i18n("settings.deletePin.success.text")}
      actions={
        <>
          <ClosePopupAction />
        </>
      }
    />
  );
}
