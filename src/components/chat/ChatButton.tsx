import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Shadow } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { getContractChatNotification } from '../../utils/chat'
import { mildShadowOrange, mildShadowRed } from '../../utils/layout'
import { Text } from '../text'
import { Bubble } from '../ui'

export type Navigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>

type ChatButtonProps = ComponentProps & {
  contract: Contract
}
export const ChatButton = ({ contract, style }: ChatButtonProps): ReactElement => {
  const navigation = useNavigation()
  const notifications = getContractChatNotification(contract)
  const shadow = contract.disputeActive ? mildShadowRed : mildShadowOrange
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })

  return (
    <View style={style}>
      <Shadow shadow={shadow}>
        <Pressable
          onPress={goToChat}
          style={[
            tw`flex items-center justify-center w-10 h-10 rounded`,
            contract.disputeActive ? tw`bg-red` : tw`bg-peach-1`,
          ]}
        >
          <Icon id="messageCircle" style={tw`w-5 h-5`} color={tw`text-white-1`.color} />
          {notifications > 0 ? (
            <Bubble
              color={tw`text-green`.color}
              style={tw`absolute top-0 right-0 flex items-center justify-center w-4 -m-2`}
            >
              <Text style={tw`text-xs text-center font-baloo text-white-1`} ellipsizeMode="head" numberOfLines={1}>
                {notifications}
              </Text>
            </Bubble>
          ) : null}
        </Pressable>
      </Shadow>
    </View>
  )
}
