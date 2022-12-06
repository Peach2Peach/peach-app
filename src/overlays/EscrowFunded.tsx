import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Button, Headline, Icon, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { Navigation } from '../utils/navigation'
import { getOffer } from '../utils/offer'
import { getOfferDetails } from '../utils/peachAPI'

type Props = {
  offerId: Offer['id']
  navigation: Navigation
}

export default ({ offerId, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [offer, setOffer] = useState(getOffer(offerId))

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  const goToOffer = async (): Promise<void> => {
    if (!offer) return closeOverlay()
    if (offer.type === 'ask' && offer.returnAddressRequired) {
      navigation.navigate('setReturnAddress', { offer })
    } else {
      navigation.navigate({ name: 'offer', merge: false, params: { offer } })
    }
    return closeOverlay()
  }

  useEffect(() => {
    ;(async () => {
      const [result] = await getOfferDetails({
        offerId,
      })

      if (result) {
        setOffer(result)
      }
    })()
  }, [])

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('escrowFunded.title')}</Headline>
      <View style={tw`flex items-center mt-3`}>
        <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
        </View>
      </View>
      <Text style={tw`text-center text-white-1 mt-5`}>{i18n('escrowFunded.description.1')}</Text>
      <View style={tw`flex justify-center items-center mt-5`}>
        <Button title={i18n('goToOffer')} secondary={true} wide={false} onPress={goToOffer} />
        <Button title={i18n('later')} style={tw`mt-2`} tertiary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
