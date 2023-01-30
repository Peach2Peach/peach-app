import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Shadow } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { getContractChatNotification } from '../../utils/chat'
import { mildShadowOrange, mildShadowRed } from '../../utils/layout'
import { ChatMessages } from '../../views/yourTrades/components/ChatMessages'
import { Text } from '../text'
import { Bubble } from '../ui'

export type Navigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>

type ChatButtonProps = ComponentProps & {
  contract: Contract
}
export const ChatButton = ({ contract, style }: ChatButtonProps): ReactElement => {
  const navigation = useNavigation()
  const notifications = getContractChatNotification(contract)
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })

  return (
    <TouchableOpacity
      onPress={goToChat}
      style={[
        tw`items-center justify-center w-10 h-10 rounded-xl `,
        contract.disputeActive ? tw`bg-warning-dark-2` : tw`bg-primary-main`,
        style,
      ]}
    >
      <ChatMessages messages={notifications} level={contract.disputeActive ? 'WARN' : 'APP'} />
    </TouchableOpacity>
  )
}
