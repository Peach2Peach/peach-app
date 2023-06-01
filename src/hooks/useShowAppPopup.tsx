import { useCallback } from 'react'
import { AppPopupId, appOverlays } from '../overlays/appOverlays'
import { usePopupStore } from '../store/usePopupStore'

export const useShowAppPopup = (id: AppPopupId) => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    const Content = appOverlays[id].content

    setPopup({
      title: appOverlays[id].title,
      content: Content ? <Content /> : undefined,
      visible: true,
      level: 'APP',
    })
  }, [id, setPopup])

  return showPopup
}
