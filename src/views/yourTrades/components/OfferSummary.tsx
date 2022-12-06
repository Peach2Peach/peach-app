import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { BuyOfferSummary, PrimaryButton, SatsFormat, SellOfferSummary, Text, Title } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { StackNavigation } from '../../../utils/navigation'
import { getOffer, offerIdToHex } from '../../../utils/offer'

const sellOrBuy = (offer: SellOffer | BuyOffer) => (offer.type === 'ask' ? 'sell' : 'buy')

type OfferSummaryProps = {
  offer: BuyOffer | SellOffer
  status: OfferStatus['status']
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
    const offr = getOffer(offer.newOfferId)
    if (offr) navigation.replace('offer', { offer: offr })
  }

  return (
    <View>
      <Title title={title} />
      {status !== 'offerCanceled' ? (
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n(`yourTrades.search.${offer.type === 'ask' ? 'sell' : 'buy'}.subtitle`)}{' '}
          <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
        </Text>
      ) : (
        <Text style={tw`text-grey-2 text-center -mt-1`}>{i18n('yourTrades.offerCanceled.subtitle')}</Text>
      )}
      {offer.newOfferId ? (
        <Text style={tw`text-center leading-6 text-grey-2`} onPress={goToOffer}>
          {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
        </Text>
      ) : null}
      {status !== 'offerCanceled' ? (
        <Text style={tw`text-black-1 mt-5 text-center`}>{i18n('search.weWillNotifyYou')}</Text>
      ) : null}

      <View style={[tw`mt-7`, status === 'offerCanceled' ? tw`opacity-50` : {}]}>
        {offer.type === 'ask' ? <SellOfferSummary offer={offer} /> : <BuyOfferSummary offer={offer} />}
      </View>
      <PrimaryButton style={tw`self-center mt-4`} onPress={() => navigation.navigate('yourTrades', {})} narrow>
        {i18n('back')}
      </PrimaryButton>
      {status !== 'offerCanceled' ? (
        <Pressable style={tw`mt-3`} onPress={cancelOffer}>
          {/* TODO use TextLink component and add bold mode */}
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
