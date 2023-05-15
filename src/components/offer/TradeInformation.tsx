import { TradeSeparator } from './TradeSeparator'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { View } from 'react-native'
import { TradeSummaryProps } from './TradeSummary'
import tw from '../../styles/tailwind'
import { getPaymentDataByMethod, getWalletLabel } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { SummaryItem } from '../payment/paymentDetailTemplates/SummaryItem'
import { getBitcoinPriceFromContract, getBuyOfferFromContract } from '../../utils/contract'
import { groupChars } from '../../utils/string'
import { Text } from '../text'
import { CopyAble } from '../ui'
import { PaymentMethodForms } from '../inputs/paymentMethods/paymentForms'
import i18n from '../../utils/i18n'

// const shouldShowDisputeStatus = (contract: Contract): contract is Contract & { disputeWinner: 'buyer' | 'seller' } =>
//   ['confirmPaymentRequired', 'releaseEscrow'].includes(contract.tradeStatus) && !!contract.disputeWinner

const shouldShowTradeStatusInfo = (contract: Contract) => {
  // when there is an active or resolved dispute
  const shouldShowDisputeInfo = false

  // buyer canceled, collab cancel (requested) or payment too late
  const shouldShowCancelationInfo = false

  return shouldShowDisputeInfo || shouldShowCancelationInfo
}

const getTradeActionStatus = (contract: Contract) => {
  const status = 'not resolved'
  return status
}

const getTradeActionStatusText = (contract: Contract) => {
  // eslint-disable-next-line max-len
  const text = 'You\'ll need to decide if you want to re-publish this offer, or refund the escrow to your <wallet label>.'
  return text
}

// This is the component used for non default trades (disputes, canceled, etc)
const TradeStatusInfo = ({ contract, view }: TradeSummaryProps) => (
  <View style={tw``}>
    <SummaryItem isBitcoinAmount information={contract.amount} />
    <SummaryItem label="status" information={getTradeActionStatus(contract)} />
    <Text style={tw`body-sc`}>{getTradeActionStatusText(contract)}</Text>
  </View>
)

// global constant for possible fields
const tradeInformationFields = {
  price: { label: 'price', getInformation: (contract: Contract) => contract.price + ' ' + contract.currency },
  paidToMethod: {
    label: 'paid to',
    getInformation: (contract: Contract) =>
      (contract.paymentData
        ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData))
        : null
      )?.label,
  },
  paidWithMethod: {
    label: 'paid with',
    getInformation: (contract: Contract) => contract.paymentMethod,
  },
  paidToWallet: {
    label: 'paid to',
    getInformation: (contract: Contract) => {
      const buyOffer = getBuyOfferFromContract(contract)
      const walletLabel
        = buyOffer.walletLabel
        || getWalletLabel({ address: buyOffer.releaseAddress, customPayoutAddress: '', customPayoutAddressLabel: '' })
      return walletLabel
    },
  },
  bitcoinAmount: { label: undefined, getInformation: (contract: Contract) => contract.amount },
  bitcoinPrice: {
    label: 'BTC price',
    getInformation: (contract: Contract) =>
      groupChars(getBitcoinPriceFromContract(contract).toString(), 3) + ' ' + contract.currency,
  },
  name: { label: 'name', getInformation: (contract: Contract) => contract.paymentData?.name },
  beneficiary: { label: 'name', getInformation: (contract: Contract) => contract.paymentData?.beneficiary },
  phone: { label: 'phone #', getInformation: (contract: Contract) => contract.paymentData?.phone },
  userName: { label: 'username', getInformation: (contract: Contract) => contract.paymentData?.userName },
  email: { label: 'email', getInformation: (contract: Contract) => contract.paymentData?.email },
  accountNumber: {
    label: 'account #',
    getInformation: (contract: Contract) => contract.paymentData?.accountNumber,
  },
  iban: { label: 'iban', getInformation: (contract: Contract) => contract.paymentData?.iban },
  bic: { label: 'swift/bic', getInformation: (contract: Contract) => contract.paymentData?.bic },
  reference: { label: 'reference', getInformation: (contract: Contract) => contract.paymentData?.reference },
  wallet: { label: 'wallet #', getInformation: (contract: Contract) => contract.paymentData?.wallet },
  ukBankAccount: {
    label: 'iban',
    getInformation: (contract: Contract) => contract.paymentData?.ukBankAccount,
  },
  ukSortCode: { label: 'swift/bic', getInformation: (contract: Contract) => contract.paymentData?.ukSortCode },
  via: { label: 'via', getInformation: (contract: Contract) => i18n(`paymentMethod.${contract.paymentMethod}`) },
  method: { label: 'method', getInformation: (contract: Contract) => i18n(`paymentMethod.${contract.paymentMethod}`) },
}

