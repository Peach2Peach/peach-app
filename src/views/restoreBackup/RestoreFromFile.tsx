import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { FileInput, Input, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import i18n from '../../utils/i18n'
import { useRestoreFromFileSetup } from './hooks/useRestoreFromFileSetup'
import { RestoreBackupError } from './RestoreBackupError'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { RestoreSuccess } from './RestoreSuccess'

export const RestoreFromFile = ({ style }: ComponentProps) => {
  const { restored, error, loading, file, setFile, password, setPassword, passwordError, submit }
    = useRestoreFromFileSetup()

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />

  return (
    <View style={[tw`px-6`, style]}>
      <View style={tw`flex flex-col justify-between flex-shrink h-full`}>
        <View style={tw`flex flex-col justify-center flex-shrink w-full h-full`}>
          <Text style={tw`mt-4 text-center subtitle-1 text-primary-background-light`}>
            {i18n('restoreBackup.manual.description.1')}
          </Text>
          <View style={tw`w-full px-2 mt-2`}>
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
        <View style={tw`flex items-center pb-8`}>
          <PrimaryButton onPress={submit} disabled={!file.content || !password} white iconId="save">
            {i18n('restoreBackup')}
          </PrimaryButton>
        </View>
      </View>
    </View>
  )
}
