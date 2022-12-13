import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import LanguageContext from '../../contexts/language'
import { useNavigation, useValidatedState } from '../../hooks'
import i18n from '../../utils/i18n'

const referralCodeRules = { referralCode: true }

export default (): ReactElement => {
  useContext(LanguageContext)
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

  return (
    <View style={tw`h-full flex flex-col justify-center items-center`}>
      <View>
        <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('welcome.letsGetStarted.title')}</Text>
        <Text style={tw`mt-4 text-primary-background-light text-center`}>{i18n('newUser.referralCode')}</Text>
        <View style={tw`flex items-center`}>
          <Input
            testID="newUser-referralCode"
            style={tw`w-40 mt-2`}
            theme="inverted"
            placeholder={i18n('form.optional')}
            onChange={setReferralCode}
            onSubmit={setReferralCode}
            value={referralCode}
            autoCapitalize="characters"
            errorMessage={displayErrors ? referralCodeErrors : undefined}
          />
        </View>
      </View>
      <View style={tw`flex items-stretch mt-4`}>
        <PrimaryButton testID="welcome-newUser" onPress={goToNewUser} white narrow iconId="plusCircle">
          {i18n('newUser')}
        </PrimaryButton>
        <PrimaryButton
          testID="welcome-restoreBackup"
          onPress={goToRestoreBackup}
          style={tw`mt-2`}
          iconId="save"
          white
          border
          narrow
        >
          {i18n('restore')}
        </PrimaryButton>
      </View>
    </View>
  )
}
