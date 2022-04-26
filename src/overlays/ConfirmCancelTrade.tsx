import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Button, Headline } from '../components'
import Icon from '../components/Icon'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { cancelOffer } from '../utils/peachAPI'
import { error, info } from '../utils/log'
import { saveOffer } from '../utils/offer'


const confirm = async (offer: BuyOffer|SellOffer) => {
  if (!offer.id) return

  const [result, err] = await cancelOffer({
    offerId: offer.id,
    satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
  })
  if (result) {
    info('Cancel offer: ', JSON.stringify(result))
    if (offer.type === 'ask' && offer.funding) {
      saveOffer({
        ...offer, online: false,
        funding: {
          ...offer.funding,
          status: 'CANCELED',
        }
      })
    } else {
      saveOffer({ ...offer, online: false })
    }
  } else if (err) {
    error('Error', err)
  }
}
const TradeCanceled = () => <View style={tw`flex items-center`}>
  <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
    {i18n('cancelTrade.confirm.success')}
  </Headline>
  <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
    <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
  </View>
</View>


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'buy'|'sell'|'search'|'contract'>
type ConfirmCancelTradeProps = {
  offer: BuyOffer|SellOffer,
  navigation: ProfileScreenNavigationProp,
}

export default ({ offer, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const ok = async () => {
    await confirm(offer)
    updateOverlay({ content: <TradeCanceled />, showCloseButton: false })
    setTimeout(() => {
      closeOverlay()

      if (offer.type === 'bid' || offer.funding?.status === 'NULL') {
        navigation.navigate('home', {})
        return
      }
      navigation.navigate('refund', { offer })

    }, 3000)
  }
  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('cancelTrade.confirm.title')}
    </Headline>
    <Button
      style={tw`mt-2`}
      title={i18n('cancelTrade.confirm.back')}
      secondary={true}
      wide={false}
      onPress={closeOverlay}
    />
    <Button
      style={tw`mt-2`}
      title={i18n('cancelTrade.confirm.ok')}
      tertiary={true}
      wide={false}
      onPress={ok}
    />
  </View>
}