import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../components/popup'
import { useNavigation } from '../hooks/useNavigation'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { sum } from '../utils/math/sum'
import { WarningPopup } from './WarningPopup'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'

export const useShowFundingAmountDifferentPopup = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showFundingAmountDifferentPopup = useCallback(
    (sellOffer: SellOffer) =>
      setPopup(
        <WarningPopup
          title={i18n('warning.fundingAmountDifferent.title')}
          content={
            <FundingAmountDifferent amount={sellOffer.amount} actualAmount={sellOffer.funding.amounts.reduce(sum, 0)} />
          }
          actions={
            <PopupAction
              style={tw`justify-center`}
              label={i18n('goToTrade')}
              iconId="arrowRightCircle"
              textStyle={tw`text-black-100`}
              reverseOrder
              onPress={() => {
                closePopup()
                navigation.navigate('wrongFundingAmount', { offerId: sellOffer.id })
              }}
            />
          }
        />,
      ),
    [closePopup, navigation, setPopup],
  )
  return showFundingAmountDifferentPopup
}
