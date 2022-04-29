import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { SatsFormat, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { OverlayContext } from '../../../contexts/overlay'
import Refund from '../../../overlays/Refund'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getOfferStatus } from '../../../utils/offer'
import { ProfileScreenNavigationProp } from '../Offers'


const navigateToOffer = (
  offer: SellOffer|BuyOffer,
  navigation: ProfileScreenNavigationProp,
  updateOverlay: React.Dispatch<OverlayState>
): void => {
  const navigate = () => navigation.navigate('offers', {})

  if (offer.type === 'ask' && offer.funding?.txId && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    // return navigation.navigate('refund', { offer })
    return updateOverlay({
      content: <Refund offer={offer} navigate={navigate} />,
      showCloseButton: false
    })
  }

  if (offer.contractId) {
    const contract = getContract(offer.contractId)
    if (contract) {
      const view = account.publicKey === contract.seller.id ? 'seller' : 'buyer'
      if ((view === 'seller' && contract.ratingBuyer)
        || (view === 'buyer' && contract.ratingSeller)) {
        return navigation.navigate('tradeComplete', { view, contract })
      }
    }
    return navigation.navigate('contract', { contractId: offer.contractId })
  }

  if (offer.type === 'ask') {
    if (offer.funding?.status === 'FUNDED') {
      return navigation.navigate('search', { offer })
    }
    return navigation.navigate('sell', { offer })
  }

  if (offer.type === 'bid' && offer.online) {
    return navigation.navigate('search', { offer })
  }

  return navigation.navigate('offers', {})
}

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer
  navigation: ProfileScreenNavigationProp,
}

type IconMap = {
  [key in OfferStatus['status']]: string
}

const ICONMAP: IconMap = {
  escrowWaitingForConfirmation: 'fundEscrow',
  offerPublished: 'clock',
  match: 'clock',
  contractCreated: 'money',
  tradeCompleted: 'check',
  offerCanceled: 'cross',
  tradeCanceled: 'cross',
  null: 'cross',
}

export const OfferItem = ({ offer, navigation, style }: OfferItemProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { status, actionRequired } = getOfferStatus(offer)
  const icon = ICONMAP[status]
  return <Pressable onPress={() => navigateToOffer(offer, navigation, updateOverlay)}
    style={[
      tw`pl-4 pr-2 py-2 rounded`,
      actionRequired ? tw`bg-peach-1` : tw`bg-white-1 border border-grey-2`,
      style
    ]}>
    <View style={tw`flex-row justify-between`}>
      <View style={tw`flex-row`}>
        <View style={tw`pr-1`}>
          <Text style={[
            tw`text-lg font-bold uppercase`,
            actionRequired ? tw`text-white-1` : tw`text-grey-2`
          ]}>
            {i18n(offer.type === 'ask' ? 'sell' : 'buy')}
          </Text>
        </View>
        <SatsFormat
          style={tw`text-lg font-bold`}
          sats={offer.amount}
          color={actionRequired ? tw`text-white-1` : tw`text-grey-1`}
          color2={actionRequired ? tw`text-peach-mild` : tw`text-grey-3`} />
      </View>
      <Icon id={icon} style={tw`w-7 h-7`}
        color={(actionRequired ? tw`text-white-1` : tw`text-grey-1`).color as string}
      />
    </View>
  </Pressable>
}