import { View } from 'react-native'

import { useToggleBoolean } from '../../../../hooks'
import BackupPasswordPrompt from './BackupPasswordPrompt'
import { FileBackupOverview } from './FileBackupOverview'

export default ({ style }: ComponentProps) => {
  const [showPasswordPrompt, toggle] = useToggleBoolean()

  return (
    <View style={style}>
      {showPasswordPrompt ? <BackupPasswordPrompt toggle={toggle} /> : <FileBackupOverview next={toggle} />}
    </View>
  )
}
