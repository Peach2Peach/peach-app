import { account, defaultAccount, loadIdentity, loadOffers, loadSettings, loadTradingLimit } from '../'
import { error, info } from '../../log'

export const loadAccount = async (): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading full account from secure storage')
  const identity = await loadIdentity()

  if (!identity?.publicKey) {
    error('Account does not exist')
    return defaultAccount
  }

  const [settings, tradingLimit, offers] = await Promise.all([loadSettings(), loadTradingLimit(), loadOffers()])

  const acc = {
    ...identity,
    settings,
    tradingLimit,
    offers,
    chats,
  }

  if (!acc.publicKey) {
    error('Account does not exist')
  } else {
    info('Account loaded', account.publicKey)
    // await setAccount(acc) // TODO how to populate useAccountStore?
  }

  return account
}
