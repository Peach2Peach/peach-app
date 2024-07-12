import messaging from "@react-native-firebase/messaging";
import { useCallback } from "react";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { parseError } from "../utils/parseError";
import {
  UpdateUserParams,
  useUpdateUser,
} from "../utils/peachAPI/useUpdateUser";

export function useUserUpdate() {
  const { mutate: updateUser } = useUpdateUser();

  const userUpdate = useCallback(
    async (referralCode?: string) => {
      try {
        const payload: UpdateUserParams = {};

        try {
          payload.fcmToken = await messaging().getToken();
        } catch (e) {
          error(
            "messaging().getToken - Push notifications not supported",
            parseError(e),
          );
        }

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
    [updateUser],
  );

  return userUpdate;
}
