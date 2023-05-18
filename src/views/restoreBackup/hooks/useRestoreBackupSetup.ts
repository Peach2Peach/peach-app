import { useState } from 'react'
import { TabbedNavigationItem } from '../../../components/navigation/TabbedNavigation'
import { useRoute } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { useBackupHeader } from './useBackupHeader'
import { getTabById } from '../../yourTrades/utils/getTabById'

export const useRestoreBackupSetup = () => {
  const route = useRoute<'yourTrades'>()
  const tabs: TabbedNavigationItem[] = [
    { id: 'fileBackup', display: i18n('settings.backups.fileBackup') },
    { id: 'seedPhrase', display: i18n('settings.backups.seedPhrase') },
  ]
  const { tab = 'fileBackup' } = route.params || {}

  useBackupHeader()
  const [currentTab, setCurrentTab] = useState(getTabById(tabs, tab) || tabs[0])
  return { tabs, currentTab, setCurrentTab }
}
