import { account, getAccount, saveAccount } from '../utils/account'
import { getOffers, saveOffers } from '../utils/offer'
import { getPaymentMethods, hashPaymentData } from '../utils/paymentMethod'
import { session } from '../utils/session'

export const dataMigration = () => {
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
    console.log(buyOffersToUpdate.map(o => [o.id, JSON.stringify(o.paymentData)]))
    saveOffers(buyOffersToUpdate, false)
    if (session.password) saveAccount(getAccount(), session.password)
  }
}