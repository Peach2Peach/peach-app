import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Input, PremiumSlider, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSellSetup } from './hooks/useSellSetup'
import { SellViewProps } from './SellPreferences'

const validate = (offer: SellOffer) => offer.premium >= -21 && offer.premium <= 21

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useSellSetup({ help: 'premium' })
  const [premium, setPremium] = useState(offer.premium.toString())
  const [display, updateDisplay] = useState(premium)

  const updatePremium = (value: string | number) => {
    if (!value) return setPremium('')
    const number = Number(value)
    if (isNaN(number)) return setPremium(String(value) || '')
    if (number < -21) return setPremium('-21')
    if (number > 21) return setPremium('21')
    return setPremium(String(value))
  }

  useEffect(() => {
    setPremium(premium)
    updateOffer({
      ...offer,
      premium: Number(premium),
    })
  }, [premium, setPremium, setStepValid, updateOffer])

  useEffect(() => setStepValid(validate(offer)), [offer, setStepValid])

  return (
    <View>
      <View style={tw`flex-row items-center`}>
        <Text style={Number(premium) > 0 ? tw`text-success-main` : tw`text-primary-main`}>
          {i18n(Number(premium) > 0 ? 'sell.premium' : 'sell.discount')}:
        </Text>
        <Input
          style={tw`w-20`}
          {...{
            value: premium.toString(),
            onChange: updatePremium,
            keyboardType: 'numeric',
          }}
        />
      </View>
      <PremiumSlider
        {...{
          value: Number(premium),
          onChange: updatePremium,
          updateDisplay,
        }}
      />
    </View>
  )
}
