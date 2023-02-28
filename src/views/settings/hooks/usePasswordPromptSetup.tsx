import React, { useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput } from 'react-native'
import shallow from 'zustand/shallow'

import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import { backupAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'

const passwordRules = { required: true, password: true }

export const usePasswordPromptSetup = (onSuccess: () => void) => {
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
        onSuccess()
        navigation.navigate('backupCreated')
      },
      onCancel: () => {
        setIsBackingUp(false)
      },
      onError: () => {
        setIsBackingUp(false)
      },
    })
  }
  return {
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
  }
}
