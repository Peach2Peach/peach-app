import { View } from 'react-native'
import { Text } from '../../../../components'
import { Button } from '../../../../components/buttons/Button'
import { useSettingsStore } from '../../../../store/settingsStore'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'

type Props = { next: () => void }

export const FileBackupOverview = ({ next }: Props) => {
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)
  return (
    <View style={tw`items-center h-full`}>
      <Text style={tw`subtitle-1`}>{i18n('settings.backups.fileBackup.toRestore')}</Text>
      <View style={tw`items-center justify-center h-full shrink`}>
        {!!lastFileBackupDate && (
          <>
            <Text style={tw`h6`}>{i18n('settings.backups.fileBackup.lastBackup')}</Text>
            <Text style={tw`mt-2 mb-8`}>{toShortDateFormat(new Date(lastFileBackupDate), true)}</Text>
          </>
        )}
        <Button onPress={next} iconId="save">
          {i18n('settings.backups.fileBackup.createNew')}
        </Button>
      </View>
    </View>
  )
}
