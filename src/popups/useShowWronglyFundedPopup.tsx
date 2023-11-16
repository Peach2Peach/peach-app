import { useCallback } from 'react'
import { useConfigStore } from '../store/configStore'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { sum } from '../utils/math'
import { useCancelAndStartRefundPopup } from './useCancelAndStartRefundPopup'
import { IncorrectFunding } from './warning/IncorrectFunding'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

export const useShowWronglyFundedPopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const maxTradingAmount = useConfigStore((state) => state.maxTradingAmount)
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup()

  const showWronglyFundedPopup = useCallback(
    (sellOffer: SellOffer) => {
      const utxos = sellOffer.funding.txIds.length
      const title = i18n(utxos === 1 ? 'warning.wrongFundingAmount.title' : 'warning.incorrectFunding.title')
      const content
        = utxos === 1 ? (
          <WrongFundingAmount
            amount={sellOffer.amount}
            actualAmount={sellOffer.funding.amounts.reduce(sum, 0)}
            maxAmount={maxTradingAmount}
          />
        ) : (
          <IncorrectFunding {...{ utxos }} />
        )

      setPopup({
        title,
        content,
        visible: true,
        level: 'WARN',
        action1: {
          label: i18n('refundEscrow'),
          icon: 'arrowRightCircle',
          callback: () => {
            cancelAndStartRefundPopup(sellOffer)
          },
        },
      })
    },
    [maxTradingAmount, setPopup, cancelAndStartRefundPopup],
  )
  return showWronglyFundedPopup
}
