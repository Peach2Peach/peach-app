import { useAtom } from "jotai";
import { useState } from "react";
import { appPinProtectionLockAtom } from "../../PinProtectionLockAtom";
import { Header } from "../../components/Header";
import { PinCodeSettingsScreen } from "../../components/pin/PinCodeSettingsScreen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { useSetToast } from "../../components/toast/Toast";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../../utils/i18n";

export const CreatePin = () => {
  const [_appIsPinCodeLocked, setAppIsPinCodeLocked] = useAtom(
    appPinProtectionLockAtom,
  );
  const setToast = useSetToast();

  const castPinsNotMatchingError = () =>
    setToast({
      msgKey: "PINS_DONT_MATCH",
      color: "red",
    });

  const navigation = useStackNavigation();
  const { appPinCode, setAppPinCode } = useSettingsStore();
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

  const onConfirm = () => {
    if (curPin === "") {
      return;
    }

    if (firstPin === "") {
      setFirstPin(curPin);
      setCurPin("");
      return;
    }

    if (curPin !== firstPin) {
      castPinsNotMatchingError();
      setFirstPin("");
      setCurPin("");
      return;
    }
    setAppIsPinCodeLocked(false);
    setAppPinCode(curPin);
    setPopup(<PinCreatedSuccessPopup />);
    navigation.goBack();
  };

  const mainText = !firstPin
    ? i18n("settings.createPin.insertYourPin")
    : i18n("settings.createPin.confirmYourPin");

  const subText = !firstPin
    ? i18n("settings.createPin.insertYourPin")
    : i18n("settings.createPin.confirmYourPin");

  return (
    <PinCodeSettingsScreen
      headerComponent={<CreatePinHeader />}
      mainText={mainText}
      subText={subText}
      currentPin={curPin}
      onDigitPress={(digitString: string) => setCurPin(curPin + digitString)}
      onDigitDelete={() => setCurPin(curPin.slice(0, -1))}
      onPinConfirm={onConfirm}
    />
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
