import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { compatibilityCheck, linkToAppStore } from '../utils/system'
import { useMessageContext } from '../contexts/message'
import { APPVERSION } from '../constants'
import i18n from '../utils/i18n'
import { useEffect } from 'react'

export const useShowUpdateAvailable = () => {
  const [, updateMessage] = useMessageContext()
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
