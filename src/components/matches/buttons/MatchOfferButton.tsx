import React from 'react'
import { TouchableOpacity } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import Icon from '../../Icon'
import { Text } from '../../text'
import { useMatchStore } from '../store'
import { options } from './options'

type Props = {
  matchId: string
  matchOffer: () => void
  optionName: keyof typeof options
}

export const MatchOfferButton = ({ matchId, matchOffer, optionName }: Props) => {
  const [selectedPaymentMethod, setShowPaymentMethodPulse] = useMatchStore(
    (state) => [state.matchSelectors[matchId]?.selectedPaymentMethod, state.setShowPaymentMethodPulse],
    shallow,
  )

  const currentOption = options[optionName]

  const onPress = () => {
    if (['matchOffer', 'acceptMatch'].includes(optionName)) {
      matchOffer()
    } else if (optionName === 'missingSelection') {
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
