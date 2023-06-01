import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, PeachScrollView, PrimaryButton } from '../../components'
import { EmailInput } from '../../components/inputs/EmailInput'
import i18n from '../../utils/i18n'
import { useDisputeFormSetup } from './hooks/useDisputeFormSetup'

export default () => {
  const { email, setEmail, emailErrors, reason, message, setMessage, messageErrors, isFormValid, submit, loading }
    = useDisputeFormSetup()
  let $message = useRef<TextInput>(null).current

  return (
    <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
      <View style={tw`justify-center h-full p-6 pb-20`}>
        <EmailInput
          onChange={setEmail}
          onSubmit={() => $message?.focus()}
          value={email}
          placeholder={i18n('form.userEmail.placeholder')}
          errorMessage={emailErrors}
        />
        <Input value={i18n(`dispute.reason.${reason}`)} disabled />
        <Input
          style={tw`h-40`}
          reference={(el: any) => ($message = el)}
          onChange={setMessage}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={messageErrors}
        />
      </View>
      <PrimaryButton
        onPress={submit}
        loading={loading}
        disabled={loading || !isFormValid}
        style={tw`absolute self-center bottom-8`}
        narrow
      >
        {i18n('confirm')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
