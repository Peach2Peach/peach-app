import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Bubble, SatsFormat, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { OverlayContext } from '../../../contexts/overlay'
import Refund from '../../../overlays/Refund'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getChat } from '../../../utils/chat'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getOfferStatus } from '../../../utils/offer'
import { ProfileScreenNavigationProp } from '../Offers'


const navigateToOffer = (
  offer: SellOffer|BuyOffer,
  offerStatus: OfferStatus,
  navigation: ProfileScreenNavigationProp,
  updateOverlay: React.Dispatch<OverlayState>
// eslint-disable-next-line max-params
): void => {
  const navigate = () => navigation.navigate('offers', {})

  if (offer.type === 'ask'
    && offer.funding?.txId
    && !offer.refunded
    && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    // return navigation.navigate('refund', { offer })
    return updateOverlay({
      content: <Refund offer={offer} navigate={navigate} />,
      showCloseButton: false
    })
  }

  if (!/rate/u.test(offerStatus.requiredAction)
    && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(offerStatus.status)) {
    return navigation.navigate('offer', { offer })
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
  offer: BuyOffer | SellOffer,
  showType?: boolean,
  navigation: ProfileScreenNavigationProp,
}

type IconMap = { [key in OfferStatus['status']]?: string }
  & { [key in OfferStatus['requiredAction']]?: string }

const ICONMAP: IconMap = {
  offerPublished: 'clock',
  searchingForPeer: 'clock',
  escrowWaitingForConfirmation: 'fundEscrow',
  fundEscrow: 'fundEscrow',
  match: 'heart',
  offerCanceled: 'cross',
  sendPayment: 'money',
  confirmPayment: 'money',
  rate: 'check',
  contractCreated: 'money',
  tradeCompleted: 'check',
  tradeCanceled: 'cross',
}

export const OfferItem = ({ offer, showType = true, navigation, style }: OfferItemProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { status, requiredAction } = getOfferStatus(offer)
  const icon = ICONMAP[requiredAction] || ICONMAP[status]
  const contract = offer.contractId ? getContract(offer.contractId) : null
  const contractChat = offer.contractId ? getChat(offer.contractId) : null
  const messagesSeen = contractChat
    ? contractChat.messages.filter(m => m.date.getTime() <= contractChat.lastSeen.getTime()).length
    : 0

  return <Pressable onPress={() => navigateToOffer(offer, { status, requiredAction }, navigation, updateOverlay)}
    style={[
      tw`pl-4 pr-2 py-2 rounded`,
      requiredAction ? tw`bg-peach-1` : tw`bg-white-1 border border-grey-2`,
      style
    ]}>
    <View style={tw`flex-row justify-between items-center`}>
      <View style={tw`flex-row`}>
        {showType
          ? <View style={tw`pr-1`}>
            <Text style={[
              tw`text-lg font-bold uppercase`,
              requiredAction ? tw`text-white-1` : tw`text-grey-2`
            ]}>
              {i18n(offer.type === 'ask' ? 'sell' : 'buy')}
            </Text>
          </View>
          : null
        }
        <SatsFormat
          style={tw`text-lg font-bold`}
          sats={offer.amount}
          color={requiredAction ? tw`text-white-1` : tw`text-grey-1`}
          color2={requiredAction ? tw`text-peach-mild` : tw`text-grey-3`} />
      </View>
      <Icon id={icon || 'help'} style={tw`w-5 h-5`}
        color={(requiredAction ? tw`text-white-1` : tw`text-grey-2`).color as string}
      />
    </View>
    {contract?.messages && contract.messages - messagesSeen > 0
      ? <Bubble color={tw`text-green`.color as string}
        style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}>
        <Text style={tw`text-sm font-baloo text-white-1 text-center`}>{contract.messages - messagesSeen}</Text>
      </Bubble>
      : null
    }
  </Pressable>
}