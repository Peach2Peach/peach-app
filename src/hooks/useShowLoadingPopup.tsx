import { useCallback } from 'react'
import { Loading } from '../components'
import { PopupState, usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const useShowLoadingPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showLoadingPopup = useCallback(
    (options: Partial<PopupState> = {}) =>
      setPopup({
        title: i18n('loading'),
        content: <Loading style={tw`w-16 h-16 self-center`} color={tw.color('primary-main')} />,
        visible: true,
        level: 'APP',
        requireUserAction: true,
        action1: {
          label: i18n('loading'),
          icon: 'clock',
          callback: () => {},
        },
        ...options,
      }),
    [setPopup],
  )
  return showLoadingPopup
}
