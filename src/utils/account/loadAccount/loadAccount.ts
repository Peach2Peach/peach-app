import {
  account,
  defaultAccount,
  loadChats,
  loadContracts,
  loadIdentity,
  loadOffers,
  loadTradingLimit,
  updateAccount,
} from '../'
import { error, info } from '../../log'

export const loadAccount = async (): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading full account from secure storage')
  const identity = loadIdentity()

  if (!identity?.publicKey) {
    error('Account does not exist')
    return defaultAccount
  }

  const [tradingLimit, offers, contracts, chats] = await Promise.all([
    loadTradingLimit(),
    loadOffers(),
    loadContracts(),
    loadChats(),
  ])

  const acc = {
    ...identity,
    tradingLimit,
    offers,
    contracts,
    chats,
  }

  if (!acc.publicKey) {
    error('Account does not exist')
  } else {
    info('Account loaded', account.publicKey)
    updateAccount(acc)
  }

  return account
}
