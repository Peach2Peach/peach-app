import { getUserPrivate } from './../../../utils/peachAPI'
import { settingsStore } from '../../../store/settingsStore'

export const checkUsedReferralCode = async (publicKey: string) => {
  if (settingsStore.getState().usedReferralCode === undefined) {
    const [user] = await getUserPrivate({ userId: publicKey })
    if (user) settingsStore.getState().setUsedReferralCode(!!user.usedReferralCode)
  }
}
