import { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { showHelp } from '../overlays/showHelp'

export const useShowHelp = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showHelpContextualized = useCallback((i: HelpType) => {
    showHelp(updateOverlay, i, navigation)
  }, [])

  return showHelpContextualized
}
