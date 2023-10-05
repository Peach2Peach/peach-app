import { View } from 'react-native'
import { TabbedNavigation } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import { RestoreFromFile } from './RestoreFromFile'
import { RestoreFromSeed } from './RestoreFromSeed'
import { useRestoreBackupSetup } from './hooks/useRestoreBackupSetup'

const tabContent: Record<string, (props: ComponentProps) => JSX.Element> = {
  fileBackup: RestoreFromFile,
  seedPhrase: RestoreFromSeed,
}

export const RestoreBackup = () => {
  const { tabs, currentTab, setCurrentTab } = useRestoreBackupSetup()
  const CurrentView = tabContent[currentTab.id]

  return (
    <View style={tw`h-full`}>
      <View style={tw`h-full pt-5`}>
        <TabbedNavigation theme="inverted" items={tabs} selected={currentTab} select={setCurrentTab} />
        <CurrentView style={tw`h-full shrink`} />
      </View>
    </View>
  )
}
