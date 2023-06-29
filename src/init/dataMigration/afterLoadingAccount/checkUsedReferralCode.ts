import { getSelfUser } from './../../../utils/peachAPI'
import { useSettingsStore } from '../../../store/useSettingsStore'

export const checkUsedReferralCode = async () => {
  if (useSettingsStore.getState().usedReferralCode === undefined) {
    const [user] = await getSelfUser({})
    if (user) useSettingsStore.getState().setUsedReferralCode(!!user.usedReferralCode)
  }
}
