import { account, getAccount } from '../utils/account'
import { storeAccount } from '../utils/account/storeAccount'
import { exists } from '../utils/file'
import { getOffers, saveOffers } from '../utils/offer'
import { getPaymentMethods, hashPaymentData } from '../utils/paymentMethod'
import { session } from '../utils/session'

export const dataMigration = async () => {
  if (session.password && !(await exists('/peach-account-identity.json'))) {
    await storeAccount(account, session.password)
  }

  // TODO remove mid september
  // migration to give all legacy buy offers paymentData
  const buyOffersToUpdate = getOffers()
    .filter(o => o.type === 'bid')
    .filter(o => !o.paymentData)
    .map(o => {
      o.paymentData = getPaymentMethods(o.meansOfPayment).reduce((data, method) => {
        const paymentDataForMethod = account.paymentData.filter(d => d.type === method)
        if (!paymentDataForMethod[0]) return data
        data[method] = {
          hash: hashPaymentData(paymentDataForMethod[0])
        }
        return data
      }, {} as Offer['paymentData'])
      return o
    })

  if (buyOffersToUpdate.length) {
    saveOffers(buyOffersToUpdate, false)
    if (session.password) storeAccount(getAccount(), session.password)
  }
}