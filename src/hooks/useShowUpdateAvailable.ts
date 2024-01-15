import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useSetToast } from '../components/toast/Toast'
import { APPVERSION, BUILDNUMBER } from '../constants'
import { useConfigStore } from '../store/configStore/configStore'
import i18n from '../utils/i18n'
import { compatibilityCheck } from '../utils/system/compatibilityCheck'
import { linkToAppStore } from '../utils/system/linkToAppStore'

export const useShowUpdateAvailable = () => {
  const setToast = useSetToast()
  const [minAppVersion, latestAppVersion] = useConfigStore(
    (state) => [state.minAppVersion, state.latestAppVersion],
    shallow,
  )

  useEffect(() => {
    if (!compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, minAppVersion)) return
    if (compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, latestAppVersion)) return
    setToast({
      msgKey: 'UPDATE_AVAILABLE',
      level: 'WARN',
      keepAlive: true,
      action: {
        callback: linkToAppStore,
        label: i18n('download'),
        icon: 'download',
      },
    })
  }, [latestAppVersion, minAppVersion, setToast])

  useEffect(() => {
    if (compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, minAppVersion)) return
    setToast({
      msgKey: 'CRITICAL_UPDATE_AVAILABLE',
      level: 'ERROR',
      keepAlive: true,
      action: {
        callback: linkToAppStore,
        label: i18n('download'),
        icon: 'download',
      },
    })
  }, [minAppVersion, setToast])
}
