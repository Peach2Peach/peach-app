import { shallow } from 'zustand/shallow'
import { useDisputeRaisedNotice } from '../../../popups/dispute/hooks/useDisputeRaisedNotice'
import { queryClient } from '../../../queryClient'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { account } from '../../../utils/account'
import { getContractViewer } from '../../../utils/contract'
import { peachAPI } from '../../../utils/peachAPI'

export const useDisputeEmailPopup = (contractId: string) => {
  const [hasSeenEmailPopup, setHasSeenEmailPopup] = useLocalContractStore(
    (state) => [!!state.contracts[contractId]?.hasSeenDisputeEmailPopup, state.setHasSeenDisputeEmailPopup],
    shallow,
  )
  const { showDisputeRaisedNotice } = useDisputeRaisedNotice()

  const showDisputeEmailPopup = async () => {
    const { result: contract } = await peachAPI.private.contract.getContract({ contractId })
    if (hasSeenEmailPopup || !contract?.disputeActive || account.publicKey === contract?.disputeInitiator) return
    queryClient.setQueryData(['contract', contractId], { ...contract, hasSeenDisputeEmailPopup: true })
    setHasSeenEmailPopup(contractId)
    showDisputeRaisedNotice(contract, getContractViewer(contract.seller.id))
  }

  return showDisputeEmailPopup
}
