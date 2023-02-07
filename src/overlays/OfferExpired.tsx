import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Headline, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { PrimaryButton } from '../components/buttons'
import { useNavigation } from '../hooks'

type Props = {
  offer: SellOffer
  days: string
}

export default ({ offer, days }: Props): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  const goToOffer = () => {
    if (offer.id) navigation.navigate('yourTrades')
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('offerExpired.title')}</Headline>
      <Text style={tw`mt-5 text-center text-white-1`}>{i18n('offerExpired.description', days)}</Text>
      <View style={tw`flex items-center justify-center mt-5`}>
        <PrimaryButton onPress={goToOffer} narrow>
          {i18n('refund')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay} narrow>
          {i18n('later')}
        </PrimaryButton>
      </View>
    </View>
  )
}
