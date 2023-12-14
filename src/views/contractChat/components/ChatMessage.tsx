import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Text } from '../../../components'
import { Icon } from '../../../components/Icon'
import { LinedText } from '../../../components/ui/LinedText'
import tw from '../../../styles/tailwind'
import { useAccountStore } from '../../../utils/account/account'
import { toDateFormat } from '../../../utils/date/toDateFormat'
import { toTimeFormat } from '../../../utils/date/toTimeFormat'
import i18n from '../../../utils/i18n'

type GetMessageMetaProps = {
  message: Message
  previous: Message
  tradingPartner: string
  online: boolean
}
type MessageMeta = {
  online: boolean
  showName: boolean
  name: string
  isYou: boolean
  isTradingPartner: boolean
  isMediator: boolean
  isSystemMessage: boolean
  readByCounterParty: boolean
}

const getMessageMeta = ({ message, previous, tradingPartner, online }: GetMessageMetaProps): MessageMeta => {
  const publicKey = useAccountStore.getState().account.publicKey
  const isYou = message.from === publicKey
  const isTradingPartner = message.from === tradingPartner
  const isMediator = !isYou && !isTradingPartner
  const isSystemMessage = message.from === 'system'
  const readByCounterParty = message.readBy?.includes(tradingPartner)
  const showName = !previous || previous.from !== message.from
  const name = i18n(
    isSystemMessage ? 'chat.systemMessage' : isMediator ? 'chat.mediator' : isYou ? 'chat.you' : 'chat.tradePartner',
  )
  return {
    online,
    showName,
    name,
    isYou,
    isTradingPartner,
    isMediator,
    isSystemMessage,
    readByCounterParty,
  }
}

type MessageStyling = {
  text: ViewStyle
  bgColor: ViewStyle
  statusIcon: IconType
  statusIconColor: TextStyle
}
const getMessageStyling = (message: Message, meta: MessageMeta): MessageStyling => {
  const text = meta.isMediator || meta.isSystemMessage ? tw`text-primary-main` : tw`text-black-2`
  const bgColor = !message.message
    ? tw`bg-error-background`
    : meta.isMediator || meta.isSystemMessage
      ? tw`bg-primary-mild-1`
      : meta.isYou
        ? tw`bg-info-background`
        : tw`bg-black-6`
  const statusIcon
    = message.readBy?.length === 0
      ? !meta.online
        ? 'offline'
        : 'clock'
      : meta.readByCounterParty
        ? 'chatDoubleCheck'
        : 'check'
  const statusIconColor = statusIcon === 'chatDoubleCheck' ? tw`text-info-main` : tw`text-black-3`
  return {
    text,
    bgColor,
    statusIcon,
    statusIconColor,
  }
}
type ChatMessageProps = {
  chatMessages: Message[]
  tradingPartner: string
  item: Message
  index: number
  online: boolean
  resendMessage: (message: Message) => void
}

export const ChatMessage = ({
  chatMessages,
  tradingPartner,
  item: message,
  index,
  online,
  resendMessage,
}: ChatMessageProps) => {
  const meta = getMessageMeta({
    message,
    previous: chatMessages[index - 1],
    tradingPartner,
    online,
  })
  const { statusIcon, statusIconColor, text, bgColor } = getMessageStyling(message, meta)

  const isChangeDate = index === 0 || toDateFormat(message.date) !== toDateFormat(chatMessages[index - 1].date)

  return (
    <>
      {isChangeDate && (
        <LinedText style={tw`mb-5 px-sm pt-7`}>
          <Text style={tw`body-m text-black-2`}>{toDateFormat(message.date)}</Text>
        </LinedText>
      )}
      <View
        onStartShouldSetResponder={() => true}
        style={[tw`w-10/12 bg-transparent px-sm`, meta.isYou && tw`self-end`]}
      >
        {meta.showName && !meta.isYou && <Text style={[tw`px-1 mt-4 -mb-2 subtitle-2`, text]}>{meta.name}</Text>}
        <View style={[tw`px-3 py-2 mt-2 rounded-2xl`, bgColor]}>
          <Text style={tw`shrink-0`} selectable>
            {message.message || i18n('chat.decyptionFailed')}
          </Text>
          <Text style={tw`pt-1 ml-auto leading-5 text-right`}>
            <Text style={tw`subtitle-2 leading-xs text-black-3`}>
              {toTimeFormat(message.date.getHours(), message.date.getMinutes())}
            </Text>
            {meta.isYou && (
              <View style={tw`pl-1`}>
                <Icon id={statusIcon} style={tw`relative w-4 h-4 -bottom-1`} color={statusIconColor.color} />
              </View>
            )}
          </Text>
        </View>
        {message.failedToSend && (
          <TouchableOpacity
            onPress={() => resendMessage(message)}
            style={tw`flex-row justify-end items-center mt-1 pr-3 mr-0.5`}
          >
            <Text style={tw`mr-1 text-error-main`}>
              {i18n('chat.failedToSend')} <Text style={tw`underline text-error-main`}>{i18n('retry')}</Text>
            </Text>
            <Icon id="refreshCcw" style={tw`w-3 h-3`} color={tw.color('error-main')} />
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}
