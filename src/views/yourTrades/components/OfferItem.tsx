import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Bubble, Headline, PrimaryButton, SatsFormat, Shadow, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getContractChatNotification } from '../../../utils/chat'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'
import { isBuyOffer, isSellOffer, offerIdToHex } from '../../../utils/offer'
import { getOfferStatus } from '../../../utils/offer/status'
import { navigateToOffer } from '../utils/navigateToOffer'

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer
  extended?: boolean
}

type IconMap = { [key in TradeStatus['status']]?: IconType } & { [key in TradeStatus['requiredAction']]?: IconType }

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
export const OfferItem = ({ offer, extended = true, style }: OfferItemProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

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

  const isRedStatus = contract?.disputeActive || (isBuyOffer(offer) && contract?.cancelationRequested)
  const isOrangeStatus = requiredAction || (isSellOffer(offer) && contract?.cancelationRequested)
  const textColor1 = isRedStatus || isOrangeStatus ? tw`text-white-1` : tw`text-grey-2`
  const textColor2 = isRedStatus || isOrangeStatus ? tw`text-white-1` : tw`text-grey-1`

  const navigate = () =>
    navigateToOffer({
      offer,
      status,
      requiredAction,
      navigation,
      updateOverlay,
      matchStoreSetOffer,
    })
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
                  {isSellOffer(offer) && contract?.cancelationRequested ? (
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
            {requiredAction && !contract?.disputeActive && (isBuyOffer(offer) || !contract?.cancelationRequested) ? (
              <View style={tw`flex items-center mt-3 mb-1`}>
                <PrimaryButton onPress={navigate} narrow>
                  {i18n(`offer.requiredAction.${requiredAction}`)}
                </PrimaryButton>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={tw`flex-row justify-between items-center p-2`}>
            <View style={tw`flex-row items-center`}>
              <Icon
                id={isSellOffer(offer) ? 'sell' : 'buy'}
                style={tw`w-5 h-5 mr-2`}
                color={
                  (requiredAction || contract?.disputeActive
                    ? tw`text-white-1`
                    : isSellOffer(offer)
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
