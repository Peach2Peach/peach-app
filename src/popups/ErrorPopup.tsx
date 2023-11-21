import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import tw from '../styles/tailwind'

export function ErrorPopup (props: Omit<PopupComponentProps, 'bgColor' | 'actionBgColor'>) {
  return <PopupComponent {...props} bgColor={tw`bg-error-background`} actionBgColor={tw`bg-error-main`} />
}
