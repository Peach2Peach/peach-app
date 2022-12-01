import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Bubble, Button, Headline, SatsFormat, Shadow, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { IconType } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import Refund from '../../../overlays/Refund'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getContractChatNotification } from '../../../utils/chat'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'
import { info } from '../../../utils/log'
import { StackNavigation } from '../../../utils/navigation'
import { getOfferStatus, offerIdToHex } from '../../../utils/offer'
import { isEscrowRefunded } from '../../../utils/offer/getOfferStatus'

// eslint-disable-next-line complexity
const navigateToOffer = (
  offer: SellOffer | BuyOffer,
  offerStatus: OfferStatus,
  navigation: StackNavigation,
  updateOverlay: React.Dispatch<OverlayState>,
  // eslint-disable-next-line max-params
): void => {
  if (!offer) return navigation.navigate('yourTrades', {})

  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (
    !/rate/u.test(offerStatus.requiredAction)
    && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(offerStatus.status)
  ) {
    if (
      offer.type === 'ask'
      && !offer.online
      && (!offer.contractId || (contract?.canceled && contract.disputeWinner === 'seller'))
      && offer.funding?.txIds.length > 0
      && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)
      && !isEscrowRefunded(offer)
    ) {
      const navigate = () => {}

      updateOverlay({
        content: <Refund {...{ sellOffer: offer, navigate, navigation }} />,
        showCloseButton: false,
      })
    }
    return navigation.navigate('offer', { offer })
  }

  if (contract) {
    if (contract && !contract.disputeWinner && offerStatus.status === 'tradeCompleted') {
      return navigation.navigate('tradeComplete', { contract })
    }
    return navigation.navigate('contract', { contractId: contract.id })
  }

  if (offer.type === 'ask') {
    if (offer.returnAddressRequired) {
      return navigation.navigate('setReturnAddress', { offer })
    }
    if (offer.funding.status === 'FUNDED') {
      return navigation.navigate('search', { offer, hasMatches: offer.matches?.length > 0 })
    }
    return navigation.navigate('fundEscrow', { offer })
  }

  if (offer.type === 'bid' && offer.online) {
    return navigation.navigate('search', { offer, hasMatches: offer.matches?.length > 0 })
  }

  return navigation.navigate('yourTrades', {})
}

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer
  extended?: boolean
  navigation: StackNavigation
}

type IconMap = { [key in OfferStatus['status']]?: IconType } & { [key in OfferStatus['requiredAction']]?: IconType }

const ICONMAP: IconMap = {
  offerPublished: 'clock',
  searchingForPeer: 'clock',
  escrowWaitingForConfirmation: 'fundEscrow',
  fundEscrow: 'fundEscrow',
  match: 'heart',
  offerCanceled: 'x',
  sendPayment: 'dollarSign',
  confirmPayment: 'dollarSign',
  rate: 'check',
  contractCreated: 'dollarSign',
  tradeCompleted: 'check',
  tradeCanceled: 'x',
  dispute: 'alertTriangle',
}

// eslint-disable-next-line max-lines-per-function, complexity
export const OfferItem = ({ offer, extended = true, navigation, style }: OfferItemProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { status, requiredAction } = getOfferStatus(offer)
  const contract = offer.contractId ? getContract(offer.contractId) : null

  const currency = contract
    ? contract.currency
    : offer.prices && offer.prices[account.settings.displayCurrency]
      ? account.settings.displayCurrency
      : Object.keys(offer.meansOfPayment)[0]
  const price = contract?.price || Object(offer.prices)[currency]

  const icon = contract?.disputeWinner ? 'alertTriangle' : ICONMAP[requiredAction] || ICONMAP[status]
  const notifications = contract ? getContractChatNotification(contract) : 0

  const isRedStatus = contract?.disputeActive || (offer.type === 'bid' && contract?.cancelationRequested)
  const isOrangeStatus = requiredAction || (offer.type === 'ask' && contract?.cancelationRequested)
  const textColor1 = isRedStatus || isOrangeStatus ? tw`text-white-1` : tw`text-grey-2`
  const textColor2 = isRedStatus || isOrangeStatus ? tw`text-white-1` : tw`text-grey-1`

  const navigate = () => navigateToOffer(offer, { status, requiredAction }, navigation, updateOverlay)
  return (
    <Shadow shadow={mildShadow}>
      <Pressable
        onPress={navigate}
        style={[
          tw`rounded`,
          isRedStatus ? tw`bg-red` : isOrangeStatus ? tw`bg-peach-1` : tw`bg-white-1 border border-grey-2`,
          style,
        ]}
      >
        {extended ? (
          <View style={tw`px-4 py-2`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-full flex-shrink`}>
                <Headline style={[tw`text-lg font-bold normal-case text-left`, textColor1]}>
                  {i18n('trade')} {offerIdToHex(offer.id as Offer['id'])}
                </Headline>
                <View>
                  {offer.type === 'ask' && contract?.cancelationRequested ? (
                    <Text style={[tw`text-lg`, textColor1]}>{i18n('contract.cancel.pending')}</Text>
                  ) : (
                    <Text style={textColor2}>
                      <SatsFormat sats={offer.amount} color={textColor2} />
                      {' - '}
                      {i18n(`currency.format.${currency}`, price)}
                    </Text>
                  )}
                </View>
              </View>
              <Icon id={icon || 'helpCircle'} style={tw`w-7 h-7`} color={textColor1.color} />
            </View>
            {requiredAction && !contract?.disputeActive && (offer.type === 'bid' || !contract?.cancelationRequested) ? (
              <View style={tw`flex items-center mt-3 mb-1`}>
                <Button
                  title={i18n(`offer.requiredAction.${requiredAction}`)}
                  onPress={navigate}
                  secondary={!isRedStatus}
                  red={isRedStatus}
                  wide={false}
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={tw`flex-row justify-between items-center p-2`}>
            <View style={tw`flex-row items-center`}>
              <Icon
                id={offer.type === 'ask' ? 'sell' : 'buy'}
                style={tw`w-5 h-5 mr-2`}
                color={
                  (requiredAction || contract?.disputeActive
                    ? tw`text-white-1`
                    : offer.type === 'ask'
                      ? tw`text-red`
                      : tw`text-green`
                  ).color
                }
              />
              <Text
                style={[tw`text-lg`, requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-1`]}
              >
                {i18n('trade')} {offerIdToHex(offer.id as Offer['id'])}
              </Text>
            </View>
            <Icon
              id={icon || 'helpCircle'}
              style={tw`w-5 h-5`}
              color={(requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`).color}
            />
          </View>
        )}
        {notifications > 0 ? (
          <Bubble
            color={tw`text-green`.color}
            style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}
          >
            <Text style={tw`text-xs font-baloo text-white-1 text-center`} ellipsizeMode="head" numberOfLines={1}>
              {notifications}
            </Text>
          </Bubble>
        ) : null}
      </Pressable>
    </Shadow>
  )
}
