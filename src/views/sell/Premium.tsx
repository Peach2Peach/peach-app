import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'

import { Input, PremiumSlider, PrimaryButton, Text } from '../../components'
import { useMarketPrices } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getOfferPrice } from '../../utils/offer'
import { priceFormat } from '../../utils/string'
import { parsePremiumToString } from './helpers/parsePremiumToString'
import { validatePremiumStep } from './helpers/validatePremiumStep'
import { useSellSetup } from './hooks/useSellSetup'
import { SellViewProps } from './SellPreferences'

export default ({ offer, updateOffer, next }: SellViewProps): ReactElement => {
  useSellSetup({ help: 'premium' })
  const [premiumStore, setPremiumStore] = useSettingsStore((state) => [state.premium, state.setPremium], shallow)
  const [premium, setPremium] = useState(premiumStore.toString())
  const [stepValid, setStepValid] = useState(false)

  const { data: priceBook } = useMarketPrices()
  const { displayCurrency } = account.settings
  const currentPrice = priceBook ? getOfferPrice(offer.amount, offer.premium, priceBook, displayCurrency) : 0

  const updatePremium = (value: string | number) => {
    setPremium(parsePremiumToString(value))
    setPremiumStore(Number(premium))
  }

  useEffect(() => {
    updateOffer({
      ...offer,
      premium: Number(premium),
    })
  }, [premium, updateOffer])

  useEffect(() => setStepValid(validatePremiumStep(offer, priceBook, account.tradingLimit)), [priceBook, offer])

  return (
    <View style={tw`items-center flex-shrink h-full px-8 pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <Text style={tw`text-center h5`}>{i18n('sell.premium.title')}</Text>
        <View style={tw`flex-row items-center justify-center mt-8`}>
          <Text
            style={[
              tw`leading-2xl`,
              premium === '0' ? {} : offer.premium > 0 ? tw`text-success-main` : tw`text-primary-main`,
            ]}
          >
            {i18n(offer.premium > 0 ? 'sell.premium' : 'sell.discount')}:
          </Text>
          <View style={tw`h-10 ml-2`}>
            <Input
              style={tw`w-24`}
              inputStyle={tw`text-right`}
              value={premium || '0'}
              onChange={updatePremium}
              icons={[['percent', () => {}]]}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        {!!currentPrice && (
          <Text style={tw`mt-1 text-center text-black-2`}>
            ({i18n('sell.premium.currently', `${displayCurrency} ${priceFormat(currentPrice)}`)})
          </Text>
        )}
        <PremiumSlider style={tw`mt-6`} value={Number(premium)} onChange={updatePremium} />
      </View>
      <PrimaryButton testID="navigation-next" disabled={!stepValid} narrow onPress={next}>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
