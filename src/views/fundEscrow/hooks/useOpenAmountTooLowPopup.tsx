import { useCallback } from 'react'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../../popups/actions/ClosePopupAction'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { AmountTooLow } from '../components/AmountTooLow'

export const useOpenAmountTooLowPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const openAmountTooLowPopup = useCallback(
    (available: number, needed: number) => {
      setPopup(
        <PopupComponent
          title={i18n('fundFromPeachWallet.amountTooLow.title')}
          content={<AmountTooLow {...{ available, needed }} />}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      )
    },
    [setPopup],
  )

  return openAmountTooLowPopup
}
