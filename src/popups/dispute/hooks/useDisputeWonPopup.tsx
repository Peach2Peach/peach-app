import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { queryClient } from '../../../queryClient'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { account } from '../../../utils/account'
import { contractIdToHex, saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { shouldShowDisputeResult } from '../../../utils/popup'
import { DisputeWon } from '../components/DisputeWon'

export const useDisputeWonPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const updateContract = useLocalContractStore((state) => state.updateContract)

  const showDisputeWonPopup = async (contractId: string) => {
    const { result: contract } = await peachAPI.private.contract.getContract({ contractId })
    if (!contract || !shouldShowDisputeResult(contract)) return
    queryClient.setQueryData(['contract', contractId], contract)
    const view = contract.buyer.id === account.publicKey ? 'buyer' : 'seller'
    if (contract.disputeWinner !== view) return
    const saveAcknowledgement = () => {
      saveContract({
        ...contract,
        disputeResolvedDate: new Date(),
      })
      updateContract(contract.id, {
        disputeResultAcknowledged: true,
        cancelConfirmationDismissed: view === 'buyer',
      })
      closePopup()
    }

    const goToChat = () => {
      saveAcknowledgement()
      navigation.navigate('contractChat', { contractId: contract.id })
    }

    const tradeId = contractIdToHex(contract.id)
    setPopup({
      title: i18n('dispute.won'),
      level: 'SUCCESS',
      content: <DisputeWon tradeId={tradeId} />,
      visible: true,
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: saveAcknowledgement,
      },
      action1: {
        label: i18n('goToChat'),
        icon: 'messageCircle',
        callback: goToChat,
      },
    })
  }
  return showDisputeWonPopup
}
