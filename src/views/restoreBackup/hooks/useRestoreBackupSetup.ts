import { useState } from 'react'
import { TabbedNavigationItem } from '../../../components/navigation/TabbedNavigation'
import { useRoute } from '../../../hooks'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import i18n from '../../../utils/i18n'
import { getTabById } from '../../yourTrades/utils/getTabById'

export const tabs: TabbedNavigationItem[] = [
  { id: 'fileBackup', display: i18n('settings.backups.fileBackup') },
  { id: 'seedPhrase', display: i18n('settings.backups.seedPhrase') },
]
export const useRestoreBackupSetup = () => {
  const route = useRoute<'restoreBackup'>()
  const { tab = 'fileBackup' } = route.params || {}

  useOnboardingHeader({ title: i18n('restoreBackup.title') })
  const [currentTab, setCurrentTab] = useState(getTabById(tabs, tab) || tabs[0])
  return { tabs, currentTab, setCurrentTab }
}
