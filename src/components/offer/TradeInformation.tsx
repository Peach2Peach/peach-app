import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod, getWalletLabel } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { groupChars } from '../../utils/string'
import { PaymentMethodForms } from '../inputs/paymentMethods/paymentForms'
import { SummaryItem } from '../payment/paymentDetailTemplates/SummaryItem'
import { Text } from '../text'
import { CopyAble, ErrorBox } from '../ui'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { TradeSeparator } from './TradeSeparator'
import { TradeSummaryProps } from './TradeSummary'

const shouldShowTradeStatusInfo = (contract: Contract) => {
  const shouldShowDisputeInfo = true

  const shouldShowCancelationInfo = false

  return shouldShowDisputeInfo || shouldShowCancelationInfo
}

const getTradeActionStatus = (contract: Contract) => {
  const status = 'not resolved'
  return status
}

const getTradeActionStatusText = (contract: Contract, view: ContractViewer) => {
  // eslint-disable-next-line max-len
  const text = 'You\'ll need to decide if you want to re-publish this offer, or refund the escrow to your <wallet label>.'
  const text1
    = 'You lost the dispute! Your reputation has been impacted, and you need to release the escrow to the buyer.'
  const text2 = 'You lost the dispute! Your reputation has been impacted, and you\'ve released the escrow to the buyer.'
  if (view === 'buyer') {
  } else if (contract.disputeWinner) {
    if (contract.disputeWinner === 'buyer') {
      if (contract.tradeStatus === 'releaseEscrow') {
        return text1
      }
      return text2
    }
    return text1
  }
  return text2

  contract.tradeStatus === ''
}

const TradeStatusInfo = ({ contract, view }: TradeSummaryProps) => (
  <View style={tw``}>
    <SummaryItem isBitcoinAmount information={contract.amount} />
    <SummaryItem label="status" information={getTradeActionStatus(contract)} />
    <Text style={tw`body-s`}>{getTradeActionStatusText(contract, view)}</Text>
  </View>
)

const tradeInformationGetters = {
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
const activeSellOfferFields: TradeInfoField[] = ['price', 'reference', 'paidToMethod', 'via']
const pastSellOfferFields: TradeInfoField[] = ['price', 'paidToMethod', 'via', 'bitcoinAmount', 'bitcoinPrice']
const pastBuyOfferFields: TradeInfoField[] = ['price', 'paidWithMethod', 'bitcoinAmount', 'bitcoinPrice', 'paidToWallet']

const getTradeInfoFields = (contract: Contract, view: 'buyer' | 'seller') => {
  if (contract.tradeStatus === 'tradeCompleted') {
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  return view === 'buyer' ? PaymentMethodForms[contract.paymentMethod]?.fields || [] : activeSellOfferFields
}

const TradeDetails = ({ contract, view }: TradeSummaryProps) => {
  // contract = { ...contract, paymentData: undefined, error: 'DECRYPTION_ERROR' }
  const fields = getTradeInfoFields(contract, view)

  return (
    <View>
      {fields.map((fieldName) => {
        const label = i18n(`contract.summary.${fieldName}`)
        const information = Object.hasOwn(tradeInformationGetters, fieldName)
          ? tradeInformationGetters[fieldName](contract)
          : contract.paymentData?.[fieldName]
        if (!information && fieldName !== 'reference') return null
        const props
          = typeof information === 'number'
            ? { label, information, isBitcoinAmount: true as const }
            : !information
              ? { label, information: 'none', isAvailable: false }
              : { label, information }
        return (
          <SummaryItem
            {...props}
            isDisputeActive={contract.disputeActive}
            icon={
              view === 'buyer' && contract.tradeStatus !== 'tradeCompleted' ? (
                <CopyAble value={String(information)} style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} />
              ) : undefined
            }
          />
        )
      })}
      {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
        <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
      )}
    </View>
  )
}

export const TradeInformation = ({ contract, view }: TradeSummaryProps) => (
  <View>
    <TradeSeparator
      {...contract}
      iconId={getTradeSeparatorIcon(contract.tradeStatus)}
      iconColor={getTradeSeparatorIconColor(contract.tradeStatus)}
      text={getTradeSeparatorText(contract.tradeStatus, view)}
    />
    <View>
      {shouldShowTradeStatusInfo(contract) ? (
        <TradeStatusInfo {...{ contract, view }} />
      ) : (
        <TradeDetails {...{ contract, view }} />
      )}
    </View>
  </View>
)
