import React, { ReactElement, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import { ChatButton } from '../chat/ChatButton'
import { MatchCardCounterparty } from '../matches/components/MatchCardCounterparty'
import PeachScrollView from '../PeachScrollView'
import { HorizontalLine } from '../ui'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { Escrow } from './Escrow'
import { TradeSummaryProps } from './TradeSummary'

export const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller
  let scroll = useRef<ScrollView>(null).current
  useEffect(() => {
    scroll?.flashScrollIndicators()
  }, [scroll])

  return (
    <>
      <View style={tw`px-7`}>
        <MatchCardCounterparty user={tradingPartner} />

        <HorizontalLine style={tw`my-6`} />
      </View>

      <PeachScrollView
        contentContainerStyle={tw`px-7`}
        scrollRef={(ref) => (scroll = ref)}
        showsVerticalScrollIndicator
        persistentScrollbar
      >
        {contract.tradeStatus === 'tradeCanceled' ? (
          <CanceledTradeDetails {...contract} style={tw`self-center`} />
        ) : (
          <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
        )}

        <HorizontalLine style={tw`mt-6`} />
        <View style={tw`flex-row justify-center mt-6`}>
          {(!!contract.escrow || !!contract.releaseTxId) && <Escrow contract={contract} style={tw`mr-3 min-w-24`} />}
          <ChatButton contract={contract} style={tw`min-w-24`} />
        </View>
      </PeachScrollView>
    </>
  )
}
