import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Button, Input, PeachScrollView, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useNavigation, useValidatedState } from '../../hooks'

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

  return (
    <PeachScrollView contentContainerStyle={tw`flex flex-col justify-between`}>
      <View>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n('welcome.letsGetStarted.title')}
        </Text>
        <Text style={tw`mt-4 font-lato text-grey-3 text-center`}>{i18n('newUser.referralCode')}</Text>
        <View style={tw`flex items-center`}>
          <Input
            testID="newUser-referralCode"
            style={tw`w-40 mt-4`}
            placeholder={i18n('form.optional')}
            onChange={setReferralCode}
            onSubmit={(val: string) => {
              setReferralCode(val)
            }}
            value={referralCode}
            autoCapitalize="characters"
            isValid={referralCodeIsValid}
            errorMessage={displayErrors ? referralCodeErrors : undefined}
          />
        </View>
      </View>
      <View style={tw`flex items-center`}>
        <Button style={tw`mt-4`} testID="welcome-newUser" onPress={goToNewUser} wide={false} title={i18n('newUser')} />
        <Button
          testID="welcome-restoreBackup"
          style={tw`mt-2`}
          onPress={() => navigation.navigate('restoreBackup', {})}
          wide={false}
          secondary={true}
          title={i18n('restoreBackup')}
        />
      </View>
    </PeachScrollView>
  )
}
