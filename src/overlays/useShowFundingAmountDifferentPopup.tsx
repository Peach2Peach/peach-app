import { useCallback } from 'react'
import { useNavigation } from '../hooks'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { sum } from '../utils/math'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'
import { shallow } from 'zustand/shallow'

export const useShowFundingAmountDifferentPopup = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showFundingAmountDifferentPopup = useCallback(
    (sellOffer: SellOffer) =>
      setPopup({
        title: i18n('warning.fundingAmountDifferent.title'),
        content: (
          <FundingAmountDifferent amount={sellOffer.amount} actualAmount={sellOffer.funding.amounts.reduce(sum, 0)} />
        ),
        visible: true,
        level: 'WARN',
        action1: {
          label: i18n('goToTrade'),
          icon: 'arrowRightCircle',
          callback: () => {
            closePopup()
            navigation.replace('wrongFundingAmount', { offerId: sellOffer.id })
          },
        },
      }),
    [closePopup, navigation, setPopup],
  )
  return showFundingAmountDifferentPopup
}
