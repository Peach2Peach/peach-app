import { Bubble, PaymentMethodBubble } from '../../../components/bubble'
import { WalletLabel } from '../../../components/offer/WalletLabel'
import { contractIdToHex, getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../../utils/contract'
import { toShortDateFormat } from '../../../utils/date'
import i18n from '../../../utils/i18n'
import { getPaymentMethodName } from '../../../utils/paymentMethod'
import { groupChars, priceFormat } from '../../../utils/string'
import { UserId } from '../../settings/profile/profileOverview/components'
import { TradeBreakdownBubble } from '../components/TradeBreakdownBubble'

export const tradeInformationGetters: Record<
  | 'bitcoinAmount'
  | 'bitcoinPrice'
  | 'location'
  | 'meetup'
  | 'method'
  | 'paidToMethod'
  | 'paidToWallet'
  | 'paidWithMethod'
  | 'paymentConfirmed'
  | 'price'
  | 'ratingBuyer'
  | 'ratingSeller'
  | 'soldFor'
  | 'tradeBreakdown'
  | 'tradeId'
  | 'via'
  | 'youPaid'
  | 'youShouldPay'
  | 'youWillGet',
  (contract: Contract) => string | number | JSX.Element | undefined
> & {
  buyer: (contract: Contract) => JSX.Element
  seller: (contract: Contract) => JSX.Element
} = {
  price: getPrice,
  soldFor: getPrice,
  youShouldPay: getPrice,
  youPaid: getPrice,
  youWillGet: getPrice,
  buyer: (contract: Contract) => <UserId id={contract.buyer.id} showInfo />,
  paidWithMethod: getPaymentMethod,
  paidToMethod: getPaymentMethodBubble,
  paidToWallet: (contract: Contract) => {
    const buyOffer = getBuyOfferFromContract(contract)
    return <WalletLabel label={buyOffer.walletLabel} address={buyOffer.releaseAddress} />
  },
  paymentConfirmed: (contract: Contract) => toShortDateFormat(contract.paymentConfirmed || new Date(), true),
  bitcoinAmount: (contract: Contract) => contract.amount,
  bitcoinPrice: (contract: Contract) => {
    const bitcoinPrice = getBitcoinPriceFromContract(contract)
    if (contract.currency === 'SAT') return `${groupChars(String(bitcoinPrice), 3)} ${contract.currency}`
    return `${priceFormat(bitcoinPrice)} ${contract.currency}`
  },
  ratingBuyer: (contract: Contract) => getRatingBubble(contract, 'Buyer'),
  ratingSeller: (contract: Contract) => getRatingBubble(contract, 'Seller'),
  seller: (contract: Contract) => <UserId id={contract.seller.id} showInfo />,
  tradeBreakdown: (contract: Contract) => <TradeBreakdownBubble contract={contract} />,
  tradeId: (contract: Contract) => contractIdToHex(contract.id),
  via: getPaymentMethodBubble,
  method: getPaymentMethod,
  meetup: getPaymentMethod,
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
  'buyer',
  'phone',
  'userName',
  'email',
  'accountNumber',
  'iban',
  'bic',
  'paymentConfirmed',
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
  'ratingBuyer',
  'ratingSeller',
  'seller',
  'soldFor',
  'tradeBreakdown',
  'tradeId',
  'youPaid',
  'youShouldPay',
  'youWillGet',
] as const
export type TradeInfoField = (typeof allPossibleFields)[number]
export const isTradeInformationGetter = (
  fieldName: keyof typeof tradeInformationGetters | TradeInfoField,
): fieldName is keyof typeof tradeInformationGetters => tradeInformationGetters.hasOwnProperty(fieldName)

function getPrice (contract: Contract) {
  return `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
    contract.currency
  }`
}

function getPaymentMethodBubble (contract: Contract) {
  return <PaymentMethodBubble paymentMethod={contract.paymentMethod} />
}

function getRatingBubble (contract: Contract, userType: 'Buyer' | 'Seller') {
  return contract[`rating${userType}`] !== 0 ? (
    <Bubble iconId={contract[`rating${userType}`] === 1 ? 'thumbsUp' : 'thumbsDown'} color={'primary'} ghost />
  ) : undefined
}

function getPaymentMethod (contract: Contract) {
  return getPaymentMethodName(contract.paymentMethod)
}
