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

export const ChangePin = () => {
  const navigation = useStackNavigation();
  const { appPinCode, setAppPinCode } = useSettingsStore();

  const [stage, setStage] = useState(0);

  const [curPin, setCurPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const setPopup = useSetPopup();

  const setToast = useSetToast();

  const castPinsNotMatchingError = () =>
    setToast({
      msgKey: "PINS_DONT_MATCH",
      color: "red",
    });
  const castIncorrectPinError = () =>
    setToast({
      msgKey: "INCORRECT_PIN",
      color: "red",
    });

  if (appPinCode === undefined) {
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

  const onConfirm = () => {
    if (curPin === "") {
      return;
    }

    if (stage === 0) {
      if (curPin !== appPinCode) {
        castIncorrectPinError();
        setCurPin("");
        return;
      }

      setStage(1);
      setCurPin("");
      return;
    }

    if (stage === 1) {
      if (curPin === "") {
        return;
      }
      setStage(2);
      setNewPin(curPin);
      setCurPin("");
      return;
    }

    if (curPin === "") {
      return;
    }
    if (curPin !== newPin) {
      setStage(0);
      setCurPin("");
      setNewPin("");
      castPinsNotMatchingError();
      return;
    }

    setAppPinCode(curPin);
    setPopup(<PinChangedSuccessPopup />);
    navigation.pop(2);
  };

  const infoMessage =
    stage === 0
      ? i18n("settings.changePin.insertYourPin")
      : stage === 1
        ? i18n("settings.changePin.insertNewPin")
        : i18n("settings.changePin.confirmNewPin");

  return (
    <PinCodeSettingsScreen
      headerComponent={<ChangePinHeader />}
      mainText={infoMessage}
      subText={infoMessage}
      currentPin={curPin}
      onDigitPress={(digitString: string) => setCurPin(curPin + digitString)}
      onDigitDelete={() => setCurPin(curPin.slice(0, -1))}
      onPinConfirm={onConfirm}
    />
  );
};

function ChangePinHeader() {
  return <Header title={i18n("settings.changePin")} icons={[]} />;
}

function PinChangedSuccessPopup() {
  return (
    <SuccessPopup
      title={i18n("settings.changePin.success.title")}
      content={i18n("settings.changePin.success.text")}
      actions={
        <>
          <ClosePopupAction />
        </>
      }
    />
  );
}
