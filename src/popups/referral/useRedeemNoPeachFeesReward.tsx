import { useCallback } from 'react'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { ClosePopupAction } from '../actions'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

export const useRedeemNoPeachFeesReward = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
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

  const redeemNoPeachFeesReward = useCallback(() => {
    setPopup(
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
      />,
    )
  }, [setPopup, redeem])

  return redeemNoPeachFeesReward
}
