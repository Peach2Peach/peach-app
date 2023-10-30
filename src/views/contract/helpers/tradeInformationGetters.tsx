import { TouchableOpacity, View } from 'react-native'
import { CopyAble, Icon, Text } from '../../../components'
import { Bubble } from '../../../components/bubble'
import { useWalletLabel } from '../../../components/offer/useWalletLabel'
import { APPLINKS } from '../../../paymentMethods'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import tw from '../../../styles/tailwind'
import { contractIdToHex, getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../../utils/contract'
import { toShortDateFormat } from '../../../utils/date'
import i18n from '../../../utils/i18n'
import { getPaymentMethodName } from '../../../utils/paymentMethod'
import { groupChars, priceFormat } from '../../../utils/string'
import { openAppLink } from '../../../utils/web'
import { useDecryptedContractData } from '../../contractChat/useDecryptedContractData'
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
  | 'youWillGet',
  (contract: Contract) => string | number | JSX.Element | undefined
> & {
  buyer: (contract: Contract) => JSX.Element
  seller: (contract: Contract) => JSX.Element
  youShouldPay: (contract: Contract) => JSX.Element
} = {
  price: getPrice,
  soldFor: getPrice,
  youShouldPay: (contract: Contract) => <YouShouldPay contract={contract} />,
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
  return <PaymentMethodBubble contract={contract} />
}

function PaymentMethodBubble ({ contract }: { contract: Contract }) {
  const { paymentMethod } = contract
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const hasLink = !!(url || appLink)
  const openLink = () => (url ? openAppLink(url, appLink) : null)
  const { data } = useDecryptedContractData(contract)
  const paymentMethodName = getPaymentMethodName(paymentMethod)
  const paymentMethodLabel = usePaymentDataStore((state) =>
    data ? state.searchPaymentData(data?.paymentData)[0]?.label : undefined,
  )
  if (!data) return <></>
  return (
    <View style={tw`items-end gap-1`}>
      <Bubble color={'primary-mild'}>{paymentMethodLabel ?? paymentMethodName}</Bubble>
      {hasLink && (
        <TouchableOpacity onPress={openLink} style={tw`flex-row items-center justify-end gap-1`}>
          <Text style={tw`underline body-s text-black-2`}>{i18n('contract.summary.openApp')}</Text>
          <Icon id="externalLink" size={16} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      )}
    </View>
  )
}

function getRatingBubble (contract: Contract, userType: 'Buyer' | 'Seller') {
  return contract[`rating${userType}`] !== 0 ? (
    <Bubble iconId={contract[`rating${userType}`] === 1 ? 'thumbsUp' : 'thumbsDown'} color={'primary'} ghost />
  ) : undefined
}

function getPaymentMethod (contract: Contract) {
  return getPaymentMethodName(contract.paymentMethod)
}

function WalletLabel ({ label, address }: { label?: string; address?: string }) {
  const walletLabel = useWalletLabel({ label, address })

  return <>{walletLabel}</>
}

function YouShouldPay ({ contract }: { contract: Contract }) {
  return (
    <View style={tw`flex-row items-center justify-end gap-10px`}>
      <Text style={[tw`subtitle-1`, tw.md`subtitle-0`]}>{getPrice(contract)}</Text>
      <CopyAble value={String(contract.price)} style={tw.md`w-5 h-5`} />
    </View>
  )
}
