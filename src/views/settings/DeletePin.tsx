import { useState } from "react";
import { Header } from "../../components/Header";
import { PinCodeSettingsScreen } from "../../components/pin/PinCodeSettingsScreen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { useSetToast } from "../../components/toast/Toast";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../../utils/i18n";

export const DeletePin = () => {
  const navigation = useStackNavigation();
  const { appPinCode, setAppPinCode } = useSettingsStore();

  const [curPin, setCurPin] = useState("");
  const setPopup = useSetPopup();

  const setToast = useSetToast();

  const castIncorrectPinError = () =>
    setToast({
      msgKey: "INCORRECT_PIN",
      color: "red",
    });

  const onConfirm = () => {
    if (curPin === appPinCode) {
      setAppPinCode(undefined);
      setPopup(<PinDeletedSuccessPopup />);
      navigation.pop(2);
    } else {
      setCurPin("");
      castIncorrectPinError();
    }
  };

  return (
    <PinCodeSettingsScreen
      headerComponent={<DeletePinHeader />}
      mainText={i18n("settings.deletePin.insertYourPin")}
      subText={i18n("settings.deletePin.insertYourPin")}
      currentPin={curPin}
      onDigitPress={(digitString: string) => setCurPin(curPin + digitString)}
      onDigitDelete={() => setCurPin(curPin.slice(0, -1))}
      onPinConfirm={onConfirm}
    />
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
