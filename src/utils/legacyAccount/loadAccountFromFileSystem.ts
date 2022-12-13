import { account, defaultAccount, setAccount } from '../account'
import { error, info } from '../log'
import { loadIdentityFromFileSystem } from './loadIdentityFromFileSystem'
import { loadSettingsFromFileSystem } from './loadSettingsFromFileSystem'
import { loadTradingLimitFromFileSystem } from './loadTradingLimitFromFileSystem'
import { loadPaymentDataFromFileSystem } from './loadPaymentDataFromFileSystem'
import { loadOffersFromFileSystem } from './loadOffersFromFileSystem'
import { loadContractsFromFileSystem } from './loadContractsFromFileSystem'
import { loadChatsFromFileSystem } from './loadChatsFromFileSystem'

/**
 * @description Method to load legacy account from file system
 * @deprecated
 */
export const loadAccountFromFileSystem = async (password: string): Promise<LegacyAccount> => {
  info('Loading account from file system')

  let acc = defaultAccount as LegacyAccount

  try {
    const identity = await loadIdentityFromFileSystem(password)
    if (identity.publicKey) {
      const [settings, tradingLimit, paymentData, offers, contracts, chats] = await Promise.all([
        loadSettingsFromFileSystem(password),
        loadTradingLimitFromFileSystem(password),
        loadPaymentDataFromFileSystem(password),
        loadOffersFromFileSystem(password),
        loadContractsFromFileSystem(password),
        loadChatsFromFileSystem(password),
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
    return account as LegacyAccount
  }

  if (!acc.publicKey) {
    error('Account File does not exist')
  } else {
    info('Account loaded', account.publicKey)
    // await setAccount(acc) // TODO how to populate useAccountStore?
  }

  return account as LegacyAccount
}
