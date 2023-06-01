import { useContext, useMemo } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { PopupContent } from './PopupContent'

export const Overlay = ({
  title,
  content,
  action1,
  action2,
  level = 'DEFAULT',
  visible,
  requireUserAction,
}: OverlayState) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closePopup = useMemo(() => () => updateOverlay({ visible: false }), [updateOverlay])

  return (
    <PopupContent
      {...{ visible, title, content, action1, action2, closePopup, level, requireUserAction }}
    ></PopupContent>
  )
}
