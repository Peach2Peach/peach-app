import React, { ReactElement, useContext, useRef, useState } from 'react'
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
  const [password, setPassword, passwordIsValid] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid] = useValidatedState<string>('', passwordRules)

  const [isBackingUp, setIsBackingUp] = useState(false)

  const [, updateOverlay] = useContext(OverlayContext)
  let $passwordRepeat = useRef<TextInput>(null).current

  const checkPasswordMatch = () => password === passwordRepeat

  const validate = () => password && passwordRepeat && passwordIsValid && checkPasswordMatch()
  const isValid = validate()

  const onPasswordChange = (value: string) => {
    setPassword(value)
    validate()
  }

  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)
    validate()
  }

  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const startAccountBackup = () => {
    if (isBackingUp) return
    if (!validate()) return

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
    <PeachScrollView style={tw`flex-shrink h-full mt-12`}>
      <View>
        <Text style={tw`self-center`}>{i18n('settings.backups.createASecurePassword')}</Text>
        <Input
          testID="backup-password"
          onChange={onPasswordChange}
          onSubmit={focusToPasswordRepeat}
          secureTextEntry={true}
          value={password}
          isValid={passwordIsValid && checkPasswordMatch()}
        />
        <Input
          style={tw`mt-2`}
          testID="backup-passwordRepeat"
          reference={(el: any) => ($passwordRepeat = el)}
          onChange={onPasswordRepeatChange}
          onSubmit={onPasswordRepeatChange}
          secureTextEntry={true}
          value={passwordRepeat}
          isValid={passwordRepeatIsValid && checkPasswordMatch()}
        />
      </View>

      <PrimaryButton disabled={!isValid} style={tw`self-center mb-2`} onPress={startAccountBackup} iconId="save" wide>
        {i18n('settings.backups.fileBackup.createNew')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
