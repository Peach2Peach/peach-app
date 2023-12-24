import { useState } from 'react'
import { Header } from '../../components/Header'
import { Screen } from '../../components/Screen'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import { useSetPopup } from '../../components/popup/Popup'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { FileBackup } from './components/backups/FileBackup'
import { SeedPhrase } from './components/backups/SeedPhrase'

export const Backups = () => {
  const tabs: TabbedNavigationItem<'fileBackup' | 'seedPhrase'>[] = [
    { id: 'fileBackup', display: i18n('settings.backups.fileBackup') },
    { id: 'seedPhrase', display: i18n('settings.backups.seedPhrase') },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [showPasswordPrompt, toggle] = useToggleBoolean()

  return (
    <Screen header={<BackupHeader tab={currentTab.id} showPasswordPrompt={showPasswordPrompt} />}>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      {currentTab.id === 'fileBackup' ? (
        <FileBackup showPasswordPrompt={showPasswordPrompt} toggle={toggle} />
      ) : (
        <SeedPhrase />
      )}
    </Screen>
  )
}

function BackupHeader ({ tab, showPasswordPrompt }: { tab: 'fileBackup' | 'seedPhrase'; showPasswordPrompt?: boolean }) {
  const setPopup = useSetPopup()
  const showSeedPhrasePopup = () => setPopup(<HelpPopup id="seedPhrase" />)
  const showFileBackupPopup = () => setPopup(<HelpPopup id="fileBackup" />)
  const showYourPasswordPopup = () => setPopup(<HelpPopup id="yourPassword" />)

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
