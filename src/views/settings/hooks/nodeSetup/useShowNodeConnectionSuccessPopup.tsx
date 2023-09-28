import { useCallback } from 'react'
import { NodeConnectionSuccessPopup } from '../../../../popups/success/NodeConnectionSuccessPopup'
import { usePopupStore } from '../../../../store/usePopupStore'

type Props = {
  address: string
  save: () => void
}
export const useShowNodeConnectionSuccessPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const openPopup = useCallback(
    ({ address, save }: Props) => {
      setPopup(<NodeConnectionSuccessPopup {...{ address, save }} />)
    },
    [setPopup],
  )
  return openPopup
}
