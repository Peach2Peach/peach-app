import { defaultAccount } from '../'
import { parseContract } from '../../contract'
import { readFile } from '../../file'
import { error } from '../../log'
import { parseOffer } from '../../offer'
import { parseError } from '../../system'

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
