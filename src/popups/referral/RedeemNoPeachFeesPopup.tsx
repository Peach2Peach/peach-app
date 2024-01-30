import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import i18n from '../../utils/i18n'
import { useRedeemNoPeachFees } from './useRedeemNoPeachFees'

export function RedeemNoPeachFeesPopup () {
  const { mutate: redeem } = useRedeemNoPeachFees()

  return (
    <PopupComponent
      title={i18n('settings.referrals.noPeachFees.popup.title')}
      content={i18n('settings.referrals.noPeachFees.popup.text')}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={i18n('settings.referrals.noPeachFees.popup.redeem')}
            iconId="checkSquare"
            onPress={() => redeem()}
            reverseOrder
          />
        </>
      }
    />
  )
}
