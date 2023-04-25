import { shallow } from 'zustand/shallow'
import { useContractDetails } from '../../../hooks/query/useContractDetails'
import { useDisputeRaisedNotice } from '../../../overlays/dispute/hooks/useDisputeRaisedNotice'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { account } from '../../../utils/account'
import { getContractViewer } from '../../../utils/contract'

export const useDisputeEmailPopup = (contractId: string) => {
  const [hasSeenEmailPopup, setHasSeenEmailPopup] = useLocalContractStore(
    (state) => [!!state.contracts[contractId]?.hasSeenDisputeEmailPopup, state.setHasSeenDisputeEmailPopup],
    shallow,
  )
  const { contract } = useContractDetails(contractId)
  const { showDisputeRaisedNotice } = useDisputeRaisedNotice()

  const showDisputeEmailPopup = () => {
    if (hasSeenEmailPopup || !contract?.disputeActive) return
    setHasSeenEmailPopup(contractId)
    showDisputeRaisedNotice(contract, getContractViewer(contract, account))
  }

  return showDisputeEmailPopup
}
