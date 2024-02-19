import { useState } from "react";
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
import { useTranslate } from "@tolgee/react";

type Props = {
  onSuccess: (data: string) => void;
};
export const useQRScanner = ({ onSuccess }: Props) => {
  const setPopup = useSetPopup();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const showQR = () => {
    if (isIOS()) {
      requestPermission(PERMISSIONS.IOS.CAMERA).then((cameraStatus) => {
        if (cameraStatus === RESULTS.GRANTED) {
          setShowQRScanner(true);
        } else {
          setPopup(<MissingPermissionsPopup />);
        }
      });
    } else {
      setShowQRScanner(true);
    }
  };
  const closeQR = () => setShowQRScanner(false);
  const onRead = ({ data }: BarCodeReadEvent) => {
    onSuccess(data);
    closeQR();
  };

  return { showQRScanner, showQR, closeQR, onRead };
};

function MissingPermissionsPopup() {
  const { t } = useTranslate("settings");

  return (
    <WarningPopup
      title={t("settings.missingPermissions")}
      content={t("settings.missingPermissions.text")}
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
  const { t } = useTranslate("settings");

  return (
    <PopupAction
      label={t("settings.openSettings")}
      textStyle={tw`text-black-100`}
      onPress={Linking.openSettings}
      iconId={"settings"}
      reverseOrder
    />
  );
}
