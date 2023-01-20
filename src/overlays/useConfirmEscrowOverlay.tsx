import React, { useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'

import i18n from '../utils/i18n'
import { sum } from '../utils/math'
import { confirmEscrow } from '../utils/peachAPI'
import { useStartRefundOverlay } from './useStartRefundOverlay'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'

export const useConfirmEscrowOverlay = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const showStartRefundOverlay = useStartRefundOverlay()
  return (sellOffer: SellOffer) =>
    updateOverlay({
      title: i18n('warning.fundingAmountDifferent.title'),
      content: (
        <FundingAmountDifferent amount={sellOffer.amount} actualAmount={sellOffer.funding.amounts.reduce(sum, 0)} />
      ),
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('warning.fundingAmountDifferent.action.1'),
        icon: 'arrowRightCircle',
        callback: async () => {
          const [confirmEscrowResult, confirmEscrowErr] = await confirmEscrow({ offerId: sellOffer.id })
          if (!confirmEscrowResult || confirmEscrowErr) {
            showError(confirmEscrowErr?.error)
            return
          }
          navigation.navigate('offer', { offerId: sellOffer.id })
        },
      },
      action2: {
        label: i18n('warning.fundingAmountDifferent.action.2'),
        icon: 'rotateCounterClockwise',
        callback: () => showStartRefundOverlay(sellOffer),
      },
    })
}
