import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import i18n from '../../utils/i18n'
import FileBackup from './components/backups/FileBackup'
import SeedPhrase from './components/backups/SeedPhrase'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'fileBackup',
    display: i18n('settings.backups.fileBackup'),
    view: FileBackup,
  },
  {
    id: 'seedPhrase',
    display: i18n('settings.backups.seedPhrase'),
    view: SeedPhrase,
  },
]

export default (): ReactElement => {
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const CurrentView = currentTab.view

  return (
    <View style={tw`h-full`}>
      <TabbedNavigation style={tw`mt-4`} items={tabs} selected={currentTab} select={setCurrentTab} />
      <View style={tw`mt-6 flex-shrink`}>{!!CurrentView && <CurrentView />}</View>
    </View>
  )
}
