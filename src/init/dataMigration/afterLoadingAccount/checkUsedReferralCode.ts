import { getSelfUser } from './../../../utils/peachAPI'
import { settingsStore } from '../../../store/settingsStore'

export const checkUsedReferralCode = async (publicKey: string) => {
  if (settingsStore.getState().usedReferralCode === undefined) {
    const [user] = await getSelfUser({})
    if (user) settingsStore.getState().setUsedReferralCode(!!user.usedReferralCode)
  }
}
