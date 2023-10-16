import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMessageState } from '../components/message/useMessageState'
import { APPVERSION } from '../constants'
import { useConfigStore } from '../store/configStore'
import i18n from '../utils/i18n'
import { compatibilityCheck, linkToAppStore } from '../utils/system'

export const useShowUpdateAvailable = () => {
  const updateMessage = useMessageState((state) => state.updateMessage)
  const [minAppVersion, latestAppVersion] = useConfigStore(
    (state) => [state.minAppVersion, state.latestAppVersion],
    shallow,
  )

  useEffect(() => {
    if (!compatibilityCheck(APPVERSION, minAppVersion)) return
    if (compatibilityCheck(APPVERSION, latestAppVersion)) return
    updateMessage({
      msgKey: 'UPDATE_AVAILABLE',
      level: 'WARN',
      keepAlive: true,
      action: {
        callback: linkToAppStore,
        label: i18n('download'),
        icon: 'download',
      },
    })
  }, [latestAppVersion, minAppVersion, updateMessage])

  useEffect(() => {
    if (compatibilityCheck(APPVERSION, minAppVersion)) return
    updateMessage({
      msgKey: 'CRITICAL_UPDATE_AVAILABLE',
      level: 'ERROR',
      keepAlive: true,
      action: {
        callback: linkToAppStore,
        label: i18n('download'),
        icon: 'download',
      },
    })
  }, [minAppVersion, updateMessage])
}
