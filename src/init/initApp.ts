import { API_URL } from '@env'
import CookieManager from '@react-native-cookies/cookies'
import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import { userUpdate } from '../init/userUpdate'
import { useSettingsStore } from '../store/settingsStore'
import { account, loadAccount } from '../utils/account'
import { getPeachInfo } from './getPeachInfo'
import { getTrades } from './getTrades'

const setCookies = async () => {
  const cfClearance = useSettingsStore.getState().cloudflareChallenge?.cfClearance
  if (cfClearance) await CookieManager.set(API_URL, {
    name: 'cf_clearance',
    value: cfClearance,
    secure: true,
    httpOnly: true,
    domain: '.peachbitcoin.com',
  })
}
export const initApp = async (): Promise<GetStatusResponse | APIError | null> => {
  dataMigrationBeforeLoadingAccount()

  await setCookies()
  await loadAccount()
  const statusResponse = await getPeachInfo()
  if (!statusResponse?.error && account?.publicKey) {
    getTrades()
    userUpdate()
    dataMigrationAfterLoadingAccount()
  }

  return statusResponse
}
