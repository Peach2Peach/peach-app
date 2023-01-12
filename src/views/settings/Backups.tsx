import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Title } from '../../components'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import MakingABackup from '../../overlays/info/MakingABackup'
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
  const CurrentView = currentTab.view!

  return (
    <View style={tw`flex items-stretch h-full px-6 pt-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} help={<MakingABackup />} />
      <TabbedNavigation style={tw`mt-4`} items={tabs} selected={currentTab} select={setCurrentTab} />
      <View style={tw`flex-shrink mt-4`}>
        <CurrentView />
      </View>
    </View>
  )
}
