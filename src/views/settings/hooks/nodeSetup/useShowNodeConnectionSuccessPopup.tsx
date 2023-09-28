import { useCallback } from 'react'
import { NodeConnectionSuccessPopup } from '../../../../popups/success/NodeConnectionSuccessPopup'
import { usePopupStore } from '../../../../store/usePopupStore'

type Props = {
  url: string
  save: () => void
}
export const useShowNodeConnectionSuccessPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const openPopup = useCallback(
    ({ url, save }: Props) => {
      setPopup(<NodeConnectionSuccessPopup {...{ url, save }} />)
    },
    [setPopup],
  )
  return openPopup
}
