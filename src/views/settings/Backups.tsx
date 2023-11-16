import { useState } from 'react'

import { Header, Screen } from '../../components'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import { useShowHelp, useToggleBoolean } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { FileBackup } from './components/backups/FileBackup'
import { SeedPhrase } from './components/backups/SeedPhrase'

export const Backups = () => {
  const tabs: TabbedNavigationItem<'fileBackup' | 'seedPhrase'>[] = [
    { id: 'fileBackup' as const, display: i18n('settings.backups.fileBackup'), view: FileBackup },
    { id: 'seedPhrase' as const, display: i18n('settings.backups.seedPhrase'), view: SeedPhrase },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [showPasswordPrompt, toggle] = useToggleBoolean()
  const CurrentView = currentTab.view

  return (
    <Screen header={<BackupHeader tab={currentTab.id} showPasswordPrompt={showPasswordPrompt} />}>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      {currentTab.id === 'fileBackup' ? (
        <FileBackup showPasswordPrompt={showPasswordPrompt} toggle={toggle} />
      ) : (
        <SeedPhrase />
      )}
      {!!CurrentView && <CurrentView style={tw`pt-4 shrink`} />}
    </Screen>
  )
}

function BackupHeader ({ tab, showPasswordPrompt }: { tab: 'fileBackup' | 'seedPhrase'; showPasswordPrompt?: boolean }) {
  const showSeedPhrasePopup = useShowHelp('seedPhrase')
  const showFileBackupPopup = useShowHelp('fileBackup')
  const showYourPasswordPopup = useShowHelp('yourPassword')

  return (
    <Header
      title={tab === 'fileBackup' ? i18n('settings.backups.fileBackup.title') : i18n('settings.backups.walletBackup')}
      icons={[
        {
          ...headerIcons.help,
          onPress:
            tab === 'fileBackup'
              ? showPasswordPrompt
                ? showYourPasswordPopup
                : showFileBackupPopup
              : showSeedPhrasePopup,
        },
      ]}
    />
  )
}
