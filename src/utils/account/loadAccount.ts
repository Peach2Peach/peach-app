import { account, setAccount } from '.'
import { exists, readFile } from '../file'
import { error, info } from '../log'

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const loadAccount = async (password: string): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading account from file')

  let acc: Account

  try {
    if (await exists('/peach-account-identity.json')) {
      const [identity, settings, tradingLimit, paymentData, offers, contracts, chats] = await Promise.all([
        readFile('/peach-account-identity.json', password),
        readFile('/peach-account-settings.json', password),
        readFile('/peach-account-tradingLimit.json', password),
        readFile('/peach-account-paymentData.json', password),
        readFile('/peach-account-offers.json', password),
        readFile('/peach-account-contracts.json', password),
        readFile('/peach-account-chats.json', password),
      ])
      acc = {
        ...(JSON.parse(identity)),
        settings: JSON.parse(settings),
        tradingLimit: JSON.parse(tradingLimit),
        paymentData: JSON.parse(paymentData),
        offers: JSON.parse(offers),
        contracts: JSON.parse(contracts),
        chats: JSON.parse(chats),
      }
    } else if (await exists('/peach-account.json')) { // legacy file structure. Consider safe removal mid 2023
      acc = JSON.parse(await readFile('/peach-account.json', password)) as Account
    } else {
      error('Account File does not exist')
      return account
    }
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }
    error('Incorrect password', err)
    return account
  }

  acc.offers = acc.offers.map(offer => {
    offer.creationDate = new Date(offer.creationDate)
    return offer
  })

  acc.contracts = acc.contracts.map(contract => {
    contract.creationDate = new Date(contract.creationDate)
    return contract
  })

  await setAccount(acc)
  info('Account loaded', account.publicKey)
  return account
}