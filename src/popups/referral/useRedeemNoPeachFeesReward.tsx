import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

export const useRedeemNoPeachFeesReward = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const redeem = useCallback(async () => {
    const { error: redeemError } = await peachAPI.private.user.redeemNoPeachFees()

    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    setPopup({
      title: i18n('settings.referrals.noPeachFees.popup.title'),
      content: <NoPeachFeesSuccess />,
      level: 'APP',
      visible: true,
    })
    navigation.replace('referrals')
  }, [navigation, setPopup, showErrorBanner])

  const redeemNoPeachFeesReward = useCallback(() => {
    setPopup({
      title: i18n('settings.referrals.noPeachFees.popup.title'),
      content: <NoPeachFees />,
      level: 'APP',
      visible: true,
      action1: {
        label: i18n('settings.referrals.noPeachFees.popup.redeem'),
        icon: 'checkSquare',
        callback: redeem,
      },
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closePopup,
      },
    })
  }, [setPopup, redeem, closePopup])

  return redeemNoPeachFeesReward
}
