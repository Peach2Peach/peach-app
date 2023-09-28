import { useCallback } from 'react'
import { NodeConnectionErrorPopup } from '../../../../popups/warning/NodeConnectionErrorPopup'
import { usePopupStore } from '../../../../store/usePopupStore'

export const useShowNodeConnectionErrorPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(
    (error: string) => {
      setPopup(<NodeConnectionErrorPopup {...{ error }} />)
    },
    [setPopup],
  )
  return showPopup
}
