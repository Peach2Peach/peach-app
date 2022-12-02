import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'

import { Headline, Loading, PrimaryButton } from '../components'
import Icon from '../components/Icon'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { cancelOffer, getTradingLimit } from '../utils/peachAPI'
import { error, info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import Refund from './Refund'
import { updateTradingLimit } from '../utils/account'
import { Navigation } from '../utils/navigation'

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
      <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
    </View>
  </View>
)

type ConfirmCancelOfferProps = {
  offer: BuyOffer | SellOffer
  navigate: () => void
  navigation: Navigation
}

export default ({ offer, navigate, navigation }: ConfirmCancelOfferProps): ReactElement => {
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
        content: <Refund {...{ sellOffer: offer, navigate, navigation }} />,
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
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay}>
          {i18n('cancelOffer.confirm.back')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={ok}>
          {i18n('cancelOffer.confirm.ok')}
        </PrimaryButton>
      </View>
      {loading ? <Loading style={tw`absolute mt-4`} color={tw`text-white-1`.color} /> : null}
    </View>
  )
}
