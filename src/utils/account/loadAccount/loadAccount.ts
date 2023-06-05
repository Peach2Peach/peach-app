import {
  account,
  defaultAccount,
  loadChats,
  loadContracts,
  loadIdentity,
  loadOffers,
  loadPaymentData,
  loadTradingLimit,
  updateAccount,
} from '../'
import { dataMigrationAfterLoadingAccount } from '../../../init/dataMigration'
import { getTrades } from '../../../init/getTrades'
import { userUpdate } from '../../../init/userUpdate'
import { error, info } from '../../log'
import { loadLegacyPaymentData } from './loadLegacyPaymentData'

const onAccountLoaded = async () => {
  getTrades()
  userUpdate()
  await dataMigrationAfterLoadingAccount(account)
}

export const loadAccount = async (): Promise<Account> => {
  if (account.publicKey) {
    onAccountLoaded()
    return account
  }

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
    onAccountLoaded()
    await updateAccount(acc)
  }

  return account
}
