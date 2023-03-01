import { useState } from 'react'
import { useNavigation, useValidatedState } from '../../../hooks'

const referralCodeRules = { referralCode: true }

export const useNewUserSetup = () => {
  const navigation = useNavigation()
  const [referralCode, setReferralCode, referralCodeIsValid, referralCodeErrors] = useValidatedState<string>(
    '',
    referralCodeRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const validate = () => {
    setDisplayErrors(true)
    return referralCodeIsValid
  }

  const goToNewUser = () => {
    if (validate()) navigation.navigate('newUser', { referralCode })
  }
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return { referralCode, setReferralCode, referralCodeErrors, displayErrors, goToNewUser, goToRestoreBackup }
}
