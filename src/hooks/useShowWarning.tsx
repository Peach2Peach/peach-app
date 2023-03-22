import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useWarningOverlay, WarningType } from '../overlays/warningOverlays'
import i18n from '../utils/i18n'

export const useShowWarning = (id: WarningType) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const warningOverlay = useWarningOverlay(id)
  const closeOverlay = () => {
    updateOverlay({
      visible: false,
    })
  }
  const showWarning = useCallback(() => {
    const Content = warningOverlay.content

    updateOverlay({
      title: warningOverlay.title,
      content: <Content />,
      visible: true,
      action2: {
        callback: closeOverlay,
        label: i18n('close'),
        icon: 'xSquare',
      },
      action1: warningOverlay.action,
      level: 'WARN',
    })
  }, [warningOverlay])

  return showWarning
}
