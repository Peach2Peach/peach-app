import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Image, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { isTradeCanceled, isTradeComplete } from '../../utils/offer/getOfferStatus'
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
}
const PaymentMethod = ({ paymentMethod }: PaymentMethodProps): ReactElement => <View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.on')}</Headline>
  <Selector
    items={[
      {
        value: paymentMethod,
        display: i18n(`paymentMethod.${paymentMethod}`).toLowerCase()
      }
    ]}
    style={tw`mt-2`}
  />
</View>

const Escrow = ({ contract }: TradeSummaryProps): ReactElement => <View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>
    {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
  </Headline>
  <Pressable style={tw`flex-row justify-center items-center`}
    onPress={() => contract.releaseTxId
      ? showTransaction(contract.releaseTxId as string, NETWORK)
      : showAddress(contract.escrow, NETWORK)
    }>
    <Text style={tw`text-grey-2 underline`}>
      {i18n('escrow.viewInExplorer')}
    </Text>
    <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
  </Pressable>
</View>

const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  return <View>
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-2 normal-case`}>
        {i18n('buyer')}
      </Headline>
      <Text style={tw`text-center text-grey-2`}>
        {contract.buyer.id.substring(0, 8)}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n('contract.willPayYou')}
      </Headline>
      {contract.paymentData && PaymentTo
        ? <PaymentTo paymentData={contract.paymentData}/>
        : null
      }
      <HorizontalLine style={tw`mt-4`}/>
      <PaymentMethod paymentMethod={contract.paymentMethod} />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Escrow contract={contract} view={''} />
        </View>
        : null
      }
    </View>
  </View>
}

const OpenTradeBuyer = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  return <View style={tw`border border-peach-1 rounded`}>
    {contract.paymentMade
      ? <View style={tw`absolute top-0 left-0 w-full h-full z-20 pointer-events-none`} pointerEvents="none">
        <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
        <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
          {i18n('contract.payment.made')}
        </Text>
      </View>
      : null
    }
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-2 normal-case`}>
        {i18n('contract.youShouldPay')}
      </Headline>
      <Text style={tw`text-center text-grey-2`}>
        {i18n(
          `currency.format.${contract.currency}`,
          contract.price.toFixed(2)
        )}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      {contract.paymentData && PaymentTo
        ? <PaymentTo paymentData={contract.paymentData}/>
        : null
      }
      <HorizontalLine style={tw`mt-4`}/>
      <PaymentMethod paymentMethod={contract.paymentMethod} />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Escrow contract={contract} view={''} />
        </View>
        : null
      }
    </View>
  </View>
}

const OpenTrade = ({ contract, view }: TradeSummaryProps): ReactElement =>
  view === 'seller'
    ? <OpenTradeSeller contract={contract} view={view} />
    : <OpenTradeBuyer contract={contract} view={view} />

// eslint-disable-next-line max-lines-per-function
const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const ratingTradingPartner = view === 'seller' ? contract.ratingBuyer : contract.ratingSeller

  return <View>
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-1 normal-case`}>
        {!isTradeCanceled(contract)
          ? i18n(`contract.summary.${view === 'seller' ? 'youAreSelling' : 'youAreBuying'}`)
          : i18n(`contract.summary.${view === 'seller' ? 'youHaveSold' : 'youHaveBought'}`)
        }
      </Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={contract.amount} color={tw`text-black-1`} />
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('contract.summary.for')}</Headline>
      <Text style={tw`text-center`}>
        {i18n(`currency.format.${contract.currency}`, contract.price.toString())}
        <Text> ({contract.premium > 0 ? '+' : '-'}{Math.abs(contract.premium)}%)</Text>
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('contract.summary.from')}</Headline>
      <View style={tw`flex-row justify-center items-center`}>
        <Image source={require('../../../assets/favico/peach-logo.png')}
          style={[tw`w-4 h-4 mr-1`, { resizeMode: 'contain' }]}
        />
        <Text>
          {(view === 'seller' ? contract.buyer : contract.seller).id.substring(0, 8)}
        </Text>
        {ratingTradingPartner === 1
          ? <Icon id="positive" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string}/>
          : ratingTradingPartner === -1
            ? <Icon id="negative" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string}/>
            : null
        }
      </View>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('contract.summary.in')}</Headline>
      <Selector items={[{ value: contract.currency, display: contract.currency }]}
        style={tw`mt-2`}/>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('contract.summary.via')}</Headline>
      <Selector
        items={[
          {
            value: contract.paymentMethod,
            display: i18n(`paymentMethod.${contract.paymentMethod}`).toLowerCase()
          }
        ]}
        style={tw`mt-2`}
      />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Headline style={tw`text-grey-1 normal-case mt-4`}>
            {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
          </Headline>
          <Pressable style={tw`flex-row justify-center items-center`}
            onPress={() => contract.releaseTxId
              ? showTransaction(contract.releaseTxId as string, NETWORK)
              : showAddress(contract.escrow, NETWORK)
            }>
            <Text>
              {i18n('escrow.viewInExplorer')}
            </Text>
            <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
          </Pressable>
        </View>
        : null
      }
    </View>
  </View>
}

export const TradeSummary = ({ contract, view, style }: TradeSummaryProps): ReactElement =>
  <Card style={style}>
    {!isTradeComplete(contract) && !isTradeCanceled(contract)
      ? <OpenTrade contract={contract} view={view} />
      : <ClosedTrade contract={contract} view={view} />
    }
  </Card>