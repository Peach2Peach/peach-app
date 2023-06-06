import { useCallback } from 'react'
import { AppPopupId, appPopups } from '../popups/appPopups'
import { usePopupStore } from '../store/usePopupStore'

export const useShowAppPopup = (id: AppPopupId) => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    const Content = appPopups[id].content

    setPopup({
      title: appPopups[id].title,
      content: Content ? <Content /> : undefined,
      visible: true,
      level: 'APP',
    })
  }, [id, setPopup])

  return showPopup
}
