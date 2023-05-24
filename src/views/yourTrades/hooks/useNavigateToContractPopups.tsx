import { useDisputeEmailPopup } from './useDisputeEmailPopup'
import { useDisputeWonPopup } from '../../../overlays/dispute/hooks/useDisputeWonPopup'
import { useLocalContractStore } from '../../../store/useLocalContractStore'

export const useNavigateToContractPopups = (id: string) => {
  const showDisputeEmailPopup = useDisputeEmailPopup(id)
  const showDisputeWonPopup = useDisputeWonPopup()
  const contract = useLocalContractStore((state) => state.contracts[id])

  const showContractPopup = () => {
    showDisputeEmailPopup()
    if (!contract?.disputeResultAcknowledged) showDisputeWonPopup(id)
  }

  return showContractPopup
}
