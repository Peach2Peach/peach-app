import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { waitForHydration } from "../../../store/waitForHydration";
import { peachAPI } from "./../../../utils/peachAPI";

export const checkUsedReferralCode = async () => {
  await waitForHydration(useSettingsStore);
  if (useSettingsStore.getState().usedReferralCode === undefined) {
    const { result: user } = await peachAPI.private.user.getSelfUser();
    if (user)
      useSettingsStore.getState().setUsedReferralCode(!!user.usedReferralCode);
  }
};
