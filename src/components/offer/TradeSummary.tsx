import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { isTradeCanceled, isTradeComplete } from '../../utils/offer/status'
import { openAppLink } from '../../utils/web'
import Card from '../Card'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { paymentDetailTemplates } from '../payment'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type TradeSummaryProps = ComponentProps & {
  contract: Contract
  view: 'seller' | 'buyer' | ''
  navigation: Navigation
}

type PaymentMethodProps = {
  paymentMethod: PaymentMethod
  showLink: boolean
}
const PaymentMethod = ({ paymentMethod, showLink }: PaymentMethodProps): ReactElement => {
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const openLink = () => (url ? openAppLink(url, appLink) : null)

  return (
    <View>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n(paymentMethod === 'cash' ? 'contract.summary.in' : 'contract.summary.on')}
      </Headline>
      <Selector
        items={[
          {
            value: paymentMethod,
            display: i18n(`paymentMethod.${paymentMethod}`),
          },
        ]}
        style={tw`mt-2`}
      />
      {url && showLink ? (
        <Pressable style={tw`flex-row justify-center items-center`} onPress={openLink}>
          <Text style={tw`text-peach-1 underline`}>{i18n(/giftCard/u.test(paymentMethod) ? 'buy' : 'open')}</Text>
          <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
        </Pressable>
      ) : null}
    </View>
  )
}

const Escrow = ({ contract }: TradeSummaryProps): ReactElement => (
  <View>
    <Headline style={tw`text-grey-2 normal-case mt-4`}>
      {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
    </Headline>
    <Pressable
      style={tw`flex-row justify-center items-center`}
      onPress={() =>
        contract.releaseTxId
          ? showTransaction(contract.releaseTxId as string, NETWORK)
          : showAddress(contract.escrow, NETWORK)
      }
    >
      <Text style={tw`text-grey-2 underline`}>{i18n('escrow.viewInExplorer')}</Text>
      <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
    </Pressable>
  </View>
)

const OpenTradeSeller = ({ contract, navigation }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.buyer.id, user: contract.buyer })

  return (
    <View>
      <View style={tw`p-5`}>
        <Headline style={tw`text-grey-2 normal-case`}>{i18n('buyer')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.buyer.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.willPayYou')}</Headline>
        <Text style={tw`text-center text-grey-2`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toFixed(2))}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        {contract.paymentData && PaymentTo ? (
          <PaymentTo paymentData={contract.paymentData} country={contract.country} />
        ) : null}
        <HorizontalLine style={tw`mt-4`} />
        <PaymentMethod paymentMethod={contract.paymentMethod} showLink={false} />

        {contract.escrow || contract.releaseTxId ? (
          <View>
            <HorizontalLine style={tw`mt-4`} />
            <Escrow contract={contract} view={''} navigation={navigation} />
          </View>
        ) : null}
      </View>
    </View>
  )
}

const OpenTradeBuyer = ({ contract, navigation }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.seller.id, user: contract.seller })
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={tw`border border-peach-1 rounded`}>
      {contract.paymentMade ? (
        <View style={tw`absolute top-0 left-0 w-full h-full z-20`} pointerEvents="none">
          <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
          <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
            {i18n('contract.payment.made')}
          </Text>
        </View>
      ) : null}
      <View style={tw`p-5`}>
        <Headline style={tw`text-grey-2 normal-case`}>{i18n('seller')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.seller.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.youShouldPay')}</Headline>
        <Text style={tw`text-center text-grey-2`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toFixed(2))}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        {contract.paymentData && PaymentTo ? (
          <PaymentTo
            paymentData={contract.paymentData}
            country={contract.country}
            appLink={appLink?.appLink}
            fallbackUrl={appLink?.url}
          />
        ) : null}
        <HorizontalLine style={tw`mt-4`} />
        <PaymentMethod paymentMethod={contract.paymentMethod} showLink={true} />

        {contract.escrow || contract.releaseTxId ? (
          <View>
            <HorizontalLine style={tw`mt-4`} />
            <Escrow contract={contract} view={''} navigation={navigation} />
          </View>
        ) : null}
      </View>
    </View>
  )
}

