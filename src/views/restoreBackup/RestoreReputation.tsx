import { View } from 'react-native'
import { PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useRestoreReputationSetup } from './hooks/useRestoreReputationSetup'
import { ReputationRestored } from './ReputationRestored'

export default () => {
  const { restoreReputation, isRestored } = useRestoreReputationSetup()

  if (isRestored) return <ReputationRestored />

  return (
    <View style={tw`flex justify-between h-full px-8`}>
      <View style={tw`flex items-center justify-center h-full flex-shrink`}>
        <Text style={tw`subtitle-1 text-primary-background-light`}>{i18n('restoreBackup.dontWorry')}</Text>
      </View>
      <View style={tw`flex flex-col items-center w-full mb-8`}>
        <PrimaryButton testID="createAccount-restoreReputation" onPress={restoreReputation} white iconId="save">
          {i18n('restoreBackup.restoreReputation')}
        </PrimaryButton>
      </View>
    </View>
  )
}
