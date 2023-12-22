import { useCallback } from 'react'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { ErrorPopup } from '../../ErrorPopup'
import { ClosePopupAction } from '../../actions/ClosePopupAction'
import { DisputeRaisedSuccess } from '../components/DisputeRaisedSuccess'

export const useDisputeRaisedSuccess = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showDisputeRaisedSuccess = useCallback(
    (view: ContractViewer) => {
      setPopup(
        <ErrorPopup
          title={i18n('dispute.opened')}
          content={<DisputeRaisedSuccess view={view} />}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      )
    },
    [setPopup],
  )
  return showDisputeRaisedSuccess
}
