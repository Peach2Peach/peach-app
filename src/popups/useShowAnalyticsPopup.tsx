import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useSettingsStore } from '../store/settingsStore'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export const useShowAnalyticsPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [setAnalyticsPopupSeen, setEnableAnalytics] = useSettingsStore(
    (state) => [state.setAnalyticsPopupSeen, state.setEnableAnalytics],
    shallow,
  )

  const accept = useCallback(() => {
    setEnableAnalytics(true)
    closePopup()
  }, [setEnableAnalytics, closePopup])

  const deny = useCallback(() => {
    setEnableAnalytics(false)
    closePopup()
  }, [setEnableAnalytics, closePopup])

  const showAnalyticsPrompt = useCallback(() => {
    setAnalyticsPopupSeen(true)
    setPopup(
      <PopupComponent
        title={i18n('analytics.request.title')}
        content={<AnalyticsPrompt />}
        actions={
          <>
            <PopupAction label={i18n('analytics.request.no')} iconId="xSquare" onPress={deny} />
            <PopupAction label={i18n('analytics.request.yes')} iconId="checkSquare" onPress={accept} reverseOrder />
          </>
        }
      />,
    )
  }, [accept, deny, setAnalyticsPopupSeen, setPopup])

  return showAnalyticsPrompt
}
