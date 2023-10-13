import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import tw from '../styles/tailwind'
import { ClosePopupAction, HelpPopupAction } from './actions'

export function InfoPopup (props: Pick<PopupComponentProps, 'title' | 'content'>) {
  return (
    <PopupComponent
      {...props}
      actions={
        <>
          <HelpPopupAction />
          <ClosePopupAction reverseOrder />
        </>
      }
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
    />
  )
}
