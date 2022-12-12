import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Input, PeachScrollView, PrimaryButton, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import ReportSuccess from '../../overlays/ReportSuccess'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { sendReport } from '../../utils/peachAPI'
import { UNIQUEID } from '../../constants'
import { useNavigation, useRoute, useValidatedState } from '../../hooks'

const emailRules = { required: true, email: true }
const required = { required: true }

export default (): ReactElement => {
  const route = useRoute<'report'>()
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState('', emailRules)
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(route.params.topic || '', required)
  const [message, setMessage, isMessageValid, messageErrors] = useValidatedState(route.params.message || '', required)
  const [shareDeviceID, setShareDeviceID] = useState(route.params.shareDeviceID || false)
  const [displayErrors, setDisplayErrors] = useState(false)
  const reason = route.params.reason

  let $topic = useRef<TextInput>(null).current
  let $message = useRef<TextInput>(null).current

  const toggleDeviceIDSharing = () => setShareDeviceID((b) => !b)

  const submit = async () => {
    setDisplayErrors(true)
    const isFormValid = isEmailValid && isTopicValid && isMessageValid
    if (!isFormValid) return

    let messageToSend = message
    if (shareDeviceID) messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`

    const [result, err] = await sendReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message: messageToSend,
    })
    if (result) {
      updateOverlay({
        content: <ReportSuccess />,
        visible: true,
      })
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: () => navigation.navigate('contact'),
        actionLabel: i18n('contactUs'),
        actionIcon: 'mail',
      })
    }
  }

  return (
    <PeachScrollView contentContainerStyle={tw`flex-grow`}>
      <View style={tw`h-full items-center justify-end pt-6 px-6 pb-10`}>
        <Input
          onChange={setEmail}
          onSubmit={() => $topic?.focus()}
          value={email}
          placeholder={i18n('form.userEmail.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? emailErrors : undefined}
        />
        <Input
          onChange={setTopic}
          onSubmit={() => $message?.focus()}
          reference={(el: any) => ($topic = el)}
          value={topic}
          placeholder={i18n('form.topic.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? topicErrors : undefined}
        />
        <Input
          style={tw`h-40`}
          onChange={setMessage}
          reference={(el: any) => ($message = el)}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? messageErrors : undefined}
        />
        <Pressable onPress={toggleDeviceIDSharing} style={tw`flex-row justify-center items-center my-5`}>
          <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
            {shareDeviceID ? (
              <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-peach-1`.color} />
            ) : (
              <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
            )}
          </View>
          <Text style={tw`pl-2 flex-shrink subtitle-1`}>{i18n('form.includeDeviceIDHash')}</Text>
        </Pressable>

        <PrimaryButton onPress={submit} disabled={!(isEmailValid && isTopicValid && isMessageValid)} narrow>
          {i18n('report.sendReport')}
        </PrimaryButton>

        {route.name.toString() === 'reportFullScreen' && ( // to be deleted after header feature
          <PrimaryButton style={tw`mt-5`} onPress={navigation.goBack} narrow>
            {i18n('cancel')}
          </PrimaryButton>
        )}
      </View>
    </PeachScrollView>
  )
}
