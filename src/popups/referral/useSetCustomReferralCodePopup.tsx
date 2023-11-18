import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation, useValidatedState } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { redeemReferralCode } from '../../utils/peachAPI'
import { SetCustomReferralCode } from './SetCustomReferralCode'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSuccess'

export const useSetCustomReferralCodePopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [referralCodeTaken, setReferralCodeTaken] = useState(false)
  const referralCodeRules = useMemo(
    () => ({ required: true, referralCode: true, referralCodeTaken }),
    [referralCodeTaken],
  )

  const [referralCodePristine, setReferralCodePristine] = useState(true)
  const [referralCode, setReferralCode, referralCodeValid, referralCodeErrors] = useValidatedState<string>(
    '',
    referralCodeRules,
  )

  const updateReferralCode = useCallback(
    (code: string) => {
      setReferralCode(code)
      setReferralCodeTaken(false)
      setReferralCodePristine(false)
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
    setPopup({
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCodeSuccess {...{ referralCode }} />,
      level: 'APP',
      visible: true,
    })
    navigation.replace('referrals')
  }, [navigation, referralCode, showErrorBanner, setPopup])

  const setCustomReferralCodePopup = useCallback(() => {
    setPopup({
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
        callback: closePopup,
      },
    })
  }, [
    setPopup,
    referralCode,
    updateReferralCode,
    referralCodeErrors,
    submitCustomReferralCode,
    referralCodeValid,
    closePopup,
  ])

  useEffect(() => {
    // This is not optimal but needed to update the content of the input field
    // should be tackled with issue #1154
    if (referralCodePristine) return
    setCustomReferralCodePopup()
  }, [referralCodePristine, setCustomReferralCodePopup])

  return {
    setCustomReferralCodePopup,
    closePopup,
    submitCustomReferralCode,
    referralCode,
    setReferralCode: updateReferralCode,
    referralCodeValid,
    referralCodeErrors,
  }
}
