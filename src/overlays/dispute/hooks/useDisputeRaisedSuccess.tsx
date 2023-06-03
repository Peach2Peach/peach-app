import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { DisputeRaisedSuccess } from '../components/DisputeRaisedSuccess'

export const useDisputeRaisedSuccess = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showDisputeRaisedSuccess = useCallback(
    (view: ContractViewer) => {
      setPopup({
        title: i18n('dispute.opened'),
        level: 'ERROR',
        content: <DisputeRaisedSuccess view={view} />,
        visible: true,
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: closePopup,
        },
      })
    },
    [setPopup, closePopup],
  )
  return showDisputeRaisedSuccess
}
