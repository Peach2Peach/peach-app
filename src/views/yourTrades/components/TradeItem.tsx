import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { ContractItem } from '../components/ContractItem'
import { OfferItem } from '../components/OfferItem'
import { isContractSummary } from '../utils'

type TradeItemProps = {
  item: TradeSummary
}
export const TradeItem = ({ item }: TradeItemProps) => (
  <View style={tw`mb-3`}>
    {isContractSummary(item) ? <ContractItem key={item.id} contract={item} /> : <OfferItem key={item.id} offer={item} />}
  </View>
)
