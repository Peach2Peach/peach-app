import React, { ReactElement, useContext, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import { Input, PeachScrollView, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { OverlayContext } from '../../../../contexts/overlay'
import { useValidatedState } from '../../../../hooks'
import { BackupCreated } from '../../../../overlays/BackupCreated'
import tw from '../../../../styles/tailwind'
import { account, backupAccount, updateSettings } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

const passwordRules = { required: true, password: true }

export default (): ReactElement => {
  const [password, setPassword, passwordIsValid, passwordError] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid, passwordRepeatError] = useValidatedState<string>(
    '',
    passwordRules,
  )

  const [isBackingUp, setIsBackingUp] = useState(false)

  const [, updateOverlay] = useContext(OverlayContext)

  let $passwordRepeat = useRef<TextInput>(null).current
  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const passwordsMatch = useMemo(() => password === passwordRepeat, [password, passwordRepeat])
  const formIsValid = useMemo(
    () => !!password && !!passwordRepeat && passwordIsValid && passwordRepeatIsValid && passwordsMatch,
    [password, passwordRepeat, passwordIsValid, passwordRepeatIsValid, passwordsMatch],
  )
  const validate = () => !!password && !!passwordRepeat && passwordIsValid && passwordsMatch

  const startAccountBackup = () => {
    if (isBackingUp || !validate()) return

    Keyboard.dismiss()

    const previousDate = account.settings.lastBackupDate
    const previousShowBackupReminder = account.settings.showBackupReminder
    setIsBackingUp(true)
    updateSettings(
      {
        lastBackupDate: new Date().getTime(),
        showBackupReminder: false,
      },
      true,
    )
    backupAccount({
      password,
      onSuccess: () => {
        updateOverlay({
          content: <BackupCreated />,
          visible: true,
        })
        updateSettings(
          {
            lastBackupDate: new Date().getTime(),
            showBackupReminder: false,
          },
          true,
        )
        setIsBackingUp(false)

        setTimeout(() => {
          updateOverlay({
            content: null,
            visible: true,
          })
        }, 3000)
      },
      onCancel: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
      onError: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
    })
  }

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`h-full`}>
        <View style={tw`justify-center h-full mx-8`}>
          <Text style={tw`self-center mb-4 tooltip`}>{i18n('settings.backups.createASecurePassword')}</Text>
          <Input
            testID="backup-password"
            placeholder={i18n('form.password.placeholder')}
            onChange={setPassword}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            errorMessage={passwordError}
            style={tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
          <Input
            testID="backup-passwordRepeat"
            placeholder={i18n('form.repeatpassword.placeholder')}
            reference={(el: any) => ($passwordRepeat = el)}
            onChange={setPasswordRepeat}
            onSubmit={setPasswordRepeat}
            secureTextEntry={true}
            value={passwordRepeat}
            errorMessage={passwordRepeatError}
            style={tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
        </View>
      </PeachScrollView>
      <PrimaryButton disabled={!validate()} style={tw`self-center mb-6`} onPress={startAccountBackup} iconId="save" wide>
        {i18n('settings.backups.fileBackup.createNew')}
      </PrimaryButton>
    </>
  )
}
