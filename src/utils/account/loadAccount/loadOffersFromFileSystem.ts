import { exists, readDir, readFile } from '../../file'
import { error } from '../../log'
import { dateTimeReviver, parseError } from '../../system'

/**
 * @deprecated
 */
export const loadOffersFromFileSystem = async (password: string): Promise<Account['offers']> => {
  try {
    if (await exists('/peach-account-offers')) {
      const offerFiles = await readDir('/peach-account-offers')
      const offers = await Promise.all(offerFiles.map((file) => readFile(file, password)))

      return offers.map((offer) => JSON.parse(offer, dateTimeReviver))
    }

    // fallback to version 0.1.3
    let offers = '[]'
    if (await exists('/peach-account-offers.json')) {
      offers = await readFile('/peach-account-offers.json', password)
    }
    const parsedOffers = offers ? (JSON.parse(offers, dateTimeReviver) as Account['offers']) : []

    return parsedOffers
  } catch (e) {
    error('Could not load offers', parseError(e))
    return []
  }
}
