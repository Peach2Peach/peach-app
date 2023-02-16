import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import shallow from 'zustand/shallow'

import { Input, PeachScrollView, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { HelpIcon } from '../../../../components/icons'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../../hooks'
import { useShowHelp } from '../../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../../store/settingsStore'
import tw from '../../../../styles/tailwind'
import { backupAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

const passwordRules = { required: true, password: true }

export default ({ toggle }: { toggle: () => void }): ReactElement => {
  const navigation = useNavigation()

  const [showBackupReminder, setShowBackupReminder, lastBackupDate, setLastBackupDate] = useSettingsStore(
    (state) => [state.showBackupReminder, state.setShowBackupReminder, state.lastBackupDate, state.setLastBackupDate],
    shallow,
  )
  const showPopup = useShowHelp('yourPassword')
  useHeaderSetup({
    title: i18n('settings.backups.fileBackup.title'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showPopup }],
  })

  const [password, setPassword, passwordIsValid, passwordError] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid, passwordRepeatError] = useValidatedState<string>(
    '',
    passwordRules,
  )

  const [isBackingUp, setIsBackingUp] = useState(false)

  let $passwordRepeat = useRef<TextInput>(null).current
  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const passwordsMatch = useMemo(() => password === passwordRepeat, [password, passwordRepeat])
  const validate = () => !!password && !!passwordRepeat && passwordIsValid && passwordsMatch

  const startAccountBackup = () => {
    if (isBackingUp || !validate()) return

    Keyboard.dismiss()

    const previousDate = lastBackupDate || Date.now()
    const previousShowBackupReminder = showBackupReminder
    setIsBackingUp(true)
    setLastBackupDate(Date.now())
    setShowBackupReminder(false)
    backupAccount({
      password,
      onSuccess: () => {
        setIsBackingUp(false)
        setLastBackupDate(Date.now())
        setShowBackupReminder(false)
        toggle()
        navigation.navigate('backupCreated')
      },
      onCancel: () => {
        setIsBackingUp(false)
      },
      onError: () => {
        setIsBackingUp(false)
        setLastBackupDate(previousDate)
        setShowBackupReminder(previousShowBackupReminder)
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
            style={passwordIsValid && tw`border-black-2`}
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
            style={passwordRepeatIsValid && tw`border-black-2`}
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
