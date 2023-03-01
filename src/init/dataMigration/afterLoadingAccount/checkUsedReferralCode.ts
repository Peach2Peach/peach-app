import { getUserPrivate } from './../../../utils/peachAPI/private/user/getUserPrivate'
import { settingsStore } from '../../../store/settingsStore'
import { account } from '../../../utils/account'

export const checkUsedReferralCode = async (publicKey: string) => {
  if (account && settingsStore.getState().usedReferralCode === undefined) {
    const [user] = await getUserPrivate({ userId: publicKey })
    if (user) settingsStore.getState().setUsedReferralCode(!!user.usedReferralCode)
  }
}
