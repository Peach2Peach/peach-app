import { View } from 'react-native'
import { Button } from '../../../../components/buttons/Button'
import { PeachText } from '../../../../components/text/PeachText'
import { useSettingsStore } from '../../../../store/settingsStore'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date/toShortDateFormat'
import i18n from '../../../../utils/i18n'

type Props = { next: () => void }

export const FileBackupOverview = ({ next }: Props) => {
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)
  return (
    <View style={tw`items-center h-full`}>
      <PeachText style={tw`subtitle-1`}>{i18n('settings.backups.fileBackup.toRestore')}</PeachText>
      <View style={tw`items-center justify-center h-full shrink`}>
        {!!lastFileBackupDate && (
          <>
            <PeachText style={tw`h6`}>{i18n('settings.backups.fileBackup.lastBackup')}</PeachText>
            <PeachText style={tw`mt-2 mb-8`}>{toShortDateFormat(new Date(lastFileBackupDate), true)}</PeachText>
          </>
        )}
        <Button onPress={next} iconId="save">
          {i18n('settings.backups.fileBackup.createNew')}
        </Button>
      </View>
    </View>
  )
}
