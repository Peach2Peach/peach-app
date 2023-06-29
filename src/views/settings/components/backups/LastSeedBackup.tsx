import { View } from 'react-native'

import { Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useSettingsStore } from '../../../../store/useSettingsStore'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'

type Props = { goBackToStart: () => void }

export const LastSeedBackup = ({ goBackToStart }: Props) => {
  const lastSeedBackupDate = useSettingsStore((state) => state.lastSeedBackupDate)
  return (
    <View style={tw`items-center`}>
      <Text style={tw`h6`}>{i18n('settings.backups.seedPhrase.lastBackup')}</Text>
      {!!lastSeedBackupDate && <Text style={tw`mt-2`}>{toShortDateFormat(new Date(lastSeedBackupDate), true)}</Text>}
      <PrimaryButton wide onPress={goBackToStart} style={tw`mt-10`} iconId="rotateCounterClockwise">
        {i18n('settings.backups.seedPhrase.checkWords')}
      </PrimaryButton>
    </View>
  )
}
