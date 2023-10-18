import { shallow } from 'zustand/shallow'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useToggleBatching } from '../../../hooks/user'
import { TurnOffBatching } from '../../../popups/app/TurnOffBatching'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'

export const useTransactionBatchingSetup = () => {
  const { user, isLoading } = useSelfUser()
  const { mutate } = useToggleBatching(user || { isBatchingEnabled: false })
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const contracts = useTradeSummaryStore((state) => state.contracts)
  const toggleBatching = () => {
    const hasPendingPayouts = contracts.some((contract) => contract.tradeStatus === 'payoutPending')
    if (user?.isBatchingEnabled && hasPendingPayouts) {
      setPopup({
        title: i18n('settings.batching.turnOff.title'),
        content: <TurnOffBatching />,
        level: 'APP',
        action2: {
          callback: closePopup,
          icon: 'xCircle',
          label: i18n('settings.batching.turnOff.no'),
        },
        action1: {
          callback: () => {
            mutate()
            closePopup()
          },
          icon: 'arrowRightCircle',
          label: i18n('settings.batching.turnOff.yes'),
        },
      })
    } else {
      mutate()
    }
  }

  return {
    isLoading,
    isBatchingEnabled: !!user?.isBatchingEnabled,
    toggleBatching,
  }
}
