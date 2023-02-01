import React, { ReactElement, useContext, useMemo, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Input, PeachScrollView, PrimaryButton, Text } from '../../components'
import { APPVERSION, BUILDNUMBER, UNIQUEID } from '../../constants'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../hooks'
import { showReportSuccess } from '../../overlays/showReportSuccess'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { sendReport } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { account } from '../../utils/account'

const emailRules = { email: true, required: true }
const required = { required: true }

export default (): ReactElement => {
  const route = useRoute<'report'>()
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState('', emailRules)
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(route.params.topic || '', required)
  const [message, setMessage, isMessageValid, messageErrors] = useValidatedState(route.params.message || '', required)
  const [shareDeviceID, setShareDeviceID] = useState(route.params.shareDeviceID || false)
  const reason = route.params.reason

  const showError = useShowErrorBanner()

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
      if (!!account?.publicKey) {
        navigation.navigate('settings')
      } else {
        navigation.navigate('welcome')
      }
      showReportSuccess(updateOverlay)
      return
    }

    if (err) {
      error('Error', err)
      showError(err?.error || 'GENERAL_ERROR')
    }
  }

  return (
    <PeachScrollView contentContainerStyle={tw`flex-grow`}>
      <View style={tw`items-center justify-end h-full px-6 pt-6 pb-10`}>
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
        <Pressable onPress={toggleDeviceIDSharing} style={tw`flex-row items-center justify-center my-5`}>
          <View style={tw`flex items-center justify-center w-5 h-5 ml-4`}>
            {shareDeviceID ? (
              <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
            ) : (
              <View style={tw`w-4 h-4 border-2 rounded-sm border-black-3`} />
            )}
          </View>
          <Text style={tw`flex-shrink pl-2 subtitle-1`}>{i18n('form.includeDeviceIDHash')}</Text>
        </Pressable>

        <PrimaryButton onPress={submit} disabled={!(isEmailValid && isTopicValid && isMessageValid)} narrow>
          {i18n('report.sendReport')}
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
