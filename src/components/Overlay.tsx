import { ReactElement, useContext, useEffect, useMemo } from 'react'
import { BackHandler } from 'react-native'
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

  useEffect(() => {
    if (!content) return () => {}
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closeOverlay()
      return true
    })
    return () => {
      backHandler.remove()
    }
  }, [closeOverlay, content])

  return (
    <PopupContent
      {...{ visible, title, content, action1, action2, closeOverlay, level, requireUserAction }}
    ></PopupContent>
  )
}
