import { account, setAccount, defaultAccount } from '.'
import { parseContract } from '../contract'
import { exists, readDir, readFile } from '../file'
import { error, info } from '../log'
import { parseOffer } from '../offer'
import { parseError } from '../system'

/**
 * @description Method to determine version of account
 * @returns Promise resolving to account version
 */
export const getAccountVersion = async (): Promise<string> => {
  const offersAndContractSplitted = await Promise.all([
    exists('/peach-account-offers'),
    exists('/peach-account-contract'),
  ])

  if (offersAndContractSplitted.every(splitted => splitted)) return '0.1.4'

  if (await exists('/peach-account-identity.json')) return '0.1.3'

  return '0.0.1'
}

/**
 * @description Method to load legacy account
 * @param password password
 * @returns Promise resolving to legacy account
 */
export const loadLegacyAccount = async (password: string) => {
  try {
    const acc = JSON.parse(await readFile('/peach-account.json', password)) as Account
    acc.offers = acc.offers.map(parseOffer)
    acc.contracts = acc.contracts.map(parseContract)
    return acc
  } catch (e) {
    error('Could not load legacy account', parseError(e))
    return defaultAccount
  }
}

/**
 * @description Method to load account identity
 * @param password password
 * @returns Promise resolving to account identity
 */
export const loadIdentity = async (password: string) => {
  try {
    const identity = await readFile('/peach-account-identity.json', password)
    return JSON.parse(identity)
  } catch (e) {
    error('Could not load identity', parseError(e))
    return {
      publicKey: '',
      privKey: '',
      mnemonic: '',
      pgp: {
        publicKey: '',
        privateKey: '',
      },
    }
  }
}

/**
 * @description Method to load account settings
 * @param password password
 * @returns Promise resolving to account settings
 */
export const loadSettings = async (password: string): Promise<Account['settings']> => {
  try {
    const settings = await readFile('/peach-account-settings.json', password)
    return JSON.parse(settings)
  } catch (e) {
    error('Could not load settings', parseError(e))
    return defaultAccount.settings
  }
}

/**
 * @description Method to load trading limits
 * @param password password
 * @returns Promise resolving to trading limits
 */
export const loadTradingLimit = async (password: string): Promise<Account['tradingLimit']> => {
  try {
    const tradingLimit = await readFile('/peach-account-tradingLimit.json', password)
    return JSON.parse(tradingLimit)
  } catch (e) {
    error('Could not load trading limit', parseError(e))
    return defaultAccount.tradingLimit
  }
}

/**
 * @description Method to load payment data
 * @param password password
 * @returns Promise resolving to payment data
 */
export const loadPaymentData = async (password: string): Promise<Account['paymentData']> => {
  try {
    const paymentData = await readFile('/peach-account-paymentData.json', password)
    return JSON.parse(paymentData)
  } catch (e) {
    error('Could not load payment data', parseError(e))
    return defaultAccount.paymentData
  }
}

/**
 * @description Method to load offers
 * @param password password
 * @param version account version
 * @returns Promise resolving to offers
 */
export const loadOffers = async (password: string, version: string): Promise<Account['offers']> => {
  try {
    if (version === '0.1.4') {
      const offerFiles = await readDir('/peach-account-offers')
      const offers = await Promise.all(offerFiles.map(file => readFile(file, password)))

      return offers.map(offer => JSON.parse(offer)).map(parseOffer)
    }
    const offers = await readFile('/peach-account-offers.json', password)
    const parsedOffers = offers ? (JSON.parse(offers) as Account['offers']) : []

    return parsedOffers.map(parseOffer)
  } catch (e) {
    error('Could not load offers', parseError(e))
    return []
  }
}

/**
 * @description Method to load contracts
 * @param password password
 * @param version account version
 * @returns Promise resolving to contracts
 */
export const loadContracts = async (password: string, version: string): Promise<Account['contracts']> => {
  try {
    if (version === '0.1.4') {
      const contractFiles = await readDir('/peach-account-contracts')
      const contracts = await Promise.all(contractFiles.map(file => readFile(file, password)))
      return contracts.map(contract => JSON.parse(contract)).map(parseContract)
    }
    const contracts = await readFile('/peach-account-contracts.json', password)
    const parsedContracts = contracts ? (JSON.parse(contracts) as Account['contracts']) : []

    return parsedContracts.map(parseContract)
  } catch (e) {
    error('Could not load contracts', parseError(e))
    return []
  }
}

/**
 * @description Method to load chats
 * @param password password
 * @returns Promise resolving to chats
 */
export const loadChats = async (password: string): Promise<Account['chats']> => {
  try {
    const chats = await readFile('/peach-account-chats.json', password)
    return JSON.parse(chats).map((chat: Chat) => {
      chat.lastSeen = new Date(chat.lastSeen)
      chat.messages = chat.messages.map(message => ({
        ...message,
        date: new Date(message.date),
      }))
      return chat
    })
  } catch (e) {
    error('Could not load chats', parseError(e))
    return defaultAccount.chats
  }
}

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const loadAccount = async (password: string): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading account from file system')

  let acc: Account
  const version = await getAccountVersion()
  if (version === '0.0.1') {
    acc = await loadLegacyAccount(password)
  } else {
    const [identity, settings, tradingLimit, paymentData, offers, contracts, chats] = await Promise.all([
      loadIdentity(password),
      loadSettings(password),
      loadTradingLimit(password),
      loadPaymentData(password),
      loadOffers(password, version),
      loadContracts(password, version),
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
  if (!acc.publicKey) {
    error('Account File does not exist')
  } else {
    info('Account loaded', account.publicKey)
    await setAccount(acc)
  }

  return account
}
