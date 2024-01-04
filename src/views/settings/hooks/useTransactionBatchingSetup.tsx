import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
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
      setPopup(
        <PopupComponent
          title={i18n('settings.batching.turnOff.title')}
          content={<TurnOffBatching />}
          actions={
            <>
              <PopupAction label={i18n('settings.batching.turnOff.no')} iconId="xCircle" onPress={closePopup} />
              <PopupAction
                label={i18n('settings.batching.turnOff.yes')}
                iconId="arrowRightCircle"
                onPress={() => {
                  mutate()
                  closePopup()
                }}
                reverseOrder
              />
            </>
          }
        />,
      )
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
