import { useSettingsStore } from '../../../store/settingsStore'
import { peachAPI } from './../../../utils/peachAPI'

export const checkUsedReferralCode = async () => {
  if (useSettingsStore.getState().usedReferralCode === undefined) {
    const { result: user } = await peachAPI.private.user.getSelfUser()
    if (user) useSettingsStore.getState().setUsedReferralCode(!!user.usedReferralCode)
  }
}
