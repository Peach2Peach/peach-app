import { NETWORK } from '@env'
import { Bubble, PaymentMethodBubble } from '../../../components/bubble'
import { WalletLabel } from '../../../components/offer/WalletLabel'
import { TradeBreakdown } from '../../../popups/TradeBreakdown'
import { usePopupStore } from '../../../store/usePopupStore'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import { contractIdToHex, getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../../utils/contract'
import { toShortDateFormat } from '../../../utils/date'
import i18n from '../../../utils/i18n'
import { getPaymentMethodName } from '../../../utils/paymentMethod'
import { groupChars, priceFormat } from '../../../utils/string'
import { UserId } from '../../settings/profile/profileOverview/components'

export const tradeInformationGetters: Record<
  | 'bitcoinAmount'
  | 'bitcoinPrice'
  | 'buyer'
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
  | 'seller'
  | 'soldFor'
  | 'tradeBreakdown'
  | 'tradeId'
  | 'via'
  | 'youPaid'
  | 'youShouldPay'
  | 'youWillGet',
  (contract: Contract) => string | number | JSX.Element | undefined
> = {
  price: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  soldFor: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  youShouldPay: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  youPaid: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  youWillGet: (contract: Contract) =>
    `${contract.currency === 'SAT' ? groupChars(String(contract.price), 3) : priceFormat(contract.price)} ${
      contract.currency
    }`,
  buyer: (contract: Contract) => <UserId id={contract.buyer.id} showInfo />,
  paidWithMethod: (contract: Contract) => getPaymentMethodName(contract.paymentMethod),
  paidToMethod: (contract: Contract) => <PaymentMethodBubble paymentMethod={contract.paymentMethod} />,
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
  ratingBuyer: (contract: Contract) =>
    contract.ratingBuyer !== 0 ? (
      <Bubble iconId={contract.ratingBuyer === 1 ? 'thumbsUp' : 'thumbsDown'} color={'primary'} ghost />
    ) : undefined,
  ratingSeller: (contract: Contract) =>
    contract.ratingSeller !== 0 ? (
      <Bubble iconId={contract.ratingSeller === 1 ? 'thumbsUp' : 'thumbsDown'} color={'primary'} ghost />
    ) : undefined,
  seller: (contract: Contract) => <UserId id={contract.seller.id} showInfo />,
  tradeBreakdown: (contract: Contract) => <TradeBreakdownBubble contract={contract} />,
  tradeId: (contract: Contract) => contractIdToHex(contract.id),
  via: (contract: Contract) => <PaymentMethodBubble paymentMethod={contract.paymentMethod} />,
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

export const pastCashTradeFields: TradeInfoField[] = ['meetup']

function TradeBreakdownBubble ({ contract }: { contract: Contract }) {
  const setPopup = usePopupStore((state) => state.setPopup)
  const viewInExplorer = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  const showTradeBreakdown = () => {
    setPopup({
      title: i18n('tradeComplete.popup.tradeBreakdown.title'),
      content: <TradeBreakdown {...contract} />,
      visible: true,
      level: 'APP',
      action2: {
        label: i18n('tradeComplete.popup.tradeBreakdown.explorer'),
        callback: viewInExplorer,
        icon: 'externalLink',
      },
    })
  }

  return (
    <Bubble iconId="info" color="primary" onPress={showTradeBreakdown}>
      {i18n('contract.summary.tradeBreakdown.show')}
    </Bubble>
  )
}
