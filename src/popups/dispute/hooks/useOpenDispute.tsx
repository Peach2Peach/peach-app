import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { OpenDispute } from '../components/OpenDispute'

export const useOpenDispute = (contractId: string) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const ok = useCallback(() => {
    closePopup()
    navigation.navigate('disputeReasonSelector', { contractId })
  }, [closePopup, contractId, navigation])

  const showOpenDisputePopup = useCallback(() => {
    setPopup({
      title: i18n('dispute.openDispute'),
      level: 'WARN',
      content: <OpenDispute />,
      visible: true,
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closePopup,
      },
      action2: {
        label: i18n('dispute.openDispute'),
        icon: 'alertOctagon',
        callback: ok,
      },
    })
  }, [setPopup, closePopup, ok])

  return showOpenDisputePopup
}
