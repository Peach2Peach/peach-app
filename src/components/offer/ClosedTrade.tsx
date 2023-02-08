import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { UserInfo } from '../matches/components'
import { HorizontalLine } from '../ui'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { Escrow } from './Escrow'
import { TradeSummaryProps } from './TradeSummary'

export const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller

  return (
    <View>
      <UserInfo user={tradingPartner} />

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      {contract.tradeStatus === 'tradeCanceled' ? (
        <CanceledTradeDetails {...contract} style={tw`self-center`} />
      ) : (
        <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
      )}

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      <Escrow contract={contract} />
    </View>
  )
}
