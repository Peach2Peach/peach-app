import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save offers
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted offers
 */
export const storeOffers = async (offers: Account['offers'], password: string): Promise<void> => {
  info('Storing offers', offers.length)

  if (!(await exists('/peach-account-offers'))) await mkdir('/peach-account-offers')
  await Promise.all(
    offers.map((offer) => writeFile(`/peach-account-offers/${offer.id}.json`, JSON.stringify(offer), password)),
  )
}
