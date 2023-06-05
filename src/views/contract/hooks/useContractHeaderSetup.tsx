import { useMemo } from 'react'
import { ContractTitle } from '../../../components/titles/ContractTitle'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmCancelTrade } from '../../../popups/tradeCancelation/useConfirmCancelTrade'
import { canCancelContract } from '../../../utils/contract'
import { headerIcons } from '../../../utils/layout/headerIcons'

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
  const { showConfirmPopup } = useConfirmCancelTrade()
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  useHeaderSetup(
    useMemo(() => {
      const icons = []
      if (contract && canCancelContract(contract)) icons.push({
        ...headerIcons.cancel,
        onPress: () => showConfirmPopup(contract),
      })
      if (view === 'buyer' && requiredAction === 'sendPayment') icons.push({
        ...headerIcons.help,
        onPress: showMakePaymentHelp,
      })
      if (view === 'seller' && requiredAction === 'confirmPayment') icons.push({
        ...headerIcons.help,
        onPress: showConfirmPaymentHelp,
      })
      return {
        titleComponent: <ContractTitle id={contractId} />,
        icons: contract?.disputeActive ? [] : icons,
      }
    }, [showConfirmPopup, contract, requiredAction, contractId, showConfirmPaymentHelp, showMakePaymentHelp, view]),
  )
}
