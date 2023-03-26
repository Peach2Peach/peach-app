import { ReactElement } from 'react'
import { View } from 'react-native'

import { Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'

type Props = { goBackToStart: () => void }

export const LastSeedBackup = ({ goBackToStart }: Props): ReactElement => (
  <View style={tw`items-center`}>
    <Text style={tw`h6`}>{i18n('settings.backups.seedPhrase.lastBackup')}</Text>
    {!!account.settings.lastSeedBackupDate && (
      <Text style={tw`mt-2`}>{toShortDateFormat(new Date(account.settings.lastSeedBackupDate), true)}</Text>
    )}
    <PrimaryButton wide onPress={goBackToStart} style={tw`mt-10`} iconId="rotateCounterClockwise">
      {i18n('settings.backups.seedPhrase.checkWords')}
    </PrimaryButton>
  </View>
)
