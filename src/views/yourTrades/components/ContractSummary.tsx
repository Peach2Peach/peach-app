import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { TradeSummary } from '../../../components'
import { ChatButton } from '../../../components/chat/ChatButton'
import tw from '../../../styles/tailwind'

type ContractSummaryProps = {
  contract: Contract
  view: 'buyer' | 'seller' | ''
}
export const ContractSummary = (props: ContractSummaryProps): ReactElement => (
  <View>
    <ChatButton contract={props.contract} style={tw`absolute top-4 right-0 -mr-4 z-10`} />
    <TradeSummary {...props} />
  </View>
)
