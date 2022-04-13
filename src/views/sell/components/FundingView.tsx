import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress } from '../../../components'
import tw from '../../../styles/tailwind'

type FundingViewProps = {
  escrow: string,
  amount: number,
  label: string,
}
export default ({ escrow, amount, label }: FundingViewProps): ReactElement => <View>
  <BitcoinAddress
    style={tw`my-4`}
    address={escrow}
    amount={amount / 100000000}
    label={label}
    showQR={true}
  />
</View>