export type TradeInfoField = keyof typeof tradeInformationFields
const activeSellOfferFields: TradeInfoField[] = ['price', 'reference', 'paidToMethod', 'via']
const pastSellOfferFields: TradeInfoField[] = ['price', 'paidToMethod', 'via', 'bitcoinAmount', 'bitcoinPrice']
const pastBuyOfferFields: TradeInfoField[] = ['price', 'paidWithMethod', 'bitcoinAmount', 'bitcoinPrice', 'paidToWallet']

// used to get all applicable fields for a trade
const getTradeInfoFields = (contract: Contract, view: 'buyer' | 'seller') => {
  if (contract.tradeStatus === 'tradeCompleted') {
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  return view === 'buyer' ? PaymentMethodForms[contract.paymentMethod]?.fields || [] : activeSellOfferFields
}

// This is the component that shows the trade details (meaning SummaryItems)
const TradeDetails = ({ contract, view }: TradeSummaryProps) => {
  const fields = getTradeInfoFields(contract, view)

  return (
    <View>
      {fields.map((fieldName) => {
        const { label, getInformation } = tradeInformationFields[fieldName]
        const information = getInformation(contract)
        if (!information && label !== 'reference') return null
        const props
          = typeof information === 'number'
            ? { label, information, isBitcoinAmount: true as const }
            : typeof !information && label === 'reference'
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

      {/** All of the below will be removed */}
      {/*  {shouldShowDisputeStatus(contract) ? (
          <DisputeStatus winner={contract.disputeWinner} view={view} />
        ) : (
          <>
            {shouldShowOpenTrade(contract) ? (
              <>
                <>
                  <TradeAmount {...contract} isBuyer={view === 'buyer'} />
                  {isCashTrade(contract.paymentMethod) && view === 'buyer' && <CashTradeDetails {...contract} />}
                  {!!contract.paymentData && !!PaymentTo && <PaymentTo {...contract} copyable={view === 'buyer'} />}
                  {view === 'seller'
                    && !!storedPaymentData
                    && (isCashTrade(contract.paymentMethod) ? (
                      <CashTradeDetails {...contract} />
                    ) : (
                      <View style={tw`flex-row items-start mt-[2px]`}>
                        <Text style={[tw`text-black-2 w-25`, contract.disputeActive && tw`text-error-light`]}>
                          {i18n('contract.payment.to')}
                        </Text>
                        <View style={tw`flex-row items-center flex-1`}>
                          <Text
                            style={[
                              tw`flex-wrap leading-normal subtitle-1`,
                              contract.disputeActive && tw`text-error-dark`,
                            ]}
                          >
                            {storedPaymentData.label}
                          </Text>
                        </View>
                      </View>
                    ))}
                  {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
                    <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
                  )}
                </>
              </>
            ) : contract.tradeStatus === 'tradeCanceled' ? (
              <CanceledTradeDetails {...contract} style={tw`self-center`} />
            ) : (
              <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
            )}
          </>
        )} */}
    </View>
  </View>
)
