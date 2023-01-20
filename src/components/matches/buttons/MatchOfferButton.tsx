import React from 'react'
import { TouchableOpacity } from 'react-native'
import shallow from 'zustand/shallow'
import { ANONYMOUS_PAYMENTCATEGORIES } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import Icon from '../../Icon'
import { Text } from '../../text'
import { useMatchOffer } from '../hooks'
import { useMatchStore } from '../store'

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

export const MatchOfferButton = () => {
  const { allMatches: matches } = useOfferMatches()
  const [offer, currentIndex, selectedPaymentMethod] = useMatchStore(
    (state) => [
      state.offer,
      state.currentIndex,
      state.matchSelectors[matches[state.currentIndex].offerId]?.selectedPaymentMethod,
    ],
    shallow,
  )
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  const tradingLimitReached
    = currentMatch?.exceedsLimit?.length === 3
    || (selectedPaymentMethod
      && ((ANONYMOUS_PAYMENTCATEGORIES.includes(selectedPaymentMethod)
        && currentMatch?.exceedsLimit?.includes('monthly'))
        || !!currentMatch?.exceedsLimit?.length))

  const missingSelection = false
  const matched = currentMatch?.matched
  const buyOffer = true

  const currentOptionName = tradingLimitReached
    ? 'tradingLimitReached'
    : matched
      ? 'offerMatched'
      : missingSelection
        ? 'missingSelection'
        : buyOffer
          ? 'matchOffer'
          : 'acceptMatch'
  const currentOption = options[currentOptionName]

  return (
    <TouchableOpacity
      style={[tw`flex-row items-center justify-center py-2 rounded-b-xl`, currentOption.backgroundColor]}
      onPress={() => matchOffer()}
      disabled={!['matchOffer', 'acceptMatch'].includes(currentOptionName)}
    >
      <Text style={tw`button-large text-primary-background-light`}>{i18n(currentOption.text)}</Text>
      <Icon id={currentOption.iconId} color={tw`text-primary-background-light`.color} style={tw`w-6 h-6 ml-[10px]`} />
    </TouchableOpacity>
  )
}
