import { View } from 'react-native'

import { Text } from '../../../../components'
import { Button } from '../../../../components/buttons/Button'
import { useSettingsStore } from '../../../../store/settingsStore'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date/toShortDateFormat'
import i18n from '../../../../utils/i18n'

type Props = { goBackToStart: () => void }

export const LastSeedBackup = ({ goBackToStart }: Props) => {
  const lastSeedBackupDate = useSettingsStore((state) => state.lastSeedBackupDate)
  return (
    <View style={tw`items-center gap-10`}>
      <View style={tw`items-center gap-2`}>
        <Text style={tw`h6`}>{i18n('settings.backups.seedPhrase.lastBackup')}</Text>
        {!!lastSeedBackupDate && <Text>{toShortDateFormat(new Date(lastSeedBackupDate), true)}</Text>}
      </View>
      <Button onPress={goBackToStart} iconId="rotateCounterClockwise">
        {i18n('settings.backups.seedPhrase.checkWords')}
      </Button>
    </View>
  )
}
