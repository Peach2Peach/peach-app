import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Button, BuyOfferSummary, SatsFormat, SellOfferSummary, Text, Title } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { StackNavigation } from '../../../utils/navigation'
import { isSellOffer, offerIdToHex } from '../../../utils/offer'

const sellOrBuy = (offer: SellOffer | BuyOffer) => (isSellOffer(offer) ? 'sell' : 'buy')

type OfferSummaryProps = {
  offer: BuyOffer | SellOffer
  status: TradeStatus['status']
  navigation: StackNavigation
}
export const OfferSummary = ({ offer, status, navigation }: OfferSummaryProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigate = () => {}
  const title = status !== 'offerCanceled' ? i18n('yourTrades.search.title') : i18n(`${sellOrBuy(offer)}.title`)

  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer, navigate, navigation }} />,
      showCloseButton: false,
    })

  const goToOffer = () => {
    if (!offer.newOfferId) return
    navigation.replace('offer', { offerId: offer.newOfferId })
  }

  return (
    <View>
      <Title title={title} />
      {status !== 'offerCanceled' ? (
        <Text style={tw`-mt-1 text-center text-grey-2`}>
          {i18n(`yourTrades.search.${isSellOffer(offer) ? 'sell' : 'buy'}.subtitle`)}{' '}
          <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
        </Text>
      ) : (
        <Text style={tw`-mt-1 text-center text-grey-2`}>{i18n('yourTrades.offerCanceled.subtitle')}</Text>
      )}
      {offer.newOfferId ? (
        <Text style={tw`leading-6 text-center text-grey-2`} onPress={goToOffer}>
          {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
        </Text>
      ) : null}
      {status !== 'offerCanceled' ? (
        <Text style={tw`mt-5 text-center text-black-1`}>{i18n('search.weWillNotifyYou')}</Text>
      ) : null}

      <View style={[tw`mt-7`, status === 'offerCanceled' ? tw`opacity-50` : {}]}>
        {isSellOffer(offer) ? <SellOfferSummary offer={offer} /> : <BuyOfferSummary offer={offer} />}
      </View>

      <View style={tw`flex items-center mt-4`}>
        <Button
          title={i18n('back')}
          secondary={true}
          wide={false}
          onPress={() => navigation.navigate('yourTrades', {})}
        />
      </View>
      {status !== 'offerCanceled' ? (
        <Pressable style={tw`mt-3`} onPress={cancelOffer}>
          {/* TODO use TextLink component and add bold mode */}
          <Text style={tw`text-sm text-center underline uppercase font-baloo text-peach-1`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
