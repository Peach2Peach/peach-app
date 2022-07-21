import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { TradeSummary } from '../../../components'
import { ChatButton } from '../../../components/chat/ChatButton'
import tw from '../../../styles/tailwind'
import { isTradeCanceled } from '../../../utils/offer/getOfferStatus'
import { OfferScreenNavigationProp } from '../Offer'

type ContractSummaryProps = {
  contract: Contract,
  view: 'buyer' | 'seller' | '',
  navigation: OfferScreenNavigationProp,
}
export const ContractSummary = ({ contract, view, navigation }: ContractSummaryProps): ReactElement => <View>
  <View>
    <ChatButton contract={contract} navigation={navigation} style={tw`absolute top-4 right-0 -mr-4 z-10`}/>
    <TradeSummary view={view} contract={contract}
      navigation={navigation}
    />
  </View>
</View>