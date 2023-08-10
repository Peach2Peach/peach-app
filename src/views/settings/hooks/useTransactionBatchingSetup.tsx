import { shallow } from 'zustand/shallow'
import { useHeaderSetup } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useToggleBatching } from '../../../hooks/user'
import { TurnOffBatching } from '../../../popups/app/TurnOffBatching'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'

export const useTransactionBatchingSetup = () => {
  const { user, isLoading } = useSelfUser()
  const { mutate } = useToggleBatching(user || { isBatchingEnabled: false })
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const toggleBatching = () => {
    if (user?.isBatchingEnabled) {
      setPopup({
        title: i18n('settings.batching.turnOff.title'),
        content: <TurnOffBatching />,
        level: 'APP',
        action2: {
          callback: closePopup,
          icon: 'xCircle',
          label: 'no, wait',
        },
        action1: {
          callback: () => {
            mutate()
            closePopup()
          },
          icon: 'arrowRightCircle',
          label: 'yes, pay out',
        },
      })
    } else {
      mutate()
    }
  }
  useHeaderSetup(i18n('settings.transactionBatching'))

  return {
    isLoading,
    isBatchingEnabled: !!user?.isBatchingEnabled,
    toggleBatching,
  }
}
