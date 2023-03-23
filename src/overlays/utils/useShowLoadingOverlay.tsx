import React, { useCallback, useContext } from 'react'
import { Loading } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const useShowLoadingOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const showLoadingOverlay = useCallback(
    (title: string) =>
      updateOverlay({
        title,
        content: <Loading style={tw`self-center`} color={tw`text-black-1`.color} />,
        visible: true,
        level: 'WARN',
        requireUserAction: true,
        action1: {
          label: i18n('loading'),
          icon: 'clock',
          callback: () => {},
        },
      }),
    [updateOverlay],
  )
  return showLoadingOverlay
}
