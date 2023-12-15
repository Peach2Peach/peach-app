import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Toggle } from '../../../components/inputs'
import { ErrorBox, HorizontalLine } from '../../../components/ui'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useIsMyAddress } from '../../../hooks/wallet/useIsMyAddress'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import { useAccountStore } from '../../../utils/account/account'
import { getMessageToSignForAddress } from '../../../utils/account/getMessageToSignForAddress'
import { getOfferIdFromContract } from '../../../utils/contract/getOfferIdFromContract'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { peachAPI } from '../../../utils/peachAPI'
import { cutOffAddress } from '../../../utils/string/cutOffAddress'
import { isValidBitcoinSignature } from '../../../utils/validation/isValidBitcoinSignature'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useContractContext } from '../context'
import { isTradeInformationGetter, tradeInformationGetters } from '../helpers'
import { tradeFields } from '../helpers/tradeInfoFields'
import { TradeInfoField } from '../helpers/tradeInformationGetters'
import { SummaryItem } from './SummaryItem'

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
        </>
      )}
      {!paymentData && isDecryptionError && (
        <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
      )}
    </View>
  )
}

const usePatchReleaseAddress = (offerId: string, contractId: string) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async ({ releaseAddress }) => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousOfferData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      const previousContractData = queryClient.getQueryData<Contract>(['contract', contractId])
      queryClient.setQueryData(
        ['offer', offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) => oldQueryData && { ...oldQueryData, releaseAddress },
      )
      queryClient.setQueryData(
        ['contract', contractId],
        (oldQueryData: Contract | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            releaseAddress,
          },
      )

      return { previousOfferData, previousContractData }
    },
    mutationFn: async (newData: { releaseAddress: string; messageSignature: string }) => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['offer', offerId], context?.previousOfferData)
      queryClient.setQueryData(['contract', contractId], context?.previousContractData)
      showErrorBanner(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['offer', offerId])
      queryClient.invalidateQueries(['contract', contractId])
    },
  })
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
        navigation.navigate('payoutAddress', { type: 'payout' })
        return
      }
      const message = getMessageToSignForAddress(publicKey, payoutAddress)
      if (!payoutAddressSignature || !isValidBitcoinSignature(message, payoutAddress, payoutAddressSignature)) {
        navigation.navigate('signMessage')
      } else {
        mutate({ releaseAddress: payoutAddress, messageSignature: payoutAddressSignature })
      }
    }
  }

  const editCustomPayoutAddress
    = !payoutAddress || paidToPeachWallet || contract.paymentMade
      ? undefined
      : () => {
        navigation.navigate('payoutAddress', { type: 'payout' })
      }

  return (
    <>
      {!contract.paymentMade && (
        <SummaryItem
          label="pay out to peach wallet"
          value={<Toggle enabled={!!paidToPeachWallet} onPress={onPress} />}
        />
      )}
      {(!paidToPeachWallet || contract.paymentMade) && (
        <SummaryItem
          label="payout wallet"
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
