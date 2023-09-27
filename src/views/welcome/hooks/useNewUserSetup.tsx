import { useContext, useState } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { peachAPI } from '../../../utils/peachAPI'

const referralCodeRules = { referralCode: true }

export const useNewUserSetup = () => {
  const [, updateMessage] = useContext(MessageContext)

  const route = useRoute<'welcome'>()
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [referralCode, setReferralCode, referralCodeIsValid] = useValidatedState(
    route.params?.referralCode || '',
    referralCodeRules,
  )
  const [willUseReferralCode, setWillUseReferralCode] = useState(!!route.params?.referralCode)

  const updateReferralCode = (code: string) => {
    if (referralCode !== code) setWillUseReferralCode(false)
    setReferralCode(code)
  }

  const checkReferralCode = async (code: string) => {
    setWillUseReferralCode(false)
    const { result, error } = await peachAPI.public.user.checkReferralCode({ code })
    if (!result || error) return showError(error?.error)
    setWillUseReferralCode(result.valid)
    return updateMessage({
      msgKey: result.valid ? 'referrals.myFavoriteCode' : 'referrals.codeNotFound',
      level: 'DEFAULT',
    })
  }

  const goToNewUser = () => {
    navigation.navigate('newUser', { referralCode: willUseReferralCode ? referralCode : undefined })
  }
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return {
    referralCode,
    setReferralCode: updateReferralCode,
    referralCodeIsValid,
    checkReferralCode,
    willUseReferralCode,
    goToNewUser,
    goToRestoreBackup,
  }
}
