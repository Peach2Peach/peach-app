import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Button, BuyOfferSummary, SatsFormat, SellOfferSummary, Text, Title } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { OfferScreenNavigationProp } from '../Offer'

type OfferSummaryProps = {
  offer: BuyOffer|SellOffer,
  status: OfferStatus['status'],
  navigation: OfferScreenNavigationProp,
}
export const OfferSummary = ({ offer, status, navigation }: OfferSummaryProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigate = () => {}
  const title = status !== 'offerCanceled'
    ? i18n('yourTrades.search.title')
    : i18n(`${offer.type === 'ask' ? 'sell' : 'buy'}.title`)

  const cancelOffer = () => updateOverlay({
    content: <ConfirmCancelOffer offer={offer} navigate={navigate} />,
    showCloseButton: false
  })
  return <View>
    <Title title={title}/>
    {status !== 'offerCanceled'
      ? <Text style={tw`text-grey-2 text-center -mt-1`}>
        {i18n(`yourTrades.search.${offer.type === 'ask' ? 'sell' : 'buy'}.subtitle`)} <SatsFormat sats={offer.amount}
          color={tw`text-grey-2`}
        />
      </Text>
      : <Text style={tw`text-grey-2 text-center -mt-1`}>
        {i18n('yourTrades.offerCanceled.subtitle')}
      </Text>
    }
    {status !== 'offerCanceled'
      ? <Text style={tw`text-black-1 mt-5 text-center`}>{i18n('search.weWillNotifyYou')}</Text>
      : null
    }

    <View style={[tw`mt-7`, status === 'offerCanceled' ? tw`opacity-50` : {}]}>
      {offer.type === 'ask'
        ? <SellOfferSummary offer={offer} />
        : <BuyOfferSummary offer={offer} />
      }
    </View>

    <View style={tw`flex items-center mt-4`}>
      <Button
        title={i18n('back')}
        secondary={true}
        wide={false}
        onPress={() => navigation.replace('yourTrades', {})}
      />
    </View>
    {status !== 'offerCanceled'
      ? <Pressable style={tw`mt-3`} onPress={cancelOffer}>
        {/* TODO use TextLink component and add bold mode */}
        <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
          {i18n('cancelOffer')}
        </Text>
      </Pressable>
      : null
    }
  </View>
}