import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Bubble, Button, Headline, SatsFormat, Shadow, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { IconType } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getContractChatNotification } from '../../../utils/chat'
import { contractIdToHex, getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'
import { StackNavigation } from '../../../utils/navigation'
import { isBuyOffer, isSellOffer, offerIdToHex } from '../../../utils/offer'
import { getOfferStatus } from '../../../utils/offer/status'
import { navigateToOffer } from '../utils/navigateToOffer'

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer
  extended?: boolean
  navigation: StackNavigation
}

type IconMap = { [key in TradeStatus['status']]?: IconType } & { [key in TradeStatus['requiredAction']]?: IconType }

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
  dispute: 'dispute',
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

  const icon = contract?.disputeWinner ? 'dispute' : ICONMAP[requiredAction] || ICONMAP[status]
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
    })
  return (
    <Shadow shadow={mildShadow}>
      <Pressable
        onPress={navigate}
        style={[
          tw`rounded`,
          isRedStatus ? tw`bg-red` : isOrangeStatus ? tw`bg-peach-1` : tw`border bg-white-1 border-grey-2`,
          style,
        ]}
      >
        {extended ? (
          <View style={tw`px-4 py-2`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`flex-shrink w-full`}>
                <Headline style={[tw`text-lg font-bold text-left normal-case`, textColor1]}>
                  {i18n('trade')} {contract ? contractIdToHex(contract.id) : offerIdToHex(offer.id as Offer['id'])}
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
              <Icon id={icon || 'help'} style={tw`w-7 h-7`} color={textColor1.color as string} />
            </View>
            {requiredAction && !contract?.disputeActive && (isBuyOffer(offer) || !contract?.cancelationRequested) ? (
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
          <View style={tw`flex-row items-center justify-between p-2`}>
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
                  ).color as string
                }
              />
              <Text
                style={[tw`text-lg`, requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-1`]}
              >
                {i18n('trade')} {contract ? contractIdToHex(contract.id) : offerIdToHex(offer.id as Offer['id'])}
              </Text>
            </View>
            <Icon
              id={icon || 'help'}
              style={tw`w-5 h-5`}
              color={(requiredAction || contract?.disputeActive ? tw`text-white-1` : tw`text-grey-2`).color as string}
            />
          </View>
        )}
        {notifications > 0 ? (
          <Bubble
            color={tw`text-green`.color as string}
            style={tw`absolute top-0 right-0 flex items-center justify-center w-4 -m-2`}
          >
            <Text style={tw`text-xs text-center font-baloo text-white-1`} ellipsizeMode="head" numberOfLines={1}>
              {notifications}
            </Text>
          </Bubble>
        ) : null}
      </Pressable>
    </Shadow>
  )
}
