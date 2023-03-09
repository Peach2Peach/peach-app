import {
  account,
  defaultAccount,
  loadChats,
  loadContracts,
  loadIdentity,
  loadOffers,
  loadPaymentData,
  loadSettings,
  loadTradingLimit,
  setAccount,
} from '../'
import { error, info } from '../../log'
import { loadLegacyPaymentData } from './loadLegacyPaymentData'

export const loadAccount = async (): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading full account from secure storage')
  const identity = await loadIdentity()

  if (!identity?.publicKey) {
    error('Account does not exist')
    return defaultAccount
  }

  const [settings, tradingLimit, paymentData, legacyPaymentData, offers, contracts, chats] = await Promise.all([
    loadSettings(),
    loadTradingLimit(),
    loadPaymentData(),
    loadLegacyPaymentData(),
    loadOffers(),
    loadContracts(),
    loadChats(),
  ])

  const acc = {
    ...identity,
    settings,
    tradingLimit,
    paymentData,
    legacyPaymentData,
    offers,
    contracts,
    chats,
  }

  if (!acc.publicKey) {
    error('Account does not exist')
  } else {
    info('Account loaded', account.publicKey)
    await setAccount(acc)
  }

  return account
}
