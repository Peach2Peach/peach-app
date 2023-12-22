import { useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import { useSetOverlay } from '../../../../Overlay'
import { PeachScrollView } from '../../../../components/PeachScrollView'
import { Button } from '../../../../components/buttons/Button'
import { Input } from '../../../../components/inputs/Input'
import { PeachText } from '../../../../components/text/PeachText'
import { useValidatedState } from '../../../../hooks/useValidatedState'
import { useSettingsStore } from '../../../../store/settingsStore'
import tw from '../../../../styles/tailwind'
import { backupAccount } from '../../../../utils/account/backupAccount'
import i18n from '../../../../utils/i18n'
import { BackupCreated } from './BackupCreated'

type Props = {
  toggle: () => void
}

const passwordRules = { required: true, password: true }

export const BackupPasswordPrompt = ({ toggle }: Props) => {
  const updateFileBackupDate = useSettingsStore((state) => state.updateFileBackupDate)

  const [password, setPassword, passwordIsValid, passwordError] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid, passwordRepeatError] = useValidatedState<string>(
    '',
    passwordRules,
  )

  const [isBackingUp, setIsBackingUp] = useState(false)

  const passwordsMatch = useMemo(() => password === passwordRepeat, [password, passwordRepeat])
  const validate = () => !!password && !!passwordRepeat && passwordIsValid && passwordsMatch

  const setOverlay = useSetOverlay()

  const startAccountBackup = () => {
    if (isBackingUp || !validate()) return

    Keyboard.dismiss()

    setIsBackingUp(true)
    updateFileBackupDate()
    backupAccount({
      password,
      onSuccess: () => {
        setIsBackingUp(false)
        toggle()
        setOverlay(<BackupCreated />)
      },
      onCancel: () => {
        setIsBackingUp(false)
      },
      onError: () => {
        setIsBackingUp(false)
      },
    })
  }

  let $passwordRepeat = useRef<TextInput>(null).current
  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`grow`}>
        <View style={tw`justify-center h-full`}>
          <PeachText style={tw`self-center mb-4 tooltip`}>{i18n('settings.backups.createASecurePassword')}</PeachText>
          <Input
            placeholder={i18n('form.password.placeholder')}
            onChange={setPassword}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            errorMessage={passwordError}
            style={passwordIsValid && tw`border-black-65`}
            iconColor={tw.color('black-65')}
          />
          <Input
            placeholder={i18n('form.repeatpassword.placeholder')}
            reference={(el) => ($passwordRepeat = el)}
            onChange={setPasswordRepeat}
            onSubmit={setPasswordRepeat}
            secureTextEntry={true}
            value={passwordRepeat}
            errorMessage={passwordRepeatError}
            style={passwordRepeatIsValid && tw`border-black-65`}
            iconColor={tw.color('black-65')}
          />
        </View>
      </PeachScrollView>
      <Button disabled={!validate()} style={tw`self-center`} onPress={startAccountBackup} iconId="save">
        {i18n('settings.backups.fileBackup.createNew')}
      </Button>
    </>
  )
}
