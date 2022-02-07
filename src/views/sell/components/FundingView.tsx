import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress, Text } from '../../../components'
import { PEACHFEE } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type FundingViewProps = {
  offer: SellOffer,
  escrow: string,
  fundingStatus: FundingStatus,
}
export default ({ offer, escrow, fundingStatus }: FundingViewProps): ReactElement => <View>
  <Text>Send: {Math.round(offer.amount * (1 + PEACHFEE / 100))} sats to</Text>
  <BitcoinAddress
    style={tw`my-4`}
    address={escrow}
    showQR={true}
  />
  <Text>Confirmations: {fundingStatus.confirmations}</Text>
  <Text>Status: {fundingStatus.status}</Text>
</View>