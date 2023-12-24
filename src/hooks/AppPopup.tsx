import { PopupComponent } from '../components/popup/PopupComponent'
import { ClosePopupAction } from '../popups/actions/ClosePopupAction'
import { AppPopupId, appPopups } from '../popups/appPopups'
import tw from '../styles/tailwind'

export function AppPopup ({ id }: { id: AppPopupId }) {
  const Content = appPopups[id].content
  return (
    <PopupComponent
      title={appPopups[id].title}
      content={Content ? <Content /> : undefined}
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  )
}
