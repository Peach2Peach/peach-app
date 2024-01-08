import { useCallback } from 'react'
import { useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import { useNavigation } from '../../hooks/useNavigation'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'

export function RedeemNoPeachFeesPopup () {
  const setPopup = useSetPopup()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const redeem = useCallback(async () => {
    const { error: redeemError } = await peachAPI.private.user.redeemNoPeachFees()

    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    setPopup(
      <PopupComponent
        title={i18n('settings.referrals.noPeachFees.popup.title')}
        content={i18n('settings.referrals.noPeachFees.popup.success')}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
    navigation.replace('referrals')
  }, [navigation, setPopup, showErrorBanner])

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
            onPress={redeem}
            reverseOrder
          />
        </>
      }
    />
  )
}
