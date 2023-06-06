import {
  account,
  defaultAccount,
  loadChats,
  loadContracts,
  loadIdentity,
  loadOffers,
  loadPaymentData,
  loadTradingLimit,
} from '../'
import { dataMigrationAfterLoadingAccount } from '../../../init/dataMigration'
import { error, info } from '../../log'
import { loadLegacyPaymentData } from './loadLegacyPaymentData'

export const loadAccount = async (): Promise<Account> => {
  info('Loading full account from secure storage')
  const identity = await loadIdentity()

  if (!identity?.publicKey) {
    error('Account does not exist')
    return defaultAccount
  }

  const [tradingLimit, paymentData, legacyPaymentData, offers, contracts, chats] = await Promise.all([
    loadTradingLimit(),
    loadPaymentData(),
    loadLegacyPaymentData(),
    loadOffers(),
    loadContracts(),
    loadChats(),
  ])

  const acc = {
    ...identity,
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
    await dataMigrationAfterLoadingAccount(account)
  }

  return acc
}
