import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'

import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useCreateAccountErrorHeader } from './hooks/useCreateAccountErrorHeader'

type CreateAccountErrorProps = {
  err: string
}

export const CreateAccountError = ({ err }: CreateAccountErrorProps) => {
  useCreateAccountErrorHeader()
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('contact')
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return (
    <View style={tw`flex justify-between h-full`}>
      <View style={tw`flex items-center justify-center flex-shrink h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.create')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`flex flex-col items-center w-full mb-8`}>
        <PrimaryButton testID="createAccount-contactUs" onPress={goToContact} white narrow>
          {i18n('contactUs')}
        </PrimaryButton>
        <PrimaryButton
          testID="createAccount-restoreBackup"
          onPress={goToRestoreBackup}
          style={tw`mt-2`}
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
