import { ReactElement, useState } from 'react'

import { View } from 'react-native'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useBackupHeader } from './useBackupHeader'
import RestoreFromFile from './RestoreFromFile'
import RestoreFromSeed from './RestoreFromSeed'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'fileBackup',
    display: i18n('settings.backups.fileBackup'),
    view: RestoreFromFile,
  },
  {
    id: 'seedPhrase',
    display: i18n('settings.backups.seedPhrase'),
    view: RestoreFromSeed,
  },
]
export default (): ReactElement => {
  useBackupHeader()
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const CurrentView = currentTab.view

  return (
    <View style={tw`h-full`}>
      <View style={tw`flex flex-col h-full pt-5`}>
        <TabbedNavigation theme="inverted" items={tabs} selected={currentTab} select={setCurrentTab} />
        {!!CurrentView && <CurrentView style={tw`flex-shrink h-full`} />}
      </View>
    </View>
  )
}
