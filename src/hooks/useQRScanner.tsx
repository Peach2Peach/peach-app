import { useCallback, useState } from "react";
import { Linking } from "react-native";
import { BarCodeReadEvent } from "react-native-camera";
import {
  PERMISSIONS,
  RESULTS,
  request as requestPermission,
} from "react-native-permissions";
import { useSetPopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { WarningPopup } from "../popups/WarningPopup";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { isIOS } from "../utils/system/isIOS";

type Props = {
  onSuccess: (data: string) => void;
};
export const useQRScanner = ({ onSuccess }: Props) => {
  const setPopup = useSetPopup();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const showQR = useCallback(async () => {
    if (isIOS()) {
      await requestPermission(PERMISSIONS.IOS.CAMERA).then((cameraStatus) => {
        if (cameraStatus === RESULTS.GRANTED) {
          setShowQRScanner(true);
        } else {
          setPopup(<MissingPermissionsPopup />);
        }
      });
    } else {
      setShowQRScanner(true);
    }
  }, [setPopup]);
  const closeQR = () => setShowQRScanner(false);
  const onRead = ({ data }: BarCodeReadEvent) => {
    onSuccess(data);
    closeQR();
  };

  return { showQRScanner, showQR, closeQR, onRead };
};

function MissingPermissionsPopup() {
  return (
    <WarningPopup
      title={i18n("settings.missingPermissions")}
      content={i18n("settings.missingPermissions.text")}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <OpenSettingsAction />
        </>
      }
    />
  );
}

function OpenSettingsAction() {
  return (
    <PopupAction
      label={i18n("settings.openSettings")}
      textStyle={tw`text-black-100`}
      onPress={Linking.openSettings}
      iconId={"settings"}
      reverseOrder
    />
  );
}
