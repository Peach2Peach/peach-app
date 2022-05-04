import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Image, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { unique } from '../../utils/array'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Card from '../Card'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type TradeSummaryProps = ComponentProps & {
  type: 'ask' | 'bid'
  contract: Contract
}
// eslint-disable-next-line max-lines-per-function
export const TradeSummary = ({ type, contract, style }: TradeSummaryProps): ReactElement => {
  const ratingTradingPartner = type === 'ask' ? contract.ratingBuyer : contract.ratingSeller

  return <Card style={[tw`p-5`, style]}>
    <Headline style={tw`text-grey-1 normal-case`}>
      {!contract.canceled
        ? i18n(`contract.summary.${type === 'ask' ? 'youHaveSold' : 'youHaveBought'}`)
        : i18n(`contract.summary.${type === 'ask' ? 'youAreSelling' : 'youAreBuying'}`)
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
        {(type === 'ask' ? contract.buyer : contract.seller).id.substring(0, 8)}
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
  </Card>
}