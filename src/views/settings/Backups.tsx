import { useState } from 'react'

import { Screen } from '../../components'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { FileBackup } from './components/backups/FileBackup'
import { SeedPhrase } from './components/backups/SeedPhrase'

export const Backups = () => {
  const tabs: TabbedNavigationItem[] = [
    { id: 'fileBackup', display: i18n('settings.backups.fileBackup'), view: FileBackup },
    { id: 'seedPhrase', display: i18n('settings.backups.seedPhrase'), view: SeedPhrase },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const CurrentView = currentTab.view

  return (
    <Screen>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      {!!CurrentView && <CurrentView style={tw`pt-4 shrink`} />}
    </Screen>
  )
}
