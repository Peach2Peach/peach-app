import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Headline, Icon, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { getOffer, isSellOffer } from '../utils/offer'
import { getOfferDetails } from '../utils/peachAPI'
import { PrimaryButton } from '../components/buttons'

type Props = {
  offerId: Offer['id']
}

export default ({ offerId }: Props): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [offer, setOffer] = useState(getOffer(offerId))

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  const goToOffer = async (): Promise<void> => {
    if (!offer) return closeOverlay()
    if (isSellOffer(offer) && offer.returnAddressRequired) {
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
        <View style={tw`flex items-center justify-center w-16 h-16 rounded-full bg-green`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
        </View>
      </View>
      <Text style={tw`mt-5 text-center text-white-1`}>{i18n('escrowFunded.description.1')}</Text>
      <View style={tw`flex items-center justify-center mt-5`}>
        <PrimaryButton onPress={goToOffer} narrow>
          {i18n('goToOffer')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay} narrow>
          {i18n('later')}
        </PrimaryButton>
      </View>
    </View>
  )
}
