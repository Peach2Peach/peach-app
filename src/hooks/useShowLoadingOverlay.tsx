import { useCallback } from 'react'
import { Loading } from '../components'
import { useOverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const useShowLoadingOverlay = () => {
  const [, updateOverlay] = useOverlayContext()

  const showLoadingOverlay = useCallback(
    (options: Partial<OverlayState> = {}) =>
      updateOverlay({
        title: i18n('loading'),
        content: <Loading style={tw`self-center`} color={tw`text-black-1`.color} />,
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
    [updateOverlay],
  )
  return showLoadingOverlay
}
