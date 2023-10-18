import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import tw from '../styles/tailwind'

export function WarningPopup (props: Omit<PopupComponentProps, 'bgColor' | 'actionBgColor'>) {
  return <PopupComponent {...props} bgColor={tw`bg-warning-background`} actionBgColor={tw`bg-warning-main`} />
}
