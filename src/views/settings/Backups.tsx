import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useState } from 'react'
import z from 'zod'
import { Header } from '../../components/Header'
import { Screen } from '../../components/Screen'
import { useSetPopup } from '../../components/popup/Popup'
import { fullScreenTabNavigationScreenOptions } from '../../constants'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { BackupPasswordPrompt } from './components/backups/BackupPasswordPrompt'
import { FileBackupOverview } from './components/backups/FileBackupOverview'
import { SeedPhrase } from './components/backups/SeedPhrase'

const BackupTab = createMaterialTopTabNavigator()
const tabs = ['fileBackup', 'seedPhrase'] as const
const TabType = z.enum(tabs)
type TabType = z.infer<typeof TabType>

export const Backups = () => {
  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0])
  const [showPasswordPrompt, toggle] = useToggleBoolean()

  return (
    <Screen style={tw`px-0`} header={<BackupHeader tab={currentTab} showPasswordPrompt={showPasswordPrompt} />}>
      <BackupTab.Navigator
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
        screenListeners={{
          focus: (e) => setCurrentTab(TabType.parse(e.target?.split('-')[0])),
        }}
      >
        <>
          {tabs.map((tab) => (
            <BackupTab.Screen key={tab} name={tab} options={{ title: `${i18n(`settings.backups.${tab}`)}` }}>
              {() => (
                <>
                  {tab === 'fileBackup' ? (
                    showPasswordPrompt ? (
                      <BackupPasswordPrompt toggle={toggle} />
                    ) : (
                      <FileBackupOverview next={toggle} />
                    )
                  ) : (
                    <SeedPhrase />
                  )}
                </>
              )}
            </BackupTab.Screen>
          ))}
        </>
      </BackupTab.Navigator>
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
