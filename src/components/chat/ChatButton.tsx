import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Shadow } from '../../components'
import tw from '../../styles/tailwind'
import { getChat } from '../../utils/chat'
import { mildShadowOrange, mildShadowRed } from '../../utils/layout'
import { Text } from '../text'
import { Bubble } from '../ui'

export type NavigationProp = StackNavigationProp<RootStackParamList, 'offer'|'contract'>

type ChatButtonProps = ComponentProps & {
  contract: Contract,
  navigation: NavigationProp,
}
export const ChatButton = ({ contract, navigation, style }: ChatButtonProps): ReactElement => {
  const contractChat = getChat(contract.id)
  const messagesSeen = contractChat
    ? contractChat.messages.filter(m => m.date.getTime() <= contractChat.lastSeen.getTime()).length
    : 0
  const shadow = contract.disputeActive ? mildShadowRed : mildShadowOrange

  return <View style={style}>
    <Shadow {...shadow}>
      <Pressable onPress={() => navigation.replace('contractChat', { contractId: contract.id })}
        style={[
          tw`w-10 h-10 flex justify-center items-center rounded`,
          contract.disputeActive ? tw`bg-red` : tw`bg-peach-1`
        ]}>
        <Icon id="chat" style={tw`w-5 h-5`} color={tw`text-white-1`.color as string} />
        {contract.messages && contract.messages - messagesSeen > 0
          ? <Bubble color={tw`text-green`.color as string}
            style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}>
            <Text style={tw`text-sm font-baloo text-white-1 text-center`}>{contract.messages - messagesSeen}</Text>
          </Bubble>
          : null
        }
      </Pressable>
    </Shadow>
  </View>
}