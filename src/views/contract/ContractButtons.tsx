import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { EmailInput } from '../../components/inputs'
import { useNavigation, useRoute, useShowHelp, useValidatedState } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { WarningPopup } from '../../popups/WarningPopup'
import { ClosePopupAction } from '../../popups/actions'
import { LoadingPopupAction } from '../../popups/actions/LoadingPopupAction'
import { useSubmitDisputeAcknowledgement } from '../../popups/dispute/hooks/useSubmitDisputeAcknowledgement'
import { useConfigStore } from '../../store/configStore/configStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { contractIdToHex, getNavigationDestinationForContract, getOfferIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getContract, getOfferDetails } from '../../utils/peachAPI'
import { thousands } from '../../utils/string'
import { getNavigationDestinationForOffer } from '../yourTrades/utils'
import { useContractContext } from './context'

export function NewOfferButton () {
  const navigation = useNavigation()
  const { contract } = useContractContext()
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const newOfferId = offer?.newOfferId
  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const [newOffer] = await getOfferDetails({ offerId: newOfferId })
    if (!newOffer) return
    if (newOffer?.contractId) {
      const [newContract] = await getContract({ contractId: newOffer.contractId })
      if (newContract === null) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
    }
  }, [newOfferId, navigation])

  return <Button onPress={goToNewOffer}>{i18n('contract.goToNewTrade')}</Button>
}

export function PayoutPendingButton () {
  const { showBatchInfo, toggleShowBatchInfo } = useContractContext()

  return (
    <Button style={tw`self-center`} iconId="eye" onPress={toggleShowBatchInfo}>
      {i18n(showBatchInfo ? 'contract.summary.tradeDetails' : 'offer.requiredAction.payoutPending')}
    </Button>
  )
}
export function ProvideEmailButton () {
  const setPopup = usePopupStore((state) => state.setPopup)
  const { contract, view } = useContractContext()
  const onPress = () => setPopup(<DisputeRaisedPopup contract={contract} view={view} />)

  return (
    <Button style={tw`bg-error-main`} onPress={onPress} iconId="alertCircle">
      {i18n('contract.provideEmail')}
    </Button>
  )
}
const emailRules = { required: true, email: true }
function DisputeRaisedPopup ({ contract, view }: { contract: Contract; view: ContractViewer }) {
  const { id, disputeReason, amount } = contract
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement()
  const [email, setEmail, , emailErrors] = useValidatedState<string>('', emailRules)
  const submit = () => {
    submitDisputeAcknowledgement({
      contractId: id,
      disputeReason: disputeReason || 'other',
      email,
    })
  }
  return (
    <WarningPopup
      title={i18n('dispute.opened')}
      content={
        <View style={tw`gap-4`}>
          <Text>
            {i18n(`dispute.opened.counterparty.text.1.withEmail.${view}`, contractIdToHex(id), thousands(amount))}
          </Text>

          <Text>{i18n('dispute.opened.counterparty.text.2.withEmail')}</Text>

          <View>
            <EmailInput
              style={tw`bg-warning-background`}
              onChange={setEmail}
              onSubmit={submit}
              value={email}
              errorMessage={emailErrors}
            />
          </View>
        </View>
      }
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-1`} />
          <LoadingPopupAction
            label={i18n('send')}
            iconId="arrowRightCircle"
            onPress={submit}
            reverseOrder
            textStyle={tw`text-black-1`}
          />
        </>
      }
    />
  )
}

export function ChatButton () {
  const {
    contract: { unreadMessages, id },
  } = useContractContext()
  const navigation = useNavigation()
  const showHelp = useShowHelp('disputeDisclaimer')
  const [seenDisputeDisclaimer, setSeenDisputeDisclaimer] = useConfigStore(
    (state) => [state.seenDisputeDisclaimer, state.setSeenDisputeDisclaimer],
    shallow,
  )
  const { contractId } = useRoute<'contract'>().params
  const queryClient = useQueryClient()
  const goToChat = () => {
    queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
      if (!oldQueryData) return oldQueryData
      return {
        ...oldQueryData,
        unreadMessages: 0,
      }
    })
    navigation.push('contractChat', { contractId: id })
    if (!seenDisputeDisclaimer) {
      showHelp()
      setSeenDisputeDisclaimer(true)
    }
  }
  return (
    <Button style={tw`flex-1`} iconId={unreadMessages === 0 ? 'messageCircle' : 'messageFull'} onPress={goToChat}>
      {unreadMessages === 0 ? i18n('chat') : `${unreadMessages} ${i18n('contract.unread')}`}
    </Button>
  )
}
