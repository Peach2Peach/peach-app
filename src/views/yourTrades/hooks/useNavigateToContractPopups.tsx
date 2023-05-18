import { useDisputeEmailPopup } from './useDisputeEmailPopup'
import { useDisputeWonPopup } from '../../../overlays/dispute/hooks/useDisputeWonPopup'

export const useNavigateToContractPopups = (id: string) => {
  const showDisputeEmailPopup = useDisputeEmailPopup(id)
  const showDisputeWonPopup = useDisputeWonPopup(id)

  const showContractPopup = () => {
    showDisputeEmailPopup()
    showDisputeWonPopup()
  }

  return showContractPopup
}
