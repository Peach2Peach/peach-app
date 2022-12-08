import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import { Button, Input, Text } from '../../../../components'
import { OverlayContext } from '../../../../contexts/overlay'
import { useNavigation, useValidatedState } from '../../../../hooks'
import { BackupCreated } from '../../../../overlays/BackupCreated'
import tw from '../../../../styles/tailwind'
import { account, backupAccount, updateSettings } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

const passwordRules = { required: true, password: true }

export default (): ReactElement => {
  const [password, setPassword, passwordIsValid] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid] = useValidatedState<string>('', passwordRules)

  const [passwordMatch, setPasswordMatch] = useState(true)
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [isBackingUp, setIsBackingUp] = useState(false)
  let $passwordRepeat = useRef<TextInput>(null).current

  const checkPasswordMatch = () => password === passwordRepeat

  const validate = () => password && passwordRepeat && passwordIsValid && checkPasswordMatch()
  const isValid = validate()

  const onPasswordChange = (value: string) => {
    setPassword(value)
    validate()
    setPasswordMatch(checkPasswordMatch())
  }

  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)
    validate()
    setPasswordMatch(checkPasswordMatch())
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
          showCloseButton: false,
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
            showCloseButton: true,
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
    <View style={tw`h-full flex-shrink flex flex-col mt-12`}>
      <View style={tw`h-full flex-shrink`}>
        <Text style={[tw`font-baloo text-2xs text-grey-3 text-center`, password && !isValid ? tw`text-red` : {}]}>
          {!passwordMatch ? i18n('form.password.match.error') : i18n('form.password.error')}
        </Text>
        <Input
          testID="backup-password"
          onChange={onPasswordChange}
          onSubmit={focusToPasswordRepeat}
          secureTextEntry={true}
          value={password}
          isValid={passwordIsValid && passwordMatch}
        />
        <Input
          style={tw`mt-2 h-12`}
          testID="backup-passwordRepeat"
          reference={(el: any) => ($passwordRepeat = el)}
          onChange={onPasswordRepeatChange}
          onSubmit={onPasswordRepeatChange}
          secureTextEntry={true}
          value={passwordRepeat}
          isValid={passwordRepeatIsValid && passwordMatch}
        />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button
          disabled={!isValid}
          style={tw`mb-2`}
          title={i18n('settings.backups.createNew')}
          wide={false}
          onPress={startAccountBackup}
        />
        <Button title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
