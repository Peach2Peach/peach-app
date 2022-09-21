import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'

import { RouteProp } from '@react-navigation/native'
import { Button, Fade, Input, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import keyboard from '../../effects/keyboard'
import ReportSuccess from '../../overlays/ReportSuccess'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { sendReport } from '../../utils/peachAPI'
import { getMessages, rules } from '../../utils/validation'
const { useValidation } = require('react-native-form-validator')

type Props = {
  route: RouteProp<{ params: RootStackParamList['report'] }>
  navigation: StackNavigation
}


export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const reason = route.params.reason

  let $topic = useRef<TextInput>(null).current
  let $message = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { email, topic, message },
    rules,
    messages: getMessages()
  })

  const submit = async () => {
    validate({
      email: {
        required: true,
        email: true
      },
      topic: {
        required: true
      },
      message: {
        required: true
      }
    })
    if (!isFormValid()) return

    const [result, err] = await sendReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message
    })
    if (result) {
      updateOverlay({
        content: <ReportSuccess navigation={navigation} />
      })
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
        level: 'ERROR'
      })
    }
  }

  useEffect(keyboard(setKeyboardOpen), [])

  return (
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
      </View>
      <Fade show={!keyboardOpen} style={tw`flex items-center mt-16`}>
        <Button title={i18n('report.sendReport')} wide={false} onPress={submit} />
        {route.name.toString() === 'reportFullScreen' && (
          <Button style={tw`mt-5`} title={i18n('cancel')} wide={false} secondary={true} onPress={navigation.goBack} />
        )}
      </Fade>
    </View>
  )
}
