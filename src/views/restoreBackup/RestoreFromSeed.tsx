import { View } from 'react-native'
import { PeachScrollView, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { RestoreBackupError } from './RestoreBackupError'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { RestoreSuccess } from './RestoreSuccess'
import { SeedPhraseInput } from './SeedPhraseInput'
import { useRestoreFromSeedSetup } from './hooks/useRestoreFromSeedSetup'

export const RestoreFromSeed = () => {
  const { restored, error, loading, setWords, allWordsAreSet, isMnemonicValid, submit } = useRestoreFromSeedSetup()

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />
  return (
    <View style={tw`flex-1 gap-4`}>
      <PeachScrollView contentContainerStyle={tw`py-4`} contentStyle={tw`gap-4`}>
        <Text style={tw`text-center text-primary-background-light`}>
          {i18n('restoreBackup.seedPhrase.useBackupFile')}
        </Text>
        <Text style={tw`text-center subtitle-1 text-primary-background-light`}>
          {i18n('restoreBackup.seedPhrase.enter')}
        </Text>
        <View style={tw`flex-row gap-4`}>
          <View style={tw`flex-1`}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
            ))}
          </View>
          <View style={tw`flex-1`}>
            {[6, 7, 8, 9, 10, 11].map((index) => (
              <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
            ))}
          </View>
        </View>
        {allWordsAreSet && !isMnemonicValid && (
          <Text style={[tw`text-center tooltip text-primary-background-light`]}>{i18n('form.bip39.error')}</Text>
        )}
      </PeachScrollView>
      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw`text-primary-main`}
        disabled={!isMnemonicValid}
        iconId="save"
        onPress={submit}
      >
        {i18n('restoreBackup')}
      </Button>
    </View>
  )
}
