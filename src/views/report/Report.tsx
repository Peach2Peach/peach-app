import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'

import { RouteProp } from '@react-navigation/native'
import { Button, Icon, Input, PeachScrollView, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import ReportSuccess from '../../overlays/ReportSuccess'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { sendReport } from '../../utils/peachAPI'
import { getMessages, rules } from '../../utils/validation'
import { UNIQUEID } from '../../constants'
const { useValidation } = require('react-native-form-validator')

type Props = {
  route: RouteProp<{ params: RootStackParamList['report'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(route.params.topic || '')
  const [message, setMessage] = useState(route.params.message || '')
  const [shareDeviceID, setShareDeviceID] = useState(route.params.shareDeviceID || false)
  const reason = route.params.reason

  let $topic = useRef<TextInput>(null).current
  let $message = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { email, topic, message },
    rules,
    messages: getMessages(),
  })

  const toggleDeviceIDSharing = () => setShareDeviceID((b) => !b)

  const submit = async () => {
    validate({
      email: {
        required: true,
        email: true,
      },
      topic: {
        required: true,
      },
      message: {
        required: true,
      },
    })
    if (!isFormValid()) return

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
        content: <ReportSuccess navigation={navigation} />,
      })
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
        level: 'ERROR',
      })
    }
  }

  return (
    <PeachScrollView>
      <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
        <Title title={i18n('report.title')} />
        <View style={tw`h-full flex-shrink mt-12`}>
          <View>
            <Input
              onChange={setEmail}
              onSubmit={() => $topic?.focus()}
              value={email}
              label={i18n('form.userEmail')}
              placeholder={i18n('form.userEmail.placeholder')}
              isValid={!isFieldInError('email')}
              autoCorrect={false}
              errorMessage={getErrorsInField('email')}
            />
          </View>
          <View style={tw`mt-2`}>
            <Input
              onChange={setTopic}
              onSubmit={() => $message?.focus()}
              reference={(el: any) => ($topic = el)}
              value={topic}
              label={i18n('form.topic')}
              placeholder={i18n('form.topic.placeholder')}
              isValid={!isFieldInError('topic')}
              autoCorrect={false}
              errorMessage={getErrorsInField('topic')}
            />
          </View>
          <View style={tw`mt-2`}>
            <Input
              style={tw`h-40`}
              onChange={setMessage}
              reference={(el: any) => ($message = el)}
              value={message}
              multiline={true}
              label={i18n('form.message')}
              placeholder={i18n('form.message.placeholder')}
              isValid={!isFieldInError('message')}
              autoCorrect={false}
              errorMessage={getErrorsInField('message')}
            />
          </View>
          <Pressable onPress={toggleDeviceIDSharing} style={tw`flex flex-row justify-center items-center mt-5`}>
            <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
              {shareDeviceID ? (
                <Icon id="checkbox" style={tw`w-5 h-5`} color={tw`text-peach-1`.color as string} />
              ) : (
                <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
              )}
            </View>
            <Text style={tw`pl-2 flex-shrink text-black-1`}>{i18n('form.includeDeviceIDHash')}</Text>
          </Pressable>
        </View>
        <View style={tw`flex items-center mt-16`}>
          <Button title={i18n('report.sendReport')} wide={false} onPress={submit} />
          {route.name.toString() === 'reportFullScreen' && (
            <Button style={tw`mt-5`} title={i18n('cancel')} wide={false} secondary={true} onPress={navigation.goBack} />
          )}
        </View>
      </View>
    </PeachScrollView>
  )
}
