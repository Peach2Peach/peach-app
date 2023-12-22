import { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Icon } from '../../components/Icon'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { EmailInput } from '../../components/inputs/EmailInput'
import { Input } from '../../components/inputs/Input'
import { PeachText } from '../../components/text/PeachText'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useShowAppPopup } from '../../hooks/useShowAppPopup'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import { useValidatedState } from '../../hooks/useValidatedState'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import i18n from '../../utils/i18n'
import { submitReport } from './helpers/submitReport'

const emailRules = { email: true, required: true }
const required = { required: true }

export const Report = () => {
  const route = useRoute<'report'>()
  const navigation = useNavigation()
  const showReportSuccess = useShowAppPopup('reportSuccess')
  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState<string>('', emailRules)
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(route.params.topic || '', required)
  const [message, setMessage, isMessageValid, messageErrors] = useValidatedState(route.params.message || '', required)
  const [shareDeviceID, toggleDeviceIDSharing] = useToggleBoolean(route.params.shareDeviceID || false)
  const [shareLogs, toggleShareLogs] = useToggleBoolean(false)
  const reason = route.params.reason
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const showError = useShowErrorBanner()

  const submit = async () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid
    if (!isFormValid) return

    const { result, error: err } = await submitReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message,
      shareDeviceID,
      shareLogs,
    })

    if (result) {
      if (publicKey) {
        navigation.navigate('homeScreen', { screen: 'settings' })
      } else {
        navigation.navigate('welcome')
      }
      showReportSuccess()
      return
    }

    if (err) showError()
  }

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
        {!publicKey && (
          <Pressable onPress={toggleDeviceIDSharing} style={tw`flex-row items-center pl-3`}>
            <View style={tw`items-center justify-center w-5 h-5`}>
              {shareDeviceID ? (
                <Icon id="checkboxMark" size={20} color={tw.color('primary-main')} />
              ) : (
                <View style={tw`w-4 h-4 border-2 rounded-sm border-black-50`} />
              )}
            </View>
            <PeachText style={tw`pl-2 subtitle-1`}>{i18n('form.includeDeviceIDHash')}</PeachText>
          </Pressable>
        )}
        <Pressable onPress={toggleShareLogs} style={tw`flex-row items-center pl-3`}>
          <View style={tw`flex items-center justify-center w-5 h-5`}>
            {shareLogs ? (
              <Icon id="checkboxMark" size={20} color={tw.color('primary-main')} />
            ) : (
              <View style={tw`w-4 h-4 border-2 rounded-sm border-black-50`} />
            )}
          </View>
          <PeachText style={tw`pl-2 subtitle-1`}>{i18n('form.shareLogs')}</PeachText>
        </Pressable>
      </PeachScrollView>
      <Button style={tw`self-center`} onPress={submit} disabled={!(isEmailValid && isTopicValid && isMessageValid)}>
        {i18n('report.sendReport')}
      </Button>
    </Screen>
  )
}
