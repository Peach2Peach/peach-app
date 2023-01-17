import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { usePublicProfileNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { isTradeCanceled } from '../../utils/contract/status'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { TradeSummaryProps } from './TradeSummary'

export const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const ratingTradingPartner = view === 'seller' ? contract.ratingBuyer : contract.ratingSeller
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller
  const disputeOutcome
    = contract.disputeWinner && !contract.disputeActive ? (contract.disputeWinner === view ? 'won' : 'lost') : null

  const goToUserProfile = usePublicProfileNavigation(tradingPartner.id)

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
