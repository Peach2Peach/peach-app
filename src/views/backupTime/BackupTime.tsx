import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, PrimaryButton, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useBackupTimeSetup } from './hooks/useBackupTimeSetup'

export default () => {
  const { goToBackups, skip, view, isMandatory } = useBackupTimeSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('backupTime.title')}</Text>
        <View style={tw`flex-row items-center justify-center mt-8`}>
          <Icon id="saveCircleInverted" style={tw`w-16 h-16 mr-6`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`max-w-[200px] body-l text-primary-background-light`}>
            {i18n(`backupTime.description.${isMandatory ? 'mandatory' : 'optional'}`)}
          </Text>
        </View>
      </View>
      <View style={tw`items-center`}>
        {isMandatory && (
          <View style={tw`absolute items-center mb-2 bottom-full`}>
            <Text style={tw`text-center text-primary-background-light`}>
              {i18n(`backupTime.mandatoryDisclaimer.${view}`)}
            </Text>
            <Icon id="chevronsDown" style={tw`w-6 h-6 mt-1`} color={tw`text-primary-background-light`.color} />
          </View>
        )}
        <PrimaryButton white onPress={goToBackups}>
          {i18n('backupTime.makeABackup')}
        </PrimaryButton>
        {!isMandatory && (
          <PrimaryButton style={tw`mt-3`} white border onPress={skip}>
            {i18n('backupTime.skipForNow')}
          </PrimaryButton>
        )}
      </View>
    </View>
  )
}
