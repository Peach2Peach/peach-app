import { API_URL } from '@env'
import CookieManager from '@react-native-cookies/cookies'
import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import { userUpdate } from '../init/userUpdate'
import { useSettingsStore } from '../store/settingsStore/useSettingsStore'
import { defaultAccount, useAccountStore } from '../utils/account/account'
import { accountStorage } from '../utils/account/accountStorage'
import { chatStorage } from '../utils/account/chatStorage'
import { offerStorage } from '../utils/account/offerStorage'
import { updateAccount } from '../utils/account/updateAccount'
import { error } from '../utils/log/error'
import { info } from '../utils/log/info'
import { getIndexedMap } from '../utils/storage/getIndexedMap'
import { getPeachInfo } from './getPeachInfo'

export const initApp = async () => {
  dataMigrationBeforeLoadingAccount()

  await setCookies()
  const { publicKey } = await loadAccount()
  const statusResponse = await getPeachInfo()
  if (!statusResponse?.error && publicKey) {
    useAccountStore.setState({ isLoggedIn: true })
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

  return useAccountStore.getState().account
}

async function loadChats () {
  return (await getIndexedMap(chatStorage)) as Account['chats']
}

const emptyIdentity: Identity = {
  publicKey: '',
  privKey: '',
  mnemonic: '',
  pgp: {
    publicKey: '',
    privateKey: '',
  },
}

function loadIdentity () {
  const identity = accountStorage.getMap('identity')

  if (identity) return identity as Identity

  error('Could not load identity')
  return emptyIdentity
}

async function loadOffers () {
  const offers = await getIndexedMap(offerStorage)

  return Object.values(offers) as Account['offers']
}

function loadTradingLimit () {
  const tradingLimit = accountStorage.getMap('tradingLimit')

  if (tradingLimit) return tradingLimit as Account['tradingLimit']

  error('Could not load tradingLimit')
  return defaultAccount.tradingLimit
}
