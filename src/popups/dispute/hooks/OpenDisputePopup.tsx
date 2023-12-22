import { useCallback } from 'react'
import { useClosePopup } from '../../../components/popup/Popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { useNavigation } from '../../../hooks/useNavigation'
import i18n from '../../../utils/i18n'
import { WarningPopup } from '../../WarningPopup'
import { ClosePopupAction } from '../../actions/ClosePopupAction'
import { OpenDispute } from '../components/OpenDispute'

export function OpenDisputePopup ({ contractId }: { contractId: string }) {
  const navigation = useNavigation()
  const closePopup = useClosePopup()

  const ok = useCallback(() => {
    closePopup()
    navigation.navigate('disputeReasonSelector', { contractId })
  }, [closePopup, contractId, navigation])

  return (
    <WarningPopup
      title={i18n('dispute.openDispute')}
      content={<OpenDispute />}
      actions={
        <>
          <PopupAction label={i18n('dispute.openDispute')} iconId="alertOctagon" onPress={ok} />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  )
}
