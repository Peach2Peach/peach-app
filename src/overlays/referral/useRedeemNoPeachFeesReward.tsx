import { useCallback } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import i18n from '../../utils/i18n'
import { redeemNoPeachFees } from '../../utils/peachAPI'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

export const useRedeemNoPeachFeesReward = () => {
  const [, updateOverlay] = useOverlayContext()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const redeem = useCallback(async () => {
    const [, redeemError] = await redeemNoPeachFees({})

    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    updateOverlay({
      title: i18n('settings.referrals.noPeachFees.popup.title'),
      content: <NoPeachFeesSuccess />,
      level: 'APP',
      visible: true,
    })
    navigation.replace('referrals')
  }, [navigation, showErrorBanner, updateOverlay])

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const redeemNoPeachFeesReward = useCallback(() => {
    updateOverlay({
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
        callback: closeOverlay,
      },
    })
  }, [updateOverlay, redeem, closeOverlay])

  return redeemNoPeachFeesReward
}
