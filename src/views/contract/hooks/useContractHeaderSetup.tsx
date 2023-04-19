import { useMemo } from 'react'
import { CancelIcon, HelpIcon } from '../../../components/icons'
import ContractTitle from '../../../components/titles/ContractTitle'
import { DisputeContractTitle } from '../../../components/titles/DisputeContractTitle'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { canCancelContract } from '../../../utils/contract'

export const useContractHeaderSetup = ({
  contract,
  view,
  requiredAction,
  contractId,
}: {
  contract: Contract | undefined
  view: ContractViewer | undefined
  requiredAction: ContractAction
  contractId: string
}) => {
  const { showConfirmOverlay } = useConfirmCancelTrade()
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  useHeaderSetup(
    useMemo(() => {
      const icons = []
      if (contract && canCancelContract(contract)) icons.push({
        iconComponent: <CancelIcon />,
        onPress: () => showConfirmOverlay(contract),
      })
      if (view === 'buyer' && requiredAction === 'sendPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showMakePaymentHelp,
      })
      if (view === 'seller' && requiredAction === 'confirmPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showConfirmPaymentHelp,
      })
      if (contract?.disputeActive) {
        return {
          titleComponent: <DisputeContractTitle id={contractId} />,
          icons: [],
        }
      }
      return {
        titleComponent: <ContractTitle id={contractId} />,
        icons,
      }
    }, [showConfirmOverlay, contract, requiredAction, contractId, showConfirmPaymentHelp, showMakePaymentHelp, view]),
  )
}
