import { account, defaultAccount, setAccount } from '../'
import { exists } from '../../file'
import { error, info } from '../../log'
import { loadIdentity } from './loadIdentity'
import { loadSettings } from './loadSettings'
import { loadTradingLimit } from './loadTradingLimit'
import { loadPaymentData } from './loadPaymentData'
import { loadOffers } from './loadOffers'
import { loadContracts } from './loadContracts'
import { loadChats } from './loadChats'
import { loadLegacyAccount } from './loadLegacyAccount'

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const loadAccount = async (password: string): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading account from file system')

  let acc = defaultAccount

  try {
    const identity = await loadIdentity(password)
    if (identity.publicKey) {
      const [settings, tradingLimit, paymentData, offers, contracts, chats] = await Promise.all([
        loadSettings(password),
        loadTradingLimit(password),
        loadPaymentData(password),
        loadOffers(password),
        loadContracts(password),
        loadChats(password),
      ])
      acc = {
        ...identity,
        settings,
        tradingLimit,
        paymentData,
        offers,
        contracts,
        chats,
      }
    }
  } catch (e) {
    if (await exists('/peach-account.json')) {
      acc = await loadLegacyAccount(password)
    } else {
      return account
    }
  }

  if (!acc.publicKey) {
    error('Account File does not exist')
  } else {
    info('Account loaded', account.publicKey)
    await setAccount(acc)
  }

  return account
}
