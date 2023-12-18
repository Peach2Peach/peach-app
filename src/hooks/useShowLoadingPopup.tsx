import { useCallback } from 'react'
import { Loading } from '../components/animation/Loading'
import { PopupAction } from '../components/popup'
import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

/**
 * @deprecated use LoadingPopupAction to indicate loading state
 */
export const useShowLoadingPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showLoadingPopup = useCallback(
    (props?: Partial<PopupComponentProps>) =>
      setPopup(
        <PopupComponent
          title={i18n('loading')}
          content={<Loading style={tw`self-center w-16 h-16`} color={tw.color('primary-main')} />}
          actions={<PopupAction label={i18n('loading')} iconId="clock" onPress={() => {}} />}
          {...props}
        />,
      ),
    [setPopup],
  )
  return showLoadingPopup
}
