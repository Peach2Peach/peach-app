import { API_URL } from '@env'
import CookieManager from '@react-native-cookies/cookies'
import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import { userUpdate } from '../init/userUpdate'
import { useSettingsStore } from '../store/settingsStore'
import { loadChats, loadIdentity, loadOffers, loadTradingLimit, updateAccount } from '../utils/account'
import { defaultAccount, useAccountStore } from '../utils/account/account'
import { error, info } from '../utils/log'
import { getPeachInfo } from './getPeachInfo'
import { getTrades } from './getTrades'

export const initApp = async () => {
  dataMigrationBeforeLoadingAccount()

  await setCookies()
  await loadAccount()
  const statusResponse = await getPeachInfo()
  const publicKey = useAccountStore.getState().account.publicKey
  if (!statusResponse?.error && publicKey) {
    getTrades()
    userUpdate()
    dataMigrationAfterLoadingAccount()
  }

  return statusResponse
}

async function setCookies () {
  const cfClearance = useSettingsStore.getState().cloudflareChallenge?.cfClearance
  if (cfClearance) await CookieManager.set(API_URL, {
    name: 'cf_clearance',
    value: cfClearance,
    secure: true,
    httpOnly: true,
    domain: '.peachbitcoin.com',
  })
}

async function loadAccount () {
  const account = useAccountStore.getState().account
  if (account.publicKey) return account

  info('Loading full account from secure storage')
  const identity = loadIdentity()

  if (!identity?.publicKey) {
    error('Account does not exist')
    return defaultAccount
  }

  const [tradingLimit, offers, chats] = await Promise.all([loadTradingLimit(), loadOffers(), loadChats()])

  const acc = {
    ...identity,
    tradingLimit,
    offers,
    chats,
  }

  info('Account loaded', account.publicKey)
  updateAccount(acc)

  const newAccount = useAccountStore.getState().account

  return newAccount
}
