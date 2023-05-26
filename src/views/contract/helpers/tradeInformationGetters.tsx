import { WalletLabel } from '../../../components/offer/WalletLabel'
import { getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getPaymentDataByMethod } from '../../../utils/offer'
import { getPaymentMethodName, hashPaymentData } from '../../../utils/paymentMethod'
import { groupChars, priceFormat } from '../../../utils/string'

export const tradeInformationGetters: Record<
  | 'price'
  | 'paidToMethod'
  | 'paidWithMethod'
  | 'paidToWallet'
  | 'bitcoinAmount'
  | 'bitcoinPrice'
  | 'via'
  | 'method'
  | 'meetup'
  | 'location',
  (contract: Contract) => string | number | JSX.Element | undefined
> = {
  price: (contract: Contract) => priceFormat(contract.price) + ' ' + contract.currency,
  paidToMethod: (contract: Contract) =>
    (contract.paymentData ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData)) : null)
      ?.label,
  paidWithMethod: (contract: Contract) => contract.paymentMethod,
  paidToWallet: (contract: Contract) => {
    const buyOffer = getBuyOfferFromContract(contract)
    return <WalletLabel label={buyOffer.walletLabel} address={buyOffer.releaseAddress} />
  },
  bitcoinAmount: (contract: Contract) => contract.amount,
  bitcoinPrice: (contract: Contract) =>
    groupChars(getBitcoinPriceFromContract(contract).toString(), 3) + ' ' + contract.currency,

  via: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  method: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  meetup: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  location: (_contract: Contract) => i18n('contract.summary.location.text'),
}
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
  'meetup',
  'location',
] as const
export type TradeInfoField = (typeof allPossibleFields)[number]
export const isTradeInformationGetter = (
  fieldName: keyof typeof tradeInformationGetters | TradeInfoField,
): fieldName is keyof typeof tradeInformationGetters => tradeInformationGetters.hasOwnProperty(fieldName)

export const activeSellOfferFields: TradeInfoField[] = ['price', 'reference', 'paidToMethod', 'via']
export const pastSellOfferFields: TradeInfoField[] = ['price', 'paidToMethod', 'via', 'bitcoinAmount', 'bitcoinPrice']
export const pastBuyOfferFields: TradeInfoField[] = [
  'price',
  'paidWithMethod',
  'bitcoinAmount',
  'bitcoinPrice',
  'paidToWallet',
]

export const activeCashTradeFields: TradeInfoField[] = ['bitcoinAmount', 'price', 'meetup', 'location']
export const pastBuyOfferCashFields: TradeInfoField[] = [
  'price',
  'meetup',
  'bitcoinAmount',
  'bitcoinPrice',
  'paidToWallet',
]
export const pastSellOfferCashFields: TradeInfoField[] = ['price', 'meetup', 'bitcoinAmount', 'bitcoinPrice']
