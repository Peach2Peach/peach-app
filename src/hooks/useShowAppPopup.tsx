import { useCallback } from 'react'
import { PopupComponent } from '../components/popup/PopupComponent'
import { ClosePopupAction } from '../popups/actions/ClosePopupAction'
import { AppPopupId, appPopups } from '../popups/appPopups'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'

export const useShowAppPopup = (id: AppPopupId) => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    const Content = appPopups[id].content

    setPopup(
      <PopupComponent
        title={appPopups[id].title}
        content={Content ? <Content /> : undefined}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  }, [id, setPopup])

  return showPopup
}
