import { useCallback } from 'react'
import { useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { useNavigation } from '../../hooks/useNavigation'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { ClosePopupAction } from '../actions/ClosePopupAction'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

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
        content={<NoPeachFeesSuccess />}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
    navigation.replace('referrals')
  }, [navigation, setPopup, showErrorBanner])

  return (
    <PopupComponent
      title={i18n('settings.referrals.noPeachFees.popup.title')}
      content={<NoPeachFees />}
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
