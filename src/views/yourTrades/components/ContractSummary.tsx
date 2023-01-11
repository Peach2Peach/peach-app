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
    <ChatButton contract={props.contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
    <TradeSummary {...props} />
  </View>
)
