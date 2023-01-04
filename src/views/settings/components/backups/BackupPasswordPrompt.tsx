import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput, View } from 'react-native'
import { Icon, Input, PeachScrollView, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { OverlayContext } from '../../../../contexts/overlay'
import { useNavigation, useValidatedState } from '../../../../hooks'
import { BackupCreated } from '../../../../overlays/BackupCreated'
import Password from '../../../../overlays/info/Password'
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

  const openPasswordHelp = () => updateOverlay({ content: <Password />, visible: true, level: 'INFO' })
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
    <PeachScrollView style={tw`h-full flex-shrink mt-12`}>
      <View>
        <View style={tw`items-center justify-center flex-row`}>
          <Text style={tw`text-center`}>{i18n('settings.backups.createASecurePassword')}</Text>
          <Pressable style={tw`p-2`} onPress={openPasswordHelp}>
            <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
          </Pressable>
        </View>

        <Text style={[tw`font-baloo text-2xs text-grey-3 text-center mt-4`, password && !isValid ? tw`text-red` : {}]}>
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
          style={tw`mt-2`}
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
        <PrimaryButton disabled={!isValid} style={tw`mb-2`} narrow onPress={startAccountBackup}>
          {i18n('settings.backups.createNew')}
        </PrimaryButton>
        <PrimaryButton narrow onPress={navigation.goBack}>
          {i18n('back')}
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
