import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save offer
 * @param offer offer
 * @param password secret
 * @returns promise resolving to encrypted offer
 */
export const storeOffer = async (offer: SellOffer | BuyOffer, password: string): Promise<void> => {
  info('Storing offer')

  if (!(await exists('/peach-account-offers'))) await mkdir('/peach-account-offers')
  await writeFile(`/peach-account-offers/${offer.id}.json`, JSON.stringify(offer), password)
}
