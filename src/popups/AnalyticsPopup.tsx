import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useClosePopup } from '../components/popup/Popup'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useSettingsStore } from '../store/settingsStore'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export function AnalyticsPopup () {
  const closePopup = useClosePopup()
  const setEnableAnalytics = useSettingsStore((state) => state.setEnableAnalytics, shallow)

  const accept = useCallback(() => {
    setEnableAnalytics(true)
    closePopup()
  }, [setEnableAnalytics, closePopup])

  const deny = useCallback(() => {
    setEnableAnalytics(false)
    closePopup()
  }, [setEnableAnalytics, closePopup])

  return (
    <PopupComponent
      title={i18n('analytics.request.title')}
      content={<AnalyticsPrompt />}
      actions={
        <>
          <PopupAction label={i18n('analytics.request.no')} iconId="xSquare" onPress={deny} />
          <PopupAction label={i18n('analytics.request.yes')} iconId="checkSquare" onPress={accept} reverseOrder />
        </>
      }
    />
  )
}
