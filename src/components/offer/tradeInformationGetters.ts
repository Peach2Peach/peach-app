import { getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod, getWalletLabel } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { groupChars } from '../../utils/string'

export const tradeInformationGetters = {
  price: (contract: Contract) => contract.price + ' ' + contract.currency,
  paidToMethod: (contract: Contract) =>
    (contract.paymentData ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData)) : null)
      ?.label,
  paidWithMethod: (contract: Contract) => contract.paymentMethod,
  paidToWallet: (contract: Contract) => {
    const buyOffer = getBuyOfferFromContract(contract)
    const walletLabel
      = buyOffer.walletLabel
      || getWalletLabel({ address: buyOffer.releaseAddress, customPayoutAddress: '', customPayoutAddressLabel: '' })
    return walletLabel
  },
  bitcoinAmount: (contract: Contract) => contract.amount,
  bitcoinPrice: (contract: Contract) =>
    groupChars(getBitcoinPriceFromContract(contract).toString(), 3) + ' ' + contract.currency,

  via: (contract: Contract) => i18n(`paymentMethod.${contract.paymentMethod}`),
  method: (contract: Contract) => i18n(`paymentMethod.${contract.paymentMethod}`),
}
export const isTradeInformationGetter = (fieldName: PropertyKey): fieldName is keyof typeof tradeInformationGetters =>
  tradeInformationGetters.hasOwnProperty(fieldName)
const allPossibleFields = [
  'price',
  'paidToMethod',
  'paidWithMethod',
  'paidToWallet',
  'bitcoinAmount',
  'bitcoinPrice',
  'name',
  'beneficiary',
  'phone',
  'userName',
  'email',
  'accountNumber',
  'iban',
  'bic',
  'reference',
  'wallet',
  'ukBankAccount',
  'ukSortCode',
  'via',
  'method',
] as const

export type TradeInfoField = (typeof allPossibleFields)[number]
export const activeSellOfferFields: TradeInfoField[] = ['price', 'reference', 'paidToMethod', 'via']
export const pastSellOfferFields: TradeInfoField[] = ['price', 'paidToMethod', 'via', 'bitcoinAmount', 'bitcoinPrice']
export const pastBuyOfferFields: TradeInfoField[] = [
  'price',
  'paidWithMethod',
  'bitcoinAmount',
  'bitcoinPrice',
  'paidToWallet',
]
