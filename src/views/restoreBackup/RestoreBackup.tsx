import { useState } from 'react'
import { Screen } from '../../components'
import { Header, HeaderIcon } from '../../components/Header'
import { useDrawerState } from '../../components/drawer/useDrawerState'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import { useNavigation, useRoute } from '../../hooks'
import { useLanguage } from '../../hooks/useLanguage'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { RestoreFromFile } from './RestoreFromFile'
import { RestoreFromSeed } from './RestoreFromSeed'

const tabContent: Record<string, () => JSX.Element> = {
  fileBackup: RestoreFromFile,
  seedPhrase: RestoreFromSeed,
}

const tabs: TabbedNavigationItem<'fileBackup' | 'seedPhrase'>[] = [
  { id: 'fileBackup', display: i18n('settings.backups.fileBackup') },
  { id: 'seedPhrase', display: i18n('settings.backups.seedPhrase') },
]

const getTabById = <T extends string>(items: TabbedNavigationItem<T>[], id: T) => items.find((t) => t.id === id)

export const RestoreBackup = () => {
  const { tab = 'fileBackup' } = useRoute<'restoreBackup'>().params || {}
  const [currentTab, setCurrentTab] = useState(getTabById(tabs, tab) || tabs[0])
  const CurrentView = tabContent[currentTab.id]

  return (
    <Screen header={<OnboardingHeader />} gradientBackground>
      <TabbedNavigation theme="inverted" items={tabs} selected={currentTab} select={setCurrentTab} />
      <CurrentView />
    </Screen>
  )
}

function OnboardingHeader () {
  const navigation = useNavigation()
  const updateDrawer = useDrawerState((state) => state.updateDrawer)
  const { locale, updateLocale } = useLanguage()

  const openLanguageDrawer = () => {
    updateDrawer({
      title: i18n('language.select'),
      options: i18n.getLocales().map((l) => ({
        title: i18n(`languageName.${l}`),
        onPress: () => {
          updateLocale(l)
          updateDrawer({ show: false })
        },
        iconRightID: l === locale ? 'check' : undefined,
      })),
      show: true,
    })
  }
  const headerIcons: HeaderIcon[] = [
    { id: 'mail', color: tw`text-primary-background-light`.color, onPress: () => navigation.navigate('contact') },
    { id: 'globe', color: tw`text-primary-background-light`.color, onPress: openLanguageDrawer },
  ]
  return <Header title={i18n('restoreBackup.title')} icons={headerIcons} theme="transparent" />
}
