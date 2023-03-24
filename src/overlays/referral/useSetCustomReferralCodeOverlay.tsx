import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation, useValidatedState } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import i18n from '../../utils/i18n'
import { redeemReferralCode } from '../../utils/peachAPI'
import { SetCustomReferralCode } from './SetCustomReferralCode'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSucess'

export const useSetCustomReferralCodeOverlay = () => {
  const [, updateOverlay] = useOverlayContext()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [referralCodeTaken, setReferralCodeTaken] = useState(false)
  const referralCodeRules = useMemo(
    () => ({ required: true, referralCode: true, referralCodeTaken }),
    [referralCodeTaken],
  )

  const [referralCode, setReferralCode, referralCodeValid, referralCodeErrors, referralCodePristine]
    = useValidatedState<string>('', referralCodeRules)

  const updateReferralCode = useCallback(
    (code: string) => {
      setReferralCode(code)
      setReferralCodeTaken(false)
    },
    [setReferralCode],
  )

  const submitCustomReferralCode = useCallback(async () => {
    const [, redeemError] = await redeemReferralCode({ code: referralCode })

    if (redeemError?.error === 'ALREADY_TAKEN') {
      setReferralCodeTaken(true)
      return
    }
    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    updateOverlay({
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCodeSuccess {...{ referralCode }} />,
      level: 'APP',
      visible: true,
    })
    navigation.replace('referrals')
  }, [navigation, referralCode, showErrorBanner, updateOverlay])

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const setCustomReferralCodeOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCode {...{ referralCode, setReferralCode: updateReferralCode, referralCodeErrors }} />,
      level: 'APP',
      visible: true,
      action1: {
        label: i18n('settings.referrals.customReferralCode.popup.redeem'),
        icon: 'checkSquare',
        callback: submitCustomReferralCode,
        disabled: !referralCodeValid,
      },
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeOverlay,
      },
    })
  }, [
    updateOverlay,
    referralCode,
    updateReferralCode,
    referralCodeErrors,
    submitCustomReferralCode,
    referralCodeValid,
    closeOverlay,
  ])

  useEffect(() => {
    // This is not optimal but needed to update the content of the input field
    // should be tackled with issue #1154
    if (referralCodePristine) return
    setCustomReferralCodeOverlay()
  }, [referralCodePristine, setCustomReferralCodeOverlay])

  return {
    setCustomReferralCodeOverlay,
    closeOverlay,
    submitCustomReferralCode,
    referralCode,
    setReferralCode: updateReferralCode,
    referralCodeValid,
    referralCodeErrors,
  }
}
