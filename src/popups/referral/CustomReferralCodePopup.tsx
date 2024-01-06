import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { Input } from '../../components/inputs/Input'
import { useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { PeachText } from '../../components/text/PeachText'
import { useNavigation } from '../../hooks/useNavigation'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useValidatedState } from '../../hooks/useValidatedState'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { getMessages } from '../../utils/validation/getMessages'
import { ClosePopupAction } from '../actions/ClosePopupAction'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSuccess'

const referralCodeRules = {
  required: true,
  referralCode: true,
}
export function CustomReferralCodePopup () {
  const setPopup = useSetPopup()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [referralCodeTaken, setReferralCodeTaken] = useState(false)

  const [referralCode, setReferralCode, isValidReferralCode, inputErrors] = useValidatedState<string>(
    '',
    referralCodeRules,
  )

  const referralCodeValid = useMemo(
    () => isValidReferralCode && !referralCodeTaken,
    [isValidReferralCode, referralCodeTaken],
  )
  const referralCodeErrors = useMemo(() => {
    let errs = inputErrors
    if (referralCodeTaken) {
      errs = [...errs, getMessages().referralCodeTaken]
    }
    return errs
  }, [inputErrors, referralCodeTaken])

  const updateReferralCode = useCallback(
    (code: string) => {
      setReferralCode(code)
      setReferralCodeTaken(false)
    },
    [setReferralCode],
  )

  const submitCustomReferralCode = useCallback(async () => {
    const { error: redeemError } = await peachAPI.private.user.redeemReferralCode({ code: referralCode })

    if (redeemError?.error === 'ALREADY_TAKEN') {
      setReferralCodeTaken(true)
      return
    }
    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    setPopup(
      <PopupComponent
        title={i18n('settings.referrals.customReferralCode.popup.title')}
        content={<SetCustomReferralCodeSuccess {...{ referralCode }} />}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
    navigation.replace('referrals')
  }, [navigation, referralCode, showErrorBanner, setPopup])

  return (
    <PopupComponent
      title={i18n('settings.referrals.customReferralCode.popup.title')}
      content={
        <View style={tw`gap-3`}>
          <PeachText>{i18n('settings.referrals.customReferralCode.popup.text')}</PeachText>
          <Input
            style={tw`bg-primary-background-dark`}
            placeholder={i18n('form.referral.placeholder')}
            value={referralCode}
            onChangeText={updateReferralCode}
            autoCapitalize="characters"
            errorMessage={referralCodeErrors}
          />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={i18n('settings.referrals.customReferralCode.popup.redeem')}
            iconId="checkSquare"
            onPress={submitCustomReferralCode}
            disabled={!referralCodeValid}
            reverseOrder
          />
        </>
      }
    />
  )
}
