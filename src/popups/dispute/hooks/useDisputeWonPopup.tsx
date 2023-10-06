import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { queryClient } from '../../../queryClient'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { account } from '../../../utils/account'
import { contractIdToHex, saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getContract } from '../../../utils/peachAPI'
import { DisputeWon } from '../components/DisputeWon'

export const useDisputeWonPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const updateContract = useLocalContractStore((state) => state.updateContract)

  const showDisputeWonPopup = async (contractId: string) => {
    const [contract] = await getContract({ contractId })
    if (!contract || contract.disputeActive || !contract.disputeResolvedDate) return
    queryClient.setQueryData(['contract', contractId], contract)
    const view = contract.buyer.id === account.publicKey ? 'buyer' : 'seller'
    if (contract.disputeWinner !== view) return
    const saveAcknowledgeMent = () => {
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
      saveAcknowledgeMent()
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
        callback: saveAcknowledgeMent,
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
