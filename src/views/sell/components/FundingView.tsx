import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type FundingViewProps = {
  escrow: string,
}
export default ({ escrow }: FundingViewProps): ReactElement => <View>
  <BitcoinAddress
    style={tw`my-4`}
    address={escrow}
    showQR={true}
  />
</View>