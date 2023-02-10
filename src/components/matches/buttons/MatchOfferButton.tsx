import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import Icon from '../../Icon'
import { Text } from '../../text'
import { useMatchStore } from '../store'
import { isLimitReached } from '../../../utils/match'

const options = {
  missingSelection: {
    iconId: 'plusSquare',
    backgroundColor: tw`bg-primary-mild-1`,
    text: 'search.matchButton.matchOffer',
  },
  tradingLimitReached: {
    iconId: 'pauseCircle',
    backgroundColor: tw`bg-primary-mild-1`,
    text: 'search.matchButton.tradingLimitReached',
  },
  matchOffer: { iconId: 'plusSquare', backgroundColor: tw`bg-primary-main`, text: 'search.matchButton.matchOffer' },
  acceptMatch: { iconId: 'checkSquare', backgroundColor: tw`bg-primary-main`, text: 'search.matchButton.acceptMatch' },
  offerMatched: {
    iconId: 'checkSquare',
    backgroundColor: tw`bg-primary-main`,
    text: 'search.matchButton.offerMatched',
  },
} as const

type Props = {
  matchId: string
  matchOffer: () => void
  offerId: string
  pretendIsMatched: boolean
  isBuyOffer: boolean
}

export const MatchOfferButton = ({ matchId, matchOffer, offerId, pretendIsMatched, isBuyOffer }: Props) => {
  const { allMatches: matches } = useOfferMatches(offerId)
  const [currentIndex, selectedPaymentMethod, selectedCurrency, setShowCurrencyPulse, setShowPaymentMethodPulse]
    = useMatchStore(
      (state) => [
        state.currentIndex,
        state.matchSelectors[matchId]?.selectedPaymentMethod,
        state.matchSelectors[matchId]?.selectedCurrency,
        state.setShowCurrencyPulse,
        state.setShowPaymentMethodPulse,
      ],
      shallow,
    )
  const currentMatch = matches[currentIndex]

  const tradingLimitReached = isLimitReached(currentMatch?.unavailable.exceedsLimit || [], selectedPaymentMethod)

  const missingSelection = !selectedPaymentMethod || !selectedCurrency
  const isMatched = currentMatch?.matched || pretendIsMatched

  const currentOptionName = useMemo(
    () =>
      isMatched
        ? 'offerMatched'
        : tradingLimitReached
          ? 'tradingLimitReached'
          : missingSelection
            ? 'missingSelection'
            : isBuyOffer
              ? 'matchOffer'
              : 'acceptMatch',
    [isBuyOffer, isMatched, missingSelection, tradingLimitReached],
  )
  const currentOption = options[currentOptionName]

  const onPress = () => {
    if (['matchOffer', 'acceptMatch'].includes(currentOptionName)) {
      matchOffer()
    } else if (currentOptionName === 'missingSelection') {
      setShowCurrencyPulse(matchId, !selectedCurrency)
      setShowPaymentMethodPulse(matchId, !selectedPaymentMethod)
    }
  }

  return (
    <TouchableOpacity
      style={[tw`flex-row items-center justify-center py-2 rounded-b-xl`, currentOption.backgroundColor]}
      onPress={onPress}
    >
      <Text style={tw`button-large text-primary-background-light`}>{i18n(currentOption.text)}</Text>
      <Icon id={currentOption.iconId} color={tw`text-primary-background-light`.color} style={tw`w-6 h-6 ml-[10px]`} />
    </TouchableOpacity>
  )
}
