import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'

import { useNavigation } from '../../hooks'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  err: string
}

export const RestoreBackupError = ({ err }: Props) => {
  useOnboardingHeader({ title: i18n('restoreBackup.title') })
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('contact')

  return (
    <View style={tw`justify-between h-full shrink`}>
      <View style={tw`items-center justify-center h-full shrink`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.title')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`items-center w-full mb-8`}>
        <PrimaryButton testID="restoreBackup-contactUs" onPress={goToContact} white narrow>
          {i18n('contactUs')}
        </PrimaryButton>
      </View>
    </View>
  )
}
