import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Shadow } from '../../components'
import tw from '../../styles/tailwind'
import { getContractChatNotification } from '../../utils/chat'
import { mildShadowOrange, mildShadowRed } from '../../utils/layout'
import { Text } from '../text'
import { Bubble } from '../ui'

export type Navigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>

type ChatButtonProps = ComponentProps & {
  contract: Contract
  navigation: Navigation
}
export const ChatButton = ({ contract, navigation, style }: ChatButtonProps): ReactElement => {
  const notifications = getContractChatNotification(contract)
  const shadow = contract.disputeActive ? mildShadowRed : mildShadowOrange
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })

  return (
    <View style={style}>
      <Shadow shadow={shadow}>
        <Pressable
          onPress={goToChat}
          style={[
            tw`w-10 h-10 flex justify-center items-center rounded`,
            contract.disputeActive ? tw`bg-red` : tw`bg-peach-1`,
          ]}
        >
          <Icon id="chat" style={tw`w-5 h-5`} color={tw`text-white-1`.color as string} />
          {notifications > 0 ? (
            <Bubble
              color={tw`text-green`.color as string}
              style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}
            >
              <Text style={tw`text-xs font-baloo text-white-1 text-center`} ellipsizeMode="head" numberOfLines={1}>
                {notifications}
              </Text>
            </Bubble>
          ) : null}
        </Pressable>
      </Shadow>
    </View>
  )
}
