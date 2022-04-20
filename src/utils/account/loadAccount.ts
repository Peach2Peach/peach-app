import { account, setAccount } from '.'
import { readFile } from '../file'
import { error, info } from '../log'

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const loadAccount = async (password: string): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading account from file')

  let acc

  try {
    acc = JSON.parse(await readFile('/peach-account.json', password)) as Account
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