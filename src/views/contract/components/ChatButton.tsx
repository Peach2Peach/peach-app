import { TouchableOpacity } from 'react-native'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { getContractChatNotification } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { NewChatMessages } from '../../yourTrades/components/ChatMessages'
import { Text } from '../../../components/text'

export const ChatButton = ({ style }: ComponentProps) => {
  const { contract } = useContractContext()
  const navigation = useNavigation()
  const notifications = getContractChatNotification(contract)
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })

  return (
    <TouchableOpacity
      onPress={goToChat}
      style={[
        tw`flex-row items-center justify-center px-2 rounded-lg bg-primary-main`,
        contract.disputeActive && tw`bg-error-main`,
        style,
      ]}
    >
      <Text style={tw`button-medium text-primary-background-light`}>{i18n('chat')}</Text>
      <NewChatMessages messages={notifications} style={tw`ml-1`} />
    </TouchableOpacity>
  )
}
