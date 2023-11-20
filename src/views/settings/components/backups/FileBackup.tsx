import { View, ViewStyle } from 'react-native'

import { BackupPasswordPrompt } from './BackupPasswordPrompt'
import { FileBackupOverview } from './FileBackupOverview'

type Props = {
  style?: ViewStyle
  showPasswordPrompt: boolean
  toggle: () => void
}

export const FileBackup = ({ style, showPasswordPrompt, toggle }: Props) => (
  <View style={style}>
    {showPasswordPrompt ? <BackupPasswordPrompt toggle={toggle} /> : <FileBackupOverview next={toggle} />}
  </View>
)
