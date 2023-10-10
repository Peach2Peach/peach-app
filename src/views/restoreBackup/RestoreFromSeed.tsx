import { View } from 'react-native'
import { Fade, PeachScrollView, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { RestoreBackupError } from './RestoreBackupError'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { RestoreSuccess } from './RestoreSuccess'
import { SeedPhraseInput } from './SeedPhraseInput'
import { useRestoreFromSeedSetup } from './hooks/useRestoreFromSeedSetup'

export const RestoreFromSeed = ({ style }: ComponentProps) => {
  const { restored, error, loading, setWords, allWordsAreSet, isMnemonicValid, submit } = useRestoreFromSeedSetup()
  const keyboardOpen = useKeyboard()

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />
  return (
    <View style={[tw`px-6`, style]}>
      <View style={tw`h-full pb-8`}>
        <PeachScrollView style={tw`flex-shrink h-full`}>
          <Text style={tw`mt-3 text-center text-primary-background-light`}>
            {i18n('restoreBackup.seedPhrase.useBackupFile')}
          </Text>
          <Text style={tw`mt-6 text-center subtitle-1 text-primary-background-light`}>
            {i18n('restoreBackup.seedPhrase.enter')}
          </Text>
          <View style={tw`flex flex-row px-6 mt-4`}>
            <View style={tw`w-1/2 pr-2`}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
              ))}
            </View>
            <View style={tw`w-1/2 pl-2`}>
              {[6, 7, 8, 9, 10, 11].map((index) => (
                <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
              ))}
            </View>
          </View>
          {allWordsAreSet && !isMnemonicValid && (
            <Text style={[tw`mt-2 text-center tooltip text-primary-background-light`]}>{i18n('form.bip39.error')}</Text>
          )}
        </PeachScrollView>
        <Fade show={!keyboardOpen} style={tw`flex items-center`}>
          <PrimaryButton onPress={submit} disabled={!isMnemonicValid} white iconId="save">
            {i18n('restoreBackup')}
          </PrimaryButton>
        </Fade>
      </View>
    </View>
  )
}
