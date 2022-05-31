import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress } from '../../../components'
import { SATSINBTC } from '../../../constants'
import tw from '../../../styles/tailwind'

type FundingViewProps = {
  escrow: string,
  amount: number,
  label: string,
}
export default ({ escrow, amount, label }: FundingViewProps): ReactElement => <View>
  <BitcoinAddress
    address={escrow}
    amount={amount / SATSINBTC}
    label={label}
    showQR={true}
  />
</View>