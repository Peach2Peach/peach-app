import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'

import { Button, Headline, Loading } from '../components'
import Icon from '../components/Icon'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { cancelOffer, getTradingLimit } from '../utils/peachAPI'
import { error, info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import Refund from './Refund'
import { updateTradingLimit } from '../utils/account'

const confirm = async (offer: BuyOffer | SellOffer) => {
  if (!offer.id) return

  const [result, err] = await cancelOffer({
    offerId: offer.id,
    // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
  })
  if (result) {
    info('Cancel offer: ', JSON.stringify(result))
    if (offer.type === 'ask') {
      saveOffer({
        ...offer,
        online: false,
        funding: {
          ...offer.funding,
          status: 'CANCELED',
        },
      })
    } else {
      saveOffer({ ...offer, online: false })
    }
  } else if (err) {
    error('Error', err)
  }
}
const TradeCanceled = () => (
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
      {i18n('cancelOffer.confirm.success')}
    </Headline>
    <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
      <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
    </View>
  </View>
)

type ConfirmCancelOfferProps = {
  offer: BuyOffer | SellOffer
  navigate: () => void
}

export default ({ offer, navigate }: ConfirmCancelOfferProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const ok = async () => {
    setLoading(true)
    await confirm(offer)
    setLoading(false)

    getTradingLimit({}).then(([tradingLimit]) => {
      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })

    updateOverlay({ content: <TradeCanceled />, showCloseButton: false })
    setTimeout(() => {
      closeOverlay()

      if (offer.type === 'bid' || offer.funding.status === 'NULL' || offer.funding.txIds.length === 0) {
        navigate()
        return
      }
      updateOverlay({
        content: <Refund offer={offer} navigate={navigate} />,
        showCloseButton: false,
      })
    }, 3000)
  }
  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('cancelOffer.confirm.title')}
      </Headline>
      <View style={loading ? tw`opacity-0` : {}} pointerEvents={loading ? 'none' : 'auto'}>
        <Button
          style={tw`mt-2`}
          title={i18n('cancelOffer.confirm.back')}
          secondary={true}
          wide={false}
          onPress={closeOverlay}
        />
        <Button style={tw`mt-2`} title={i18n('cancelOffer.confirm.ok')} tertiary={true} wide={false} onPress={ok} />
      </View>
      {loading ? <Loading style={tw`absolute mt-4`} color={tw`text-white-1`.color as string} /> : null}
    </View>
  )
}
