import { useRef } from 'react'
import { TextInput, View } from 'react-native'

import { Input, PeachScrollView, Text } from '../../../../components'
import { NewButton as Button } from '../../../../components/buttons/Button'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { usePasswordPromptSetup } from '../../hooks/usePasswordPromptSetup'

type Props = {
  toggle: () => void
}

export const BackupPasswordPrompt = ({ toggle }: Props) => {
  const {
    setPassword,
    password,
    passwordIsValid,
    passwordError,
    passwordRepeat,
    passwordRepeatIsValid,
    setPasswordRepeat,
    passwordRepeatError,
    validate,
    startAccountBackup,
  } = usePasswordPromptSetup(toggle)

  let $passwordRepeat = useRef<TextInput>(null).current
  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`h-full`}>
        <View style={tw`justify-center h-full`}>
          <Text style={tw`self-center mb-4 tooltip`}>{i18n('settings.backups.createASecurePassword')}</Text>
          <Input
            placeholder={i18n('form.password.placeholder')}
            onChange={setPassword}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            errorMessage={passwordError}
            style={passwordIsValid && tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
          <Input
            placeholder={i18n('form.repeatpassword.placeholder')}
            reference={(el) => ($passwordRepeat = el)}
            onChange={setPasswordRepeat}
            onSubmit={setPasswordRepeat}
            secureTextEntry={true}
            value={passwordRepeat}
            errorMessage={passwordRepeatError}
            style={passwordRepeatIsValid && tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
        </View>
      </PeachScrollView>
      <Button disabled={!validate()} style={tw`self-center`} onPress={startAccountBackup} iconId="save">
        {i18n('settings.backups.fileBackup.createNew')}
      </Button>
    </>
  )
}
