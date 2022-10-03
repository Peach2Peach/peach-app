import { exists, readDir, readFile } from '../../file'
import { error } from '../../log'
import { parseOffer } from '../../offer'
import { parseError } from '../../system'

/**
 * @description Method to load offers
 * @param password password
 * @param version account version
 * @returns Promise resolving to offers
 */
export const loadOffers = async (password: string): Promise<Account['offers']> => {
  try {
    if (await exists('/peach-account-offers')) {
      const offerFiles = await readDir('/peach-account-offers')
      const offers = await Promise.all(offerFiles.map((file) => readFile(file, password)))

      return offers.map((offer) => JSON.parse(offer)).map(parseOffer)
    }

    // fallback to version 0.1.3
    let offers = '[]'
    if (await exists('/peach-account-offers.json')) {
      offers = await readFile('/peach-account-offers.json', password)
    }
    const parsedOffers = offers ? (JSON.parse(offers) as Account['offers']) : []

    return parsedOffers.map(parseOffer)
  } catch (e) {
    error('Could not load offers', parseError(e))
    return []
  }
}
