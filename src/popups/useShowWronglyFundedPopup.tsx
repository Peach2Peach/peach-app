import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { sum } from '../utils/math'
import { useStartRefundPopup } from './useStartRefundPopup'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

export const useShowWronglyFundedPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const maxTradingAmount = useConfigStore((state) => state.maxTradingAmount)
  const startRefundOverlay = useStartRefundPopup()

  const showWronglyFundedPopup = useCallback(
    (sellOffer: SellOffer) =>
      setPopup({
        title: i18n('warning.wrongFundingAmount.title'),
        content: (
          <WrongFundingAmount
            amount={sellOffer.amount}
            actualAmount={sellOffer.funding.amounts.reduce(sum, 0)}
            maxAmount={maxTradingAmount}
          />
        ),
        visible: true,
        level: 'WARN',
        action1: {
          label: i18n('refundEscrow'),
          icon: 'arrowRightCircle',
          callback: () => {
            closePopup()
            startRefundOverlay(sellOffer)
          },
        },
      }),
    [closePopup, maxTradingAmount, setPopup, startRefundOverlay],
  )
  return showWronglyFundedPopup
}
