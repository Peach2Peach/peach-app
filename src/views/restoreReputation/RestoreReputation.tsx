import { View } from 'react-native'
import { PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ReputationRestored } from './ReputationRestored'
import { RestoreReputationLoading } from './RestoreReputationLoading'
import { useRestoreReputationSetup } from './hooks/useRestoreReputationSetup'

export const RestoreReputation = () => {
  const { restoreReputation, isLoading, isRestored } = useRestoreReputationSetup()

  if (isRestored) return <ReputationRestored />
  if (isLoading) return <RestoreReputationLoading />

  return (
    <View style={tw`justify-between h-full px-8`}>
      <View style={tw`flex items-center justify-center flex-shrink h-full`}>
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
