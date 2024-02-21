import messaging from "@react-native-firebase/messaging";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { parseError } from "../utils/parseError";
import {
  UpdateUserParams,
  useUpdateUser,
} from "../utils/peachAPI/useUpdateUser";

export function useUserUpdate() {
  const [storedFCMToken, setStoredFCMToken] = useSettingsStore(
    (state) => [state.fcmToken, state.setFCMToken],
    shallow,
  );
  const { mutate: updateUser } = useUpdateUser();

  const userUpdate = useCallback(
    async (referralCode?: string) => {
      try {
        const payload: UpdateUserParams = {};

        let fcmToken = storedFCMToken;
        try {
          fcmToken = await messaging().getToken();
        } catch (e) {
          error(
            "messaging().getToken - Push notifications not supported",
            parseError(e),
          );
        }

        if (storedFCMToken !== fcmToken) payload.fcmToken = fcmToken;
        if (referralCode) payload.referralCode = referralCode;

        if (Object.keys(payload).length) {
          updateUser(payload, {
            onSuccess: () => {
              info(
                "Updated user information",
                "fcmToken",
                !!payload.fcmToken,
                "referralCode",
                !!payload.referralCode,
              );

              if (fcmToken) setStoredFCMToken(fcmToken);
            },
            onError: (err) => {
              error("User information could not be set", JSON.stringify(err));
            },
          });
        }
      } catch (e) {
        error(e);
      }
    },
    [setStoredFCMToken, storedFCMToken, updateUser],
  );

  return userUpdate;
}
