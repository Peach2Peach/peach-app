import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { APPLINKS } from '../../constants'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import i18n from '../../utils/i18n'
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
      <Headline style={tw`mt-4 normal-case text-grey-2`}>
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
        <Pressable style={tw`flex-row items-center justify-center`} onPress={openLink}>
          <Text style={tw`underline text-peach-1`}>{i18n(/giftCard/u.test(paymentMethod) ? 'buy' : 'open')}</Text>
          <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
        </Pressable>
      ) : null}
    </View>
  )
}

const Escrow = ({ contract }: TradeSummaryProps): ReactElement => (
  <View>
    <Headline style={tw`mt-4 normal-case text-grey-2`}>
      {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
    </Headline>
    <Pressable
      style={tw`flex-row items-center justify-center`}
      onPress={() =>
        contract.releaseTxId
          ? showTransaction(contract.releaseTxId as string, NETWORK)
          : showAddress(contract.escrow, NETWORK)
      }
    >
      <Text style={tw`underline text-grey-2`}>{i18n('escrow.viewInExplorer')}</Text>
      <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
    </Pressable>
  </View>
)

const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  const navigation = useNavigation()
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.buyer.id, user: contract.buyer })

  return (
    <View>
      <View style={tw`p-5`}>
        <Headline style={tw`normal-case text-grey-2`}>{i18n('buyer')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.buyer.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.willPayYou')}</Headline>
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
            <Escrow contract={contract} view={''} />
          </View>
        ) : null}
      </View>
    </View>
  )
}

const OpenTradeBuyer = ({ contract }: TradeSummaryProps): ReactElement => {
  const navigation = useNavigation()
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.seller.id, user: contract.seller })
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={tw`border rounded border-peach-1`}>
      {contract.paymentMade ? (
        <View style={tw`absolute top-0 left-0 z-20 w-full h-full`} pointerEvents="none">
          <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
          <Text style={tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`}>
            {i18n('contract.payment.made')}
          </Text>
        </View>
      ) : null}
      <View style={tw`p-5`}>
        <Headline style={tw`normal-case text-grey-2`}>{i18n('seller')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.seller.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.youShouldPay')}</Headline>
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
            <Escrow contract={contract} view={''} />
          </View>
        ) : null}
      </View>
    </View>
  )
}

const OpenTrade = (props: TradeSummaryProps): ReactElement =>
  props.view === 'seller' ? <OpenTradeSeller {...props} /> : <OpenTradeBuyer {...props} />

const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const navigation = useNavigation()
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
            tw`absolute top-0 left-0 z-20 w-full h-full border`,
            disputeOutcome === 'lost' ? tw`border-red` : tw`border-green`,
          ]}
          pointerEvents="none"
        >
          <Text
            style={[
              tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`,
              disputeOutcome === 'lost' ? tw`text-red` : tw`text-green`,
            ]}
          >
            {i18n(`dispute.${disputeOutcome}`)}
          </Text>
        </View>
      ) : null}
      <View style={tw`p-5 opacity-50`}>
        <Headline style={tw`normal-case text-grey-2`}>
          {isTradeCanceled(contract)
            ? i18n(`contract.summary.${view === 'seller' ? 'youAreSelling' : 'youAreBuying'}`)
            : i18n(`contract.summary.${view === 'seller' ? 'youHaveSold' : 'youHaveBought'}`)}
        </Headline>
        <Text style={tw`text-center`}>
          <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.summary.for')}</Headline>
        <Text style={tw`text-center`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toString())}
          <Text>
            {' '}
            ({contract.premium > 0 ? '+' : '-'}
            {Math.abs(contract.premium)}%)
          </Text>
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>
          {i18n(view === 'seller' ? 'contract.payment.to' : 'contract.summary.from')}
        </Headline>
        <View style={tw`flex-row items-center justify-center`}>
          <Text onPress={goToUserProfile}>Peach{tradingPartner.id.substring(0, 8)}</Text>
          {ratingTradingPartner === 1 ? (
            <Icon id="thumbsUp" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
          ) : ratingTradingPartner === -1 ? (
            <Icon id="thumbsDown" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
          ) : null}
        </View>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.summary.in')}</Headline>
        <Selector items={[{ value: contract.currency, display: contract.currency }]} style={tw`mt-2`} />
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.summary.via')}</Headline>
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
            <Headline style={tw`mt-4 normal-case text-grey-2`}>
              {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
            </Headline>
            <Pressable
              style={tw`flex-row items-center justify-center`}
              onPress={() =>
                contract.releaseTxId
                  ? showTransaction(contract.releaseTxId as string, NETWORK)
                  : showAddress(contract.escrow, NETWORK)
              }
            >
              <Text>{i18n('escrow.viewInExplorer')}</Text>
              <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  )
}

export const TradeSummary = ({ contract, view, style }: TradeSummaryProps): ReactElement => (
  <Card style={style}>
    {!isTradeComplete(contract) && !isTradeCanceled(contract) ? (
      <OpenTrade {...{ contract, view }} />
    ) : (
      <ClosedTrade {...{ contract, view }} />
    )}
  </Card>
)
