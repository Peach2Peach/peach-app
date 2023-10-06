import { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Icon, Input, PeachScrollView, Screen, Text } from '../../components'
import { NewButton } from '../../components/buttons/Button'
import { EmailInput } from '../../components/inputs/EmailInput'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useReportSetup } from './hooks/useReportSetup'

export const Report = () => {
  const {
    email,
    setEmail,
    isEmailValid,
    emailErrors,
    topic,
    setTopic,
    isTopicValid,
    topicErrors,
    message,
    setMessage,
    isMessageValid,
    messageErrors,
    account,
    shareDeviceID,
    toggleDeviceIDSharing,
    shareLogs,
    toggleShareLogs,
    submit,
  } = useReportSetup()

  let $topic = useRef<TextInput>(null).current
  let $message = useRef<TextInput>(null).current

  return (
    <Screen header={i18n('contact.title')}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <EmailInput
          onChange={setEmail}
          onSubmit={() => $topic?.focus()}
          value={email}
          placeholder={i18n('form.userEmail.placeholder')}
          errorMessage={emailErrors}
        />
        <Input
          onChange={setTopic}
          onSubmit={() => $message?.focus()}
          reference={(el) => ($topic = el)}
          value={topic}
          placeholder={i18n('form.topic.placeholder')}
          autoCorrect={false}
          errorMessage={topicErrors}
        />
        <Input
          style={tw`h-40`}
          onChange={setMessage}
          reference={(el) => ($message = el)}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={messageErrors}
        />
        {!account.publicKey && (
          <Pressable onPress={toggleDeviceIDSharing} style={tw`flex-row items-center pl-3`}>
            <View style={tw`items-center justify-center w-5 h-5`}>
              {shareDeviceID ? (
                <Icon id="checkboxMark" size={20} color={tw`text-primary-main`.color} />
              ) : (
                <View style={tw`w-4 h-4 border-2 rounded-sm border-black-3`} />
              )}
            </View>
            <Text style={tw`pl-2 subtitle-1`}>{i18n('form.includeDeviceIDHash')}</Text>
          </Pressable>
        )}
        <Pressable onPress={toggleShareLogs} style={tw`flex-row items-center pl-3`}>
          <View style={tw`flex items-center justify-center w-5 h-5`}>
            {shareLogs ? (
              <Icon id="checkboxMark" size={20} color={tw`text-primary-main`.color} />
            ) : (
              <View style={tw`w-4 h-4 border-2 rounded-sm border-black-3`} />
            )}
          </View>
          <Text style={tw`pl-2 subtitle-1`}>{i18n('form.shareLogs')}</Text>
        </Pressable>
      </PeachScrollView>
      <NewButton
        style={tw`self-center min-w-52`}
        onPress={submit}
        disabled={!(isEmailValid && isTopicValid && isMessageValid)}
      >
        {i18n('report.sendReport')}
      </NewButton>
    </Screen>
  )
}
