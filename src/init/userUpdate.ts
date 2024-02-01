import messaging from "@react-native-firebase/messaging";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { UpdateUserProps, updateUser } from "../utils/peachAPI/updateUser";
import { parseError } from "../utils/result/parseError";

export const userUpdate = async (referralCode?: string) => {
  const settings = useSettingsStore.getState();
  try {
    const payload: UpdateUserProps = {};

    let fcmToken = settings.fcmToken;
    try {
      fcmToken = await messaging().getToken();
    } catch (e) {
      error(
        "messaging().getToken - Push notifications not supported",
        parseError(e),
      );
    }

    if (settings.fcmToken !== fcmToken) payload.fcmToken = fcmToken;
    if (referralCode) payload.referralCode = referralCode;

    if (Object.keys(payload).length) {
      const { result, error: err } = await updateUser(payload);

      if (result) {
        info(
          "Updated user information",
          "fcmToken",
          !!payload.fcmToken,
          "pgp",
          !!payload.pgp,
        );

        if (fcmToken) useSettingsStore.getState().setFCMToken(fcmToken);
      } else {
        error("User information could not be set", JSON.stringify(err));
      }
    }
  } catch (e) {
    error(e);
  }
};
