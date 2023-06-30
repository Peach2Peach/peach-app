import { useMemo, useState } from 'react'
import { Keyboard } from 'react-native'

import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import { backupAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

const passwordRules = { required: true, password: true }

export const usePasswordPromptSetup = (onSuccess: () => void) => {
  const navigation = useNavigation()

  const updateFileBackupDate = useSettingsStore((state) => state.updateFileBackupDate)
  const showPopup = useShowHelp('yourPassword')
  useHeaderSetup({
    title: i18n('settings.backups.fileBackup.title'),
    icons: [{ ...headerIcons.help, onPress: showPopup }],
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

    setIsBackingUp(true)
    updateFileBackupDate()
    backupAccount({
      password,
      onSuccess: () => {
        setIsBackingUp(false)
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
