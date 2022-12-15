import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Shadow, Text } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'
import ContractActions from './ContractActions'

type ChatHeaderProps = {
  contract: Contract
}

export const ChatHeader = ({ contract }: ChatHeaderProps): ReactElement => {
  const navigation = useNavigation()
  const view = account.publicKey === contract.seller.id ? 'seller' : 'buyer'
  const goBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('contract', { contract, contractId: contract.id })

  return (
    <Shadow shadow={mildShadow}>
      <View style={tw`w-full flex-row items-center p-1 bg-white-1`}>
        <Pressable onPress={goBack}>
          <Icon id={'arrowLeft'} style={tw`w-10 h-10 flex-shrink-0`} color={tw`text-peach-1`.color} />
        </Pressable>
        <Text style={tw`items-center text-peach-1 text-xl font-bold`}>
          {i18n(contract.disputeActive ? 'dispute.chat' : 'trade.chat')}
        </Text>
        <ContractActions style={tw`flex-row-reverse content-end flex-grow ml-2`} {...{ contract, view }} />
      </View>
    </Shadow>
  )
}
