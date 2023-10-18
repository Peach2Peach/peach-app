import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useKeyboard } from '../../hooks'
import i18n from '../../utils/i18n'
import { useNewUserSetup } from './hooks/useNewUserSetup'

export const LetsGetStarted = () => {
  const {
    referralCode,
    setReferralCode,
    referralCodeIsValid,
    checkReferralCode,
    willUseReferralCode,
    goToNewUser,
    goToRestoreBackup,
  } = useNewUserSetup()
  const keyboardOpen = useKeyboard()
  const checkCode = () => checkReferralCode(referralCode)
  return (
    <View style={tw`items-center justify-between h-full`}>
      <View>{/* dummy for layout */}</View>
      <View>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('welcome.letsGetStarted.title')}</Text>
        <Text style={tw`mt-4 text-center text-primary-background-light`}>{i18n('newUser.referralCode')}</Text>
        <View style={tw`flex-row items-center justify-center`}>
          <View style={tw`mr-2 h-14`}>
            <Input
              testID="newUser-referralCode"
              style={tw`w-40 mt-2`}
              theme="inverted"
              maxLength={16}
              placeholder={i18n('form.optional').toUpperCase()}
              onChange={setReferralCode}
              onSubmit={setReferralCode}
              value={referralCode}
              autoCapitalize="characters"
            />
          </View>
          <PrimaryButton
            white
            disabled={willUseReferralCode || !referralCode || !referralCodeIsValid}
            onPress={checkCode}
            style={tw`w-20`}
          >
            {i18n(willUseReferralCode ? 'referrals.used' : 'referrals.use')}
          </PrimaryButton>
        </View>
      </View>
      <View style={[tw`flex items-stretch mt-4`, keyboardOpen ? tw`mb-4` : {}]}>
        <PrimaryButton testID="welcome-newUser" onPress={goToNewUser} white narrow iconId="plusCircle">
          {i18n('newUser')}
        </PrimaryButton>
        {!keyboardOpen && (
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
        )}
      </View>
    </View>
  )
}
