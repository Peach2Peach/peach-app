import { defaultAccount, loadChats, loadIdentity, loadOffers, loadTradingLimit, updateAccount } from '../'
import { error, info } from '../../log'
import { useAccountStore } from '../account'

export const loadAccount = async (): Promise<Account> => {
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
