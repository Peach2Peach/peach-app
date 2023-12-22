import { useCallback } from 'react'
import { PopupAction } from '../components/popup'
import { useConfigStore } from '../store/configStore/configStore'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { sum } from '../utils/math/sum'
import { WarningPopup } from './WarningPopup'
import { ClosePopupAction } from './actions'
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

      setPopup(
        <WarningPopup
          title={title}
          content={content}
          actions={
            <>
              <ClosePopupAction textStyle={tw`text-black-100`} />
              <PopupAction
                label={i18n('refundEscrow')}
                iconId="arrowRightCircle"
                textStyle={tw`text-black-100`}
                onPress={() => {
                  cancelAndStartRefundPopup(sellOffer)
                }}
                reverseOrder
              />
            </>
          }
        />,
      )
    },
    [maxTradingAmount, setPopup, cancelAndStartRefundPopup],
  )
  return showWronglyFundedPopup
}
