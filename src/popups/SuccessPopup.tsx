import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import tw from '../styles/tailwind'

export function SuccessPopup (props: Omit<PopupComponentProps, 'bgColor' | 'actionBgColor'>) {
  return <PopupComponent {...props} bgColor={tw`bg-success-background`} actionBgColor={tw`bg-success-main`} />
}
