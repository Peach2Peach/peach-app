import { useCallback } from 'react'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { AmountTooLow } from '../components/AmountTooLow'

export const useOpenAmountTooLowPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const openAmountTooLowPopup = useCallback(
    (available: number, needed: number) => {
      setPopup({
        title: i18n('fundFromPeachWallet.amountTooLow.title'),
        level: 'APP',
        content: <AmountTooLow {...{ available, needed }} />,
      })
    },
    [setPopup],
  )

  return openAmountTooLowPopup
}
