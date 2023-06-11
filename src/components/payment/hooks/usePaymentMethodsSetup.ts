import { useHeaderSetup, usePreviousRouteName, useShowHelp, useToggleBoolean } from '../../../hooks'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const usePaymentMethodsSetup = () => {
  const showHelp = useShowHelp('paymentMethods')
  const origin = usePreviousRouteName()
  const [isEditing, toggleIsEditing] = useToggleBoolean(origin === 'settings')
  useHeaderSetup({
    title: i18n(isEditing ? 'paymentMethods.edit.title' : 'paymentMethods.title'),
    icons:
      account.paymentData.length !== 0 && origin !== 'settings'
        ? [
          {
            ...(isEditing ? headerIcons.checkbox : headerIcons.edit),
            onPress: toggleIsEditing,
          },
          { ...headerIcons.help, onPress: showHelp },
        ]
        : [{ ...headerIcons.help, onPress: showHelp }],
  })

  return isEditing
}
