import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Bubble, Button, Headline, SatsFormat, Shadow, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { IconType } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import Refund from '../../../overlays/Refund'
import tw from '../../../styles/tailwind'
import { getContractChatNotification } from '../../../utils/chat'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'
import { getOfferStatus, offerIdToHex } from '../../../utils/offer'
import { ProfileScreenNavigationProp } from '../YourTrades'


const navigateToOffer = (
  offer: SellOffer|BuyOffer,
  offerStatus: OfferStatus,
  navigation: ProfileScreenNavigationProp,
  updateOverlay: React.Dispatch<OverlayState>
// eslint-disable-next-line max-params
): void => {
  if (!offer) return navigation.replace('yourTrades', {})

  if (offer.type === 'ask'
    && offer.funding?.txIds
    && !offer.refunded
    && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    const navigate = () => navigation.replace('yourTrades', {})

    return updateOverlay({
      content: <Refund offer={offer} navigate={navigate} />,
      showCloseButton: false
    })
  }

  if (!/rate/u.test(offerStatus.requiredAction)
    && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(offerStatus.status)) {
    return navigation.replace('offer', { offer })
  }

  if (offer.contractId) {
    const contract = getContract(offer.contractId)
    if (contract && offerStatus.status === 'tradeCompleted') {
      return navigation.replace('tradeComplete', { contract })
    }
    return navigation.replace('contract', { contractId: offer.contractId })
  }

  if (offer.type === 'ask') {
    if (offer.funding.status === 'FUNDED') {
      return navigation.replace('search', { offer, hasMatches: offer.matches?.length > 0 })
    }
    return navigation.replace('sell', { offer })
  }

  if (offer.type === 'bid' && offer.online) {
    return navigation.replace('search', { offer, hasMatches: offer.matches?.length > 0 })
  }

  return navigation.replace('yourTrades', {})
}

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer,
  extended?: boolean,
  navigation: ProfileScreenNavigationProp,
}

type IconMap = { [key in OfferStatus['status']]?: IconType }
  & { [key in OfferStatus['requiredAction']]?: IconType }

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

// eslint-disable-next-line max-lines-per-function, complexity
export const OfferItem = ({ offer, extended = true, navigation, style }: OfferItemProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { status, requiredAction } = getOfferStatus(offer)
  const icon = ICONMAP[requiredAction] || ICONMAP[status]
  const contract = offer.contractId ? getContract(offer.contractId) : null
  const notifications = contract ? getContractChatNotification(contract) : 0

  const navigate = () => navigateToOffer(offer, { status, requiredAction }, navigation, updateOverlay)
  return <Shadow shadow={mildShadow}>
    <Pressable onPress={navigate}
      style={[
        tw`rounded`,
        contract?.disputeActive
          ? tw`bg-red`
          : requiredAction
            ? tw`bg-peach-1`
            : tw`bg-white-1 border border-grey-2`,
        style
      ]}>
      {extended
        ? <View style={tw`px-4 py-2`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-full flex-shrink`}>
              <Headline style={[
                tw`text-lg font-bold normal-case text-left`,
                requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`
              ]}>
                {i18n('trade')} {offerIdToHex(offer.id as Offer['id'])}
              </Headline>
              <View style={tw`-mt-2`}>
                <SatsFormat
                  style={tw`text-lg`}
                  sats={offer.amount}
                  color={requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-1`} />
              </View>
            </View>
            <Icon id={icon || 'help'} style={tw`w-7 h-7`}
              color={(requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`).color as string}
            />
          </View>
          {requiredAction && !contract?.disputeActive
            ? <View style={tw`flex items-center mt-3 mb-1`}>
              <Button
                title={i18n(`offer.requiredAction.${requiredAction}`)}
                onPress={navigate}
                secondary={true}
                wide={false}
              />
            </View>
            : null
          }
        </View>
        : <View style={tw`flex-row justify-between items-center p-2`}>
          <View style={tw`flex-row items-center`}>
            <Icon id={offer.type === 'ask' ? 'sell' : 'buy'} style={tw`w-5 h-5 mr-2`}
              color={(requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`).color as string}/>
            <SatsFormat
              style={tw`text-lg`}
              sats={offer.amount}
              color={requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-1`} />
          </View>
          <Icon id={icon || 'help'} style={tw`w-5 h-5`}
            color={(requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`).color as string}
          />
        </View>
      }
      {notifications > 0
        ? <Bubble color={tw`text-green`.color as string}
          style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}>
          <Text style={tw`text-xs font-baloo text-white-1 text-center`} ellipsizeMode="head" numberOfLines={1}>
            {notifications}
          </Text>
        </Bubble>
        : null
      }
    </Pressable>
  </Shadow>
}