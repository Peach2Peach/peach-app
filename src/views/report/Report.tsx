import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Fade, Input, Title } from '../../components'
import i18n from '../../utils/i18n'
import { getMessages, rules } from '../../utils/validation'
import { sendReport } from '../../utils/peachAPI'
import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../contexts/message'
import { error } from '../../utils/log'
import { OverlayContext } from '../../contexts/overlay'
import ReportSuccess from '../../overlays/ReportSuccess'
const { useValidation } = require('react-native-form-validator')


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'report'>

type Props = {
  route: RouteProp<{ params: {
    reason: ContactReason,
  } }>,
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
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
        required: true,
      },
      message: {
        required: true,
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
        content: <ReportSuccess navigation={navigation} />,
        showCloseButton: false
      })
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('report.title')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      <View>
        <Input
          onChange={setEmail}
          onSubmit={() => $topic?.focus()}
          value={email}
          label={i18n('form.userEmail')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={getErrorsInField('email')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setTopic}
          onSubmit={() => $message?.focus()}
          reference={(el: any) => $topic = el}
          value={topic}
          label={i18n('form.topic')}
          isValid={!isFieldInError('topic')}
          autoCorrect={false}
          errorMessage={getErrorsInField('topic')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          style={tw`h-40`}
          onChange={setMessage}
          reference={(el: any) => $message = el}
          value={message}
          multiline={true}
          label={i18n('form.message')}
          isValid={!isFieldInError('message')}
          autoCorrect={false}
          errorMessage={getErrorsInField('message')}
        />
      </View>
    </View>
    <Fade show={!keyboardOpen} style={tw`flex items-center mt-16`}>
      <Button
        title={i18n('report.sendReport')}
        wide={false}
        onPress={submit}
      />
    </Fade>
  </View>
}

