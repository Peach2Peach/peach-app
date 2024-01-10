import { Fragment } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { TouchableIcon } from '../../../components/TouchableIcon'
import { Toggle } from '../../../components/inputs/Toggle'
import { PeachText } from '../../../components/text/PeachText'
import { ErrorBox } from '../../../components/ui/ErrorBox'
import { HorizontalLine } from '../../../components/ui/HorizontalLine'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useNavigation } from '../../../hooks/useNavigation'
import { useIsMyAddress } from '../../../hooks/wallet/useIsMyAddress'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import tw from '../../../styles/tailwind'
import { useAccountStore } from '../../../utils/account/account'
import { getMessageToSignForAddress } from '../../../utils/account/getMessageToSignForAddress'
import { getOfferIdFromContract } from '../../../utils/contract/getOfferIdFromContract'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { cutOffAddress } from '../../../utils/string/cutOffAddress'
import { isValidBitcoinSignature } from '../../../utils/validation/isValidBitcoinSignature'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useContractContext } from '../context'
import { isTradeInformationGetter, tradeInformationGetters } from '../helpers'
import { tradeFields } from '../helpers/tradeInfoFields'
import { TradeInfoField } from '../helpers/tradeInformationGetters'
import { SummaryItem } from './SummaryItem'
import { usePatchReleaseAddress } from './usePatchReleaseAddress'

export const TradeDetails = () => {
  const { contract, paymentData, isDecryptionError, view } = useContractContext()
  const sections = getTradeInfoFields(contract, view)

  return (
    <View style={tw`justify-center gap-4 grow`}>
      {sections.map((fields: TradeInfoField[], index) => (
        <Fragment key={`section-${index}`}>
          <View style={tw`gap-2`}>
            {fields.map((fieldName, fieldIndex) => (
              <TradeDetailField fieldName={fieldName} key={`${fieldName}-${fieldIndex}`} />
            ))}
          </View>
          {index < sections.length - 1 && <HorizontalLine />}
        </Fragment>
      ))}

      {view === 'buyer' && (
        <>
          <HorizontalLine />
          <ChangePayoutWallet />
          {!contract.paymentConfirmed && <NetworkFee />}
        </>
      )}
      {!paymentData && isDecryptionError && (
        <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
      )}
    </View>
  )
}

function ChangePayoutWallet () {
  const { contract } = useContractContext()
  const paidToPeachWallet = useIsMyAddress(contract.releaseAddress)
  const offerId = getOfferIdFromContract(contract)

  const [payoutAddress, payoutAddressLabel, payoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.payoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { mutate } = usePatchReleaseAddress(offerId, contract.id)

  const navigation = useNavigation()

  const onPress = async () => {
    if (paidToPeachWallet === false) {
      const { address: releaseAddress, index } = await peachWallet.getAddress()

      const message = getMessageToSignForAddress(publicKey, releaseAddress)
      const messageSignature = peachWallet.signMessage(message, releaseAddress, index)

      mutate({ releaseAddress, messageSignature })
    } else {
      if (!payoutAddress) {
        navigation.navigate('patchPayoutAddress', { contractId: contract.id })
        return
      }
      const message = getMessageToSignForAddress(publicKey, payoutAddress)
      if (!payoutAddressSignature || !isValidBitcoinSignature(message, payoutAddress, payoutAddressSignature)) {
        navigation.navigate('signMessage', { contractId: contract.id })
      } else {
        mutate({ releaseAddress: payoutAddress, messageSignature: payoutAddressSignature })
      }
    }
  }

  const editCustomPayoutAddress
    = paidToPeachWallet || contract.paymentMade
      ? undefined
      : () => {
        navigation.navigate('patchPayoutAddress', { contractId: contract.id })
      }

  return (
    <>
      {!contract.paymentMade && (
        <SummaryItem
          label={i18n('contract.summary.payoutToPeachWallet')}
          value={<Toggle enabled={!!paidToPeachWallet} onPress={onPress} />}
        />
      )}
      {(!paidToPeachWallet || contract.paymentMade) && (
        <SummaryItem
          label={i18n('payout.wallet')}
          value={
            <SummaryItem.Text
              value={
                payoutAddress === contract.releaseAddress
                  ? payoutAddressLabel || cutOffAddress(payoutAddress)
                  : paidToPeachWallet
                    ? i18n('peachWallet')
                    : cutOffAddress(contract.releaseAddress)
              }
              onPress={editCustomPayoutAddress}
              copyValue={contract.releaseAddress}
              copyable
            />
          }
        />
      )}
    </>
  )
}

function NetworkFee () {
  const navigation = useNavigation()
  const { estimatedFees } = useFeeEstimate()
  const feeRate = useSettingsStore((state) => state.feeRate)
  const onPress = () => {
    navigation.navigate('networkFees')
  }

  const displayFeeRate = String(typeof feeRate === 'number' ? feeRate : estimatedFees[feeRate])

  return (
    <SummaryItem
      label={i18n('settings.networkFees')}
      value={
        <View style={tw`flex-row items-center justify-end flex-1 gap-10px`}>
          <PeachText style={[tw`flex-1 text-right subtitle-1`, tw`md:subtitle-0`]}>
            {i18n('settings.networkFees.xSatsPerByte', displayFeeRate)}
          </PeachText>
          <TouchableIcon id="bitcoin" onPress={onPress} iconColor={tw.color('primary-main')} />
        </View>
      }
    />
  )
}

function TradeDetailField ({ fieldName }: { fieldName: TradeInfoField }) {
  const { contract, view, paymentData } = useContractContext()

  const information = isTradeInformationGetter(fieldName)
    ? tradeInformationGetters[fieldName](contract)
    : paymentData?.[fieldName]

  if (!information) return null

  return (
    <SummaryItem
      label={i18n(`contract.summary.${fieldName}`)}
      value={
        typeof information === 'string' || typeof information === 'number' ? (
          <SummaryItem.Text
            value={String(information)}
            copyable={view === 'buyer' && !contract.releaseTxId && fieldName !== 'location'}
          />
        ) : (
          information
        )
      }
    />
  )
}

function getTradeInfoFields (
  { paymentMethod, releaseTxId, batchInfo }: Pick<Contract, 'paymentMethod' | 'releaseTxId' | 'batchInfo'>,
  view: ContractViewer,
) {
  const isTradeCompleted = !!releaseTxId || (!!batchInfo && !batchInfo.completed)
  if (view === 'seller') {
    return tradeFields.seller[isTradeCompleted ? 'past' : 'active'][isCashTrade(paymentMethod) ? 'cash' : 'default']
  }

  if (isTradeCompleted) {
    return tradeFields.buyer.past[isCashTrade(paymentMethod) ? 'cash' : 'default']
  }

  return isCashTrade(paymentMethod)
    ? tradeFields.buyer.active.cash
    : tradeFields.buyer.active.default[paymentMethod] || []
}