const OpenTrade = ({ contract, view, navigation }: TradeSummaryProps): ReactElement =>
  view === 'seller' ? (
    <OpenTradeSeller contract={contract} view={view} navigation={navigation} />
  ) : (
    <OpenTradeBuyer contract={contract} view={view} navigation={navigation} />
  )

const ClosedTrade = ({ contract, view, navigation }: TradeSummaryProps): ReactElement => {
  const ratingTradingPartner = view === 'seller' ? contract.ratingBuyer : contract.ratingSeller
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller
  const disputeOutcome
    = contract.disputeWinner && !contract.disputeActive ? (contract.disputeWinner === view ? 'won' : 'lost') : null

  const goToUserProfile = () => navigation.navigate('profile', { userId: tradingPartner.id, user: tradingPartner })

  return (
    <View>
      {disputeOutcome ? (
        <View
          style={[
            tw`absolute top-0 left-0 w-full h-full z-20 border`,
            disputeOutcome === 'lost' ? tw`border-red` : tw`border-green`,
          ]}
          pointerEvents="none"
        >
          <Text
            style={[
              tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`,
              disputeOutcome === 'lost' ? tw`text-red` : tw`text-green`,
            ]}
          >
            {i18n(`dispute.${disputeOutcome}`)}
          </Text>
        </View>
      ) : null}
      <View style={tw`p-5 opacity-50`}>
        <Headline style={tw`text-grey-2 normal-case`}>
          {isTradeCanceled(contract)
            ? i18n(`contract.summary.${view === 'seller' ? 'youAreSelling' : 'youAreBuying'}`)
            : i18n(`contract.summary.${view === 'seller' ? 'youHaveSold' : 'youHaveBought'}`)}
        </Headline>
        <Text style={tw`text-center`}>
          <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.for')}</Headline>
        <Text style={tw`text-center`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toString())}
          <Text>
            {' '}
            ({contract.premium > 0 ? '+' : '-'}
            {Math.abs(contract.premium)}%)
          </Text>
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>
          {i18n(view === 'seller' ? 'contract.payment.to' : 'contract.summary.from')}
        </Headline>
        <View style={tw`flex-row justify-center items-center`}>
          <Text onPress={goToUserProfile}>Peach{tradingPartner.id.substring(0, 8)}</Text>
          {ratingTradingPartner === 1 ? (
            <Icon id="positive" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
          ) : ratingTradingPartner === -1 ? (
            <Icon id="negative" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
          ) : null}
        </View>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.in')}</Headline>
        <Selector items={[{ value: contract.currency, display: contract.currency }]} style={tw`mt-2`} />
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.via')}</Headline>
        <Selector
          items={[
            {
              value: contract.paymentMethod,
              display: i18n(`paymentMethod.${contract.paymentMethod}`).toLowerCase(),
            },
          ]}
          style={tw`mt-2`}
        />

        {contract.escrow || contract.releaseTxId ? (
          <View>
            <HorizontalLine style={tw`mt-4`} />
            <Headline style={tw`text-grey-2 normal-case mt-4`}>
              {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
            </Headline>
            <Pressable
              style={tw`flex-row justify-center items-center`}
              onPress={() =>
                contract.releaseTxId
                  ? showTransaction(contract.releaseTxId as string, NETWORK)
                  : showAddress(contract.escrow, NETWORK)
              }
            >
              <Text>{i18n('escrow.viewInExplorer')}</Text>
              <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  )
}

export const TradeSummary = ({ contract, view, navigation, style }: TradeSummaryProps): ReactElement => (
  <Card style={style}>
    {!isTradeComplete(contract) && !isTradeCanceled(contract) ? (
      <OpenTrade contract={contract} view={view} navigation={navigation} />
    ) : (
      <ClosedTrade contract={contract} view={view} navigation={navigation} />
    )}
  </Card>
)
