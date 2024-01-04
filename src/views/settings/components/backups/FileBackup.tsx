import { View } from 'react-native'

import tw from '../../../../styles/tailwind'
import { BackupPasswordPrompt } from './BackupPasswordPrompt'
import { FileBackupOverview } from './FileBackupOverview'

type Props = {
  showPasswordPrompt: boolean
  toggle: () => void
}

export const FileBackup = ({ showPasswordPrompt, toggle }: Props) => (
  <View style={tw`grow`}>
    {showPasswordPrompt ? <BackupPasswordPrompt toggle={toggle} /> : <FileBackupOverview next={toggle} />}
  </View>
)
