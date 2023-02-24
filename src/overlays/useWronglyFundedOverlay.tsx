import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'

import i18n from '../utils/i18n'
import { sum } from '../utils/math'
import { useStartRefundOverlay } from './useStartRefundOverlay'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

export const useWronglyFundedOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showStartRefundOverlay = useStartRefundOverlay()
  const wronglyFundedOverlay = useCallback(
    (sellOffer: SellOffer) =>
      updateOverlay({
        title: i18n('warning.fundingAmountDifferent.title'),
        content: (
          <WrongFundingAmount amount={sellOffer.amount} actualAmount={sellOffer.funding.amounts.reduce(sum, 0)} />
        ),
        visible: true,
        level: 'WARN',
        action1: {
          label: i18n('continue'),
          icon: 'arrowRightCircle',
          callback: () => showStartRefundOverlay(sellOffer),
        },
      }),
    [showStartRefundOverlay, updateOverlay],
  )
  return wronglyFundedOverlay
}
