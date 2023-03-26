import { StackNavigationProp } from '@react-navigation/stack'
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { getContractChatNotification } from '../../utils/chat'
import i18n from '../../utils/i18n'
import { ChatMessages } from '../../views/yourTrades/components/ChatMessages'
import { Text } from '../text'

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
        tw`flex-row items-center justify-center px-2 rounded-lg bg-primary-main`,
        contract.disputeActive && tw`bg-warning-main`,
        style,
      ]}
    >
      <Text style={tw`button-medium text-primary-background-light`}>{i18n('chat')}</Text>
      <ChatMessages
        style={tw`w-4 h-4 ml-1 -mt-px`}
        textStyle={[tw`text-[10px]`, contract.disputeActive && tw`text-black-1`]}
        messages={notifications}
      />
    </TouchableOpacity>
  )
}
