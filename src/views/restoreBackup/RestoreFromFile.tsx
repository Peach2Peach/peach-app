import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { FileInput, Input, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import i18n from '../../utils/i18n'
import { RestoreBackupError } from './RestoreBackupError'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { RestoreSuccess } from './RestoreSuccess'
import { useRestoreFromFileSetup } from './hooks/useRestoreFromFileSetup'

export const RestoreFromFile = () => {
  const { restored, error, loading, file, setFile, password, setPassword, passwordError, submit }
    = useRestoreFromFileSetup()

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />

  return (
    <View style={tw`justify-between shrink`}>
      <View style={tw`justify-center h-full shrink`}>
        <Text style={tw`pb-2 text-center subtitle-1 text-primary-background-light`}>
          {i18n('restoreBackup.manual.description.1')}
        </Text>
        <View style={tw`w-full px-2`}>
          <FileInput fileName={file.name} onChange={setFile} />
        </View>
        <View style={tw`px-2`}>
          <Input
            theme="inverted"
            onChange={setPassword}
            onSubmit={(val: string) => {
              setPassword(val)
              if (file.name) submit()
            }}
            secureTextEntry={true}
            placeholder={i18n('restoreBackup.decrypt.password')}
            value={password}
            errorMessage={passwordError}
          />
        </View>
      </View>

      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw`text-primary-main`}
        disabled={!file.content || !password}
        iconId="save"
        onPress={submit}
      >
        {i18n('restoreBackup')}
      </Button>
    </View>
  )
}
