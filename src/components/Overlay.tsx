import { ReactElement, useContext, useMemo } from 'react'
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
}: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = useMemo(() => () => updateOverlay({ visible: false }), [updateOverlay])

  return (
    <PopupContent
      {...{ visible, title, content, action1, action2, closeOverlay, level, requireUserAction }}
    ></PopupContent>
  )
}
