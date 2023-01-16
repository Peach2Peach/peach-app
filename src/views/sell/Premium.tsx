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
  const [premium, setPremium] = useState(offer.premium)
  const [display, updateDisplay] = useState(premium)

  useEffect(() => {
    setPremium(premium)
    console.log(premium)
    updateOffer({
      ...offer,
      premium,
    })
  }, [premium, setPremium, setStepValid, updateOffer])

  useEffect(() => setStepValid(validate(offer)), [offer, setStepValid])

  return (
    <View>
      <View style={tw`flex-row items-center`}>
        <Text style={premium > 0 ? tw`text-success-main` : tw`text-primary-main`}>
          {i18n(premium > 0 ? 'sell.premium' : 'sell.discount')}:
        </Text>
        <Input
          style={tw`w-20`}
          {...{
            value: premium.toString(),
            onChange: setPremium,
          }}
        />
      </View>
      <PremiumSlider
        {...{
          value: premium,
          onChange: setPremium,
          updateDisplay,
        }}
      />
    </View>
  )
}
