import { WalletLabel } from '../../../components/offer/WalletLabel'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getPaymentMethodName } from '../../../utils/paymentMethod'
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
  price: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  paidToMethod: (contract: Contract) => {
    if (!contract.paymentData) return undefined
    return usePaymentDataStore.getState().searchPaymentData(contract.paymentData)[0]?.label
  },

  paidWithMethod: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  paidToWallet: (contract: Contract) => {
    const buyOffer = getBuyOfferFromContract(contract)
    return <WalletLabel label={buyOffer.walletLabel} address={buyOffer.releaseAddress} />
  },
  bitcoinAmount: (contract: Contract) => contract.amount,
  bitcoinPrice: (contract: Contract) => {
    const bitcoinPrice = getBitcoinPriceFromContract(contract)
    if (contract.currency === 'SAT') return `${groupChars(String(bitcoinPrice), 3)} ${contract.currency}`
    return `${priceFormat(bitcoinPrice)} ${contract.currency}`
  },
  via: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  method: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  meetup: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  location: (_contract: Contract) => i18n('contract.summary.location.text'),
}
const allPossibleFields = [
  'pixAlias',
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
  'postePayNumber',
  'reference',
  'wallet',
  'ukBankAccount',
  'ukSortCode',
  'via',
  'method',
  'meetup',
  'location',
  'receiveAddress',
  'lnurlAddress',
  'chipperTag',
  'eversendUserName',
] as const
export type TradeInfoField = (typeof allPossibleFields)[number]
export const isTradeInformationGetter = (
  fieldName: keyof typeof tradeInformationGetters | TradeInfoField,
): fieldName is keyof typeof tradeInformationGetters => tradeInformationGetters.hasOwnProperty(fieldName)

export const activeSellOfferFields: TradeInfoField[] = ['price', 'reference', 'paidToMethod', 'via']
export const pastSellOfferFields: TradeInfoField[] = ['price', 'bitcoinPrice', 'paidToMethod']
export const pastBuyOfferFields: TradeInfoField[] = ['price', 'bitcoinPrice', 'paidWithMethod']

export const activeCashTradeFields: TradeInfoField[] = ['price', 'meetup', 'location']
export const pastCashTradeFields: TradeInfoField[] = ['price', 'bitcoinPrice', 'meetup']
