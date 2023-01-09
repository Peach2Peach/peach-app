import React, { ReactElement, useContext, useMemo, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Input, PeachScrollView, PrimaryButton, Text } from '../../components'
import { APPVERSION, BUILDNUMBER, UNIQUEID } from '../../constants'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../hooks'
import { showReportSuccess } from '../../overlays/showReportSuccess'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { sendReport } from '../../utils/peachAPI'

const emailRules = { email: true, required: true }
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
  const reason = route.params.reason

  let $topic = useRef<TextInput>(null).current
  let $message = useRef<TextInput>(null).current

  useHeaderSetup(useMemo(() => ({ title: i18n('contact.title') }), []))

  const toggleDeviceIDSharing = () => setShareDeviceID((b) => !b)

  const submit = async () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid
    if (!isFormValid) return

    let messageToSend = message
    if (shareDeviceID) messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`
    messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`

    const [result, err] = await sendReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message: messageToSend,
    })
    if (result) {
      showReportSuccess(updateOverlay)
      // Clear all fields
      setEmail('')
      setTopic(route.params.topic || '')
      setMessage(route.params.message || '')
      setShareDeviceID(false)
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
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
          errorMessage={emailErrors}
        />
        <Input
          onChange={setTopic}
          onSubmit={() => $message?.focus()}
          reference={(el: any) => ($topic = el)}
          value={topic}
          placeholder={i18n('form.topic.placeholder')}
          autoCorrect={false}
          errorMessage={topicErrors}
        />
        <Input
          style={tw`h-40`}
          onChange={setMessage}
          reference={(el: any) => ($message = el)}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={messageErrors}
        />
        <Pressable onPress={toggleDeviceIDSharing} style={tw`flex-row justify-center items-center my-5`}>
          <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
            {shareDeviceID ? (
              <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
            ) : (
              <View style={tw`w-4 h-4 rounded-sm border-2 border-black-3`} />
            )}
          </View>
          <Text style={tw`pl-2 flex-shrink subtitle-1`}>{i18n('form.includeDeviceIDHash')}</Text>
        </Pressable>

        <PrimaryButton onPress={submit} disabled={!(isEmailValid && isTopicValid && isMessageValid)} narrow>
          {i18n('report.sendReport')}
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
