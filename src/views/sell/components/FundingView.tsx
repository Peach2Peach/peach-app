import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type FundingViewProps = {
  escrow: string,
  fundingStatus: FundingStatus,
}
export default ({ escrow, fundingStatus }: FundingViewProps): ReactElement => <View>
  <BitcoinAddress
    style={tw`my-4`}
    address={escrow}
    showQR={true}
  />
  <Text>Confirmations: {fundingStatus.confirmations}</Text>
  <Text>Status: {fundingStatus.status}</Text>
</View